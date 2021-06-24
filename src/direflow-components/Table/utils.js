import axios from "axios";

const buildFilters = (filters) => {
  if(!filters)
    return ''

  let filterStr = '';

  Object.keys(filters).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(filters, key)){
      const filter = filters[key];
      if(filter.terms){
        let linkFilterStr = "";
        Object.keys(filter.terms).forEach(item =>{
          if (Object.prototype.hasOwnProperty.call(filter.terms, item)){
            const linkFilter = filter.terms[item];
            linkFilterStr += ` {path:"${linkFilter.key + (linkFilter.field?`.${linkFilter.field}`:"")}" operator:${linkFilter.operator==="EQ" && isDate(linkFilter.entity)?"BTW":linkFilter.operator} value:${linkFilter.entity.type.kind !== "OBJECT"?formatValue(linkFilter.value, linkFilter.entity, linkFilter.operator):`"${linkFilter.value}"`} }, `
          }
        })
        filterStr += ` ${filter.key}:{terms:[${linkFilterStr}]}, `
      } else if(filter.entity.type.kind !== "OBJECT"){
        if(isDate(filter.entity)){
          filterStr += ` ${filter.key}:{operator:${filter.operator==="EQ"?"BTW":filter.operator} value:${formatValue(filter.value, filter.entity, filter.operator)}} `
        } else {
          filterStr += ` ${filter.key}:{operator:${filter.operator} value:${formatValue(filter.value, filter.entity, filter.operator)} } `
        }
      } else {
        filterStr += ` ${filter.key}:{terms:[{operator:${filter.operator} value:"${filter.value}" path:"${filter.field}"}]} `
      }
    }
  })
  return filterStr;
}

const formatValue = (value, entity, operator) => {
  if(isDate(entity)){
    if(operator === "EQ"){
      return ` ["${value.startOf('day').toJSON()}","${value.endOf('day').toJSON()}"] `
    } else {
      return `"${value.startOf('day').toJSON()}"`
    }
  } else if(isStringOrEnum(entity)){
    return ` "${value}" `
  } else{
    return `${value}`
  }
}

const isStringOrEnum = (entity) => (entity.type.kind === "ENUM" || entity.type.name === "String" || (entity.type.kind === "NON_NULL" && entity.type.ofType.name === "String") || (entity.type.kind === "NON_NULL" && entity.type.ofType.kind === "ENUM"))

const isDate = (field) => {
  if(field.type.name === "Date" || field.type?.ofType?.name === "Date" || field.type.name === "DateTime" || field.type?.ofType?.name === "DateTime")
    return true;
  else
    return false;
}

export const requestEntity = async (displayEntities, url, page, size, filters) => {
  const entityName = displayEntities.queryAll;
  const fields = displayEntities.fields;
  let queryFields = [];
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].extensions == null) {
      queryFields.push(fields[i].name);
    } else {
      if (fields[i].type.kind !== "LIST") {
        if (fields[i]?.extensions?.relation?.displayField) {
          let obj = `${fields[i].name}{${fields[i].extensions.relation.displayField}}`;
          queryFields.push(obj);
        } else if (fields[i]?.extensions?.relation == null) {
          queryFields.push(fields[i].name);
        }
      }
    }
  }
  let formatQueryFields = "";
  if (queryFields) {
    for (let i = 0; i < queryFields.length; i++) {
      formatQueryFields = formatQueryFields + queryFields[i] + ", ";
    }
  }
  try {
    const data = JSON.stringify({
      query: `{
        ${entityName}(${buildFilters(filters)} pagination:{page:${page} size:${size} count:true}){
                ${formatQueryFields}
              }
            }`,
    });

    const config = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      url: url,
      data,
    };

    const response = await axios(config);
    return response;
  } catch (error) {
    console.log(error);
  }
};
