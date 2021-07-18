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



