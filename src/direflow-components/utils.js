import axios from 'axios';

const excludedTypes = [
  'RootQueryType', 'Mutation', '__Schema', 'FieldExtensionsType', 'RelationType',
  '__Type' , '__Field', '__InputValue', '__EnumValue', '__Directive'];
const objectKind = 'OBJECT';

export const requestEntities = async (url) => {
  try {
    const data = JSON.stringify({
      query: `{
              __schema {
                types {
                  name
                  kind
                  fields {
                    name
                    extensions {
                      relation {
                        embedded
                        connectionField
                      }
                    }
                    type {
                      kind
                      name
                      ofType {
                        kind
                        name
                      }
                    }
                  }
                }
              }
            }`,
    });

    const config = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      url,
      data
    };

    const response = await axios(config);
    const responseData = response.data && response.data.data;
    const types = responseData && responseData.__schema && responseData.__schema.types;

    if (types) {
      return types.filter(type => type.kind === objectKind && excludedTypes.indexOf(type.name) === -1);
    }
  } catch (error) {
    console.log(error);
  }
};
