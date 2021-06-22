import axios from "axios";

const buildFilters = (filters) => {
  if(!filters)
    return ''

  let filterStr = '';

  Object.keys(filters).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(filters, key)){
      const filter = filters[key];
      if(filter.entity.type.kind !== "OBJECT"){
        filterStr += ` ${filter.key}:{operator:${filter.operator} value:${formatValue(filter.value, filter.entity)} } `
      } else {
        filterStr += ` ${filter.key}:{terms:[{operator:${filter.operator} value:"${filter.value}" path:"${filter.field}"}]} `
      }
    }
  })
  return filterStr;
}

const formatValue = (value,entity) => ` ${isString(entity)?"\"":""}${value}${isString(entity)?"\"":""} `

const isString = (entity) => (entity.type.name === "String" || (entity.type.kind === "NON_NULL" && entity.type.ofType.name === "String"))

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
