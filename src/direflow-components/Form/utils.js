import axios from "axios";




export const requestAddNewEntity = async (displayEntities, userInput, url) => {
  const mutationField = displayEntities.mutations.add;
  const responseFields = "id";
  const objUserInput = userInput;
  // we have the format {"propertyName": "propertyValue"}
  const json = JSON.stringify(objUserInput);
  // convert {"propertyName": "propertyValue"} to {propertyName: "propertyValue"}
  const unquoted = json.replace(/"([^"]+)":/g, "$1:");

  try {
    const data = JSON.stringify({
      query: `mutation {
        ${mutationField}(input : ${unquoted}){
                ${responseFields}
              }
            }`,
      variables: null,
    });

    const config = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      url: url,
      data,
    };

    const response = await axios(config);
    const responseData = response.data && response.data.data;
    return responseData;
  } catch (error) {
    console.log(error);
  }
};

export const isBoolean = (field) => {
  if(field.type.name === "Boolean" || field.type?.ofType?.name === "Boolean")
    return true;
  else
    return false;
}

export const isNumber = (field) => {
  if(field.type.name === "Int" || field.type?.ofType?.name === "Int" || field.type.name === "Float" || field.type?.ofType?.name === "Float")
    return true;
  else
    return false;
}

export const isString = (field) => {
  if(field.type.name === "String" || field.type?.ofType?.name === "String")
    return true;
  else
    return false;
}

export const isDate = (field) => {
  if(field.type.name === "Date" || field.type?.ofType?.name === "Date" || field.type.name === "DateTime" || field.type?.ofType?.name === "DateTime")
    return true;
  else
    return false;
}

export const isEnum = (field) => {
  if(field.type.kind === "ENUM" || field.type?.ofType?.kind === "ENUM")
    return true;
  else
    return false;
}


