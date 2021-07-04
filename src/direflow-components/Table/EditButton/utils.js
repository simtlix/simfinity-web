import axios from "axios";

export const requestEditEntity = async (displayEntities, entity, data) => {
  data.id = entity.id;

  const mutationField = displayEntities.mutations.update;

  const responseFields = "id";
  const json = JSON.stringify(data);
  const unquoted = json.replace(/"([^"]+)":/g, "$1:");
  try {
    const data = JSON.stringify({
      query: `mutation {
          ${mutationField}(input : ${unquoted}){
                  ${responseFields}
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

    const responseData = response.data && response.data.data;
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
