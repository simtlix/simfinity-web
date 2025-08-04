import axios from 'axios';

const excludedTypes = [
  'RootQueryType',
  'Mutation',
  '__Schema',
  'FieldExtensionsType',
  'RelationType',
  '__Type',
  '__Field',
  '__InputValue',
  '__EnumValue',
  '__Directive',
];
const objectKind = 'OBJECT';
const listKind = 'LIST';
const enumKind = 'ENUM';

export const requestEntities = async (url) => {
  try {
    const data = JSON.stringify({
      query: `{
              __schema {
                types {
                  name
                  kind
                  fields {
                    name
                    description
                    extensions {
                      stateMachine
                      relation {
                        embedded
                        connectionField
                        displayField
                      }
                    }
                    type {
                      kind
                      name
                      ofType {
                        kind
                        name
                      }
                    }
                  }
                  enumValues { 
                    name 
                    description
                  }
                }
              }
            }`,
    });

    const config = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      url,
      data,
    };

    const response = await axios(config);
    const responseData = response.data && response.data.data;
    const types =
      responseData && responseData.__schema && responseData.__schema.types;
    const rootQueryTypes = types
      .find((type) => type.name === 'RootQueryType')
      .fields.filter((field) => field.type.kind === listKind);
    const mutations = types.find((type) => type.name === 'Mutation').fields;

    if (types) {
      let filteredTypes = types.filter(
        (type) =>
          type.kind === objectKind && excludedTypes.indexOf(type.name) === -1
      );

      //Add queryAll field
      for (const queryType of rootQueryTypes) {
        const typeName = queryType.type.ofType.name;
        const queryAllName = queryType.name;

        filteredTypes = filteredTypes.map((type) => {
          if (type.name === typeName) {
            type.queryAll = queryAllName;
          }
          return type;
        });
      }

      //Add mutations field
      for (const mutation of mutations) {
        const typeName = mutation.type.name;

        filteredTypes = filteredTypes.map((type) => {
          if (type.name === typeName) {
            type.mutations = {
              ...type.mutations,
              [mutation.description || mutation.name]: mutation.name,
            };
          }
          return type;
        });
      }

      //Add enum values
      for (const type of filteredTypes) {
        for (const field of type.fields) {
          if (field.type.kind === enumKind) {
            const enumType = types.find(
              (t) => t.kind === enumKind && t.name === field.type.name
            );
            field.enumValues = enumType.enumValues;
          }
        }
        delete type.enumValues;
      }

      return filteredTypes;
    }
  } catch (error) {
    console.log(error);
  }
};

const buildFilters = (filters) => {
  if (!filters) return '';

  let filterStr = '';

  Object.keys(filters).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(filters, key)) {
      const filter = filters[key];
      if (filter.terms) {
        let linkFilterStr = '';
        Object.keys(filter.terms).forEach((item) => {
          if (Object.prototype.hasOwnProperty.call(filter.terms, item)) {
            const linkFilter = filter.terms[item];
            linkFilterStr += ` {path:"${
              linkFilter.key + (linkFilter.field ? `.${linkFilter.field}` : '')
            }" operator:${
              linkFilter.operator === 'EQ' && isDate(linkFilter.entity)
                ? 'BTW'
                : linkFilter.operator
            } value:${
              linkFilter.entity.type.kind !== 'OBJECT'
                ? formatValue(
                    linkFilter.value,
                    linkFilter.entity,
                    linkFilter.operator
                  )
                : `"${linkFilter.value}"`
            } }, `;
          }
        });
        filterStr += ` ${filter.key}:{terms:[${linkFilterStr}]}, `;
      } else if (filter.entity.type.kind !== 'OBJECT') {
        if (isDate(filter.entity)) {
          filterStr += ` ${filter.key}:{operator:${
            filter.operator === 'EQ' ? 'BTW' : filter.operator
          } value:${formatValue(
            filter.value,
            filter.entity,
            filter.operator
          )}} `;
        } else {
          filterStr += ` ${filter.key}:{operator:${
            filter.operator
          } value:${formatValue(
            filter.value,
            filter.entity,
            filter.operator
          )} } `;
        }
      } else {
        filterStr += ` ${filter.key}:{terms:[{operator:${
          filter.operator
        } value:${formatValue(
          filter.value,
          filter.entity,
          filter.operator
        )} path:"${filter.field}"}]} `;
      }
    }
  });
  return filterStr;
};

