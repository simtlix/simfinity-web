import axios from "axios";

export const deleteEntity = async (displayEntities, id, url) => {
  const entityName = displayEntities.mutations.delete
  try {
    const data = JSON.stringify({
      query: `mutation {
        ${entityName}(id:"${id}"){
                id
              }
            }`,
    });

    const config = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      url,
      data,
    };

    const response = await axios(config);

    const responseData = response.data && response.data.data;
    return responseData;
  } catch (error) {
    console.log(error);
  }
};