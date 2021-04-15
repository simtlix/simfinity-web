import axios from "axios";

export const requestEntity = async (displayEntities) => {
  const name = displayEntities.name;
  const fields = displayEntities.fields;
  let pluralName = "";
  //const queryFields = fields.map((element) => element.name);
  //harcoded name of entities
  switch (name) {
    case "episode":
      pluralName = "episodes";
      break;
    case "season":
      pluralName = "seasons";
      break;
    case "star":
      pluralName = "stars";
      break;
    case "serie":
      pluralName = "series";
      break;
    case "director":
      pluralName = "directors";
      break;
    case "assignedStarAndSerie":
      pluralName = "assignedStarsAndSeries";
      break;
    default:
      console.log("default");
  }
  let queryFields = [];
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].extensions == null) {
      queryFields.push(fields[i].name);
      console.log(queryFields);
    } else {
      //Aca hay que hacer algo para obtener los sub fields
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
        ${pluralName}{
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
