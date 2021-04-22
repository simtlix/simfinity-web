import axios from "axios";

export const requestEntity = async (displayEntities) => {
  const entityName = displayEntities.queryAll;
  const fields = displayEntities.fields;
  let queryFields = [];
  //console.log(fields);
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].extensions == null) {
      queryFields.push(fields[i].name);
    } else {
      if (
        fields[i].type.kind !== "LIST" &&
        fields[i]?.extensions?.relation?.displayField //!fields[i]?.extensions?.relation?.embedded Esto es por el name de star? saca director
      ) {
        console.log(fields[i].extensions.relation.displayField);
        let obj = `${fields[i].name}{${fields[i].extensions.relation.displayField}}`;
        queryFields.push(obj);
        console.log(queryFields);
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
        ${entityName}{
                ${formatQueryFields}
              }
            }`,
    });

    const config = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      url: "https://multiscreen-techgroup.rj.r.appspot.com/graphql",
      data,
    };

    const response = await axios(config);
    console.log(response);
    const responseData = response.data && response.data.data;
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
