import axios from "axios";

export const requestEntity = async (displayEntities, userInput) => {
  const mutationField = displayEntities.mutations.add;
  //donde definimos que queremos ver en la respuesta del servicio
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
      url: "https://multiscreen-techgroup.rj.r.appspot.com/graphql",
      data,
    };

    const response = await axios(config);
    return response;
    //const responseData = response.data && response.data.data;
    //return responseData;
  } catch (error) {
    console.log(error);
  }
};
