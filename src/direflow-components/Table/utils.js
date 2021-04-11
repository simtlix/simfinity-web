import axios from "axios";

export const requestEntity = async (fields) => {
  var queryFields = fields.map((element) => element.name);
  if (queryFields) {
    var formatQueryFields = "";
    //harcoded index
    for (var i = 0; i < /*queryFields.length*/ 4; i++) {
      formatQueryFields = formatQueryFields + queryFields[i] + ", ";
    }
  }
  try {
    const data = JSON.stringify({
      query: `{
              episodes{
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
    const responseData = response.data && response.data.data;
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