const formatValue = (value, entity, operator) => {
  if (isDate(entity)) {
    if (operator === 'EQ') {
      return ` ["${value.startOf('day').toJSON()}","${value
        .endOf('day')
        .toJSON()}"] `;
    } else {
      return `"${value.startOf('day').toJSON()}"`;
    }
  } else if (isStringOrEnum(entity)) {
    return ` "${value}" `;
  } else {
    return `${value}`;
  }
};

const isStringOrEnum = (entity) =>
  entity.type.kind === 'ENUM' ||
  entity.type.name === 'String' ||
  (entity.type.kind === 'NON_NULL' && entity.type.ofType.name === 'String') ||
  (entity.type.kind === 'NON_NULL' && entity.type.ofType.kind === 'ENUM') ||
  entity.extensions?.relation?.displayFieldScalarType === 'String';

export const requestEntity = async (
  displayEntities,
  url,
  page,
  size,
  filters,
  sort,
  entities
) => {
  const entityName = displayEntities.queryAll;
  const fields = displayEntities.fields;
  let queryFields = [];
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].extensions == null) {
      queryFields.push(fields[i].name);
    } else {
      if (fields[i].type.kind !== 'LIST') {
        if (fields[i]?.extensions?.relation?.displayField) {
          if (fields[i].extensions.relation.embedded && entities) {
            const embeddedEntity = entities.filter(
              (item) => item.name === fields[i].type.name
            )[0];
            let fieldsStr = '';
            embeddedEntity.fields.forEach(
              (item) => (fieldsStr = fieldsStr + ` ${item.name} `)
            );
            let obj = `${fields[i].name}{${fieldsStr}}`;
            queryFields.push(obj);
          } else {
            let obj = `${fields[i].name}{${
              fields[i].extensions.relation.displayField
            }${fields[i].extensions.relation.embedded ? '' : ', id'}}`;
            queryFields.push(obj);
          }
        } else if (fields[i]?.extensions?.relation == null) {
          queryFields.push(fields[i].name);
        }
      }
    }
  }
  let formatQueryFields = '';
  if (queryFields) {
    for (let i = 0; i < queryFields.length; i++) {
      formatQueryFields = formatQueryFields + queryFields[i] + ', ';
    }
  }
  try {
    const data = JSON.stringify({
      query: `{
        ${entityName}(${buildFilters(
        filters
      )} pagination:{page:${page} size:${size} count:true} ${
        sort ? `sort:{terms:[{field:"${sort.field}" order:${sort.order}}]}` : ''
      }){
                ${formatQueryFields}
              }
            }`,
    });

    const config = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      url: url,
      data,
    };

    const response = await axios(config);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const isBoolean = (field) => {
  return (
    field.type.name === 'Boolean' || field.type?.ofType?.name === 'Boolean'
  );
};

export const isNumber = (field) => {
  return (
    field.type.name === 'Int' ||
    field.type?.ofType?.name === 'Int' ||
    field.type.name === 'Float' ||
    field.type?.ofType?.name === 'Float'
  );
};

export const isString = (field) => {
  return field.type.name === 'String' || field.type?.ofType?.name === 'String';
};

export const isDate = (field) => {
  return (
    field.type.name === 'Date' ||
    field.type?.ofType?.name === 'Date' ||
    field.type.name === 'DateTime' ||
    field.type?.ofType?.name === 'DateTime' ||
    field.extensions?.relation?.displayFieldScalarType === 'Date' ||
    field.extensions?.relation?.displayFieldScalarType === 'DateTime'
  );
};

export const isEnum = (field) => {
  return field.type.kind === 'ENUM' || field.type?.ofType?.kind === 'ENUM';
};

export const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
