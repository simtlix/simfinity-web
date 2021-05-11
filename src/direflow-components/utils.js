import axios from 'axios';

const excludedTypes = [
  'RootQueryType', 'Mutation', '__Schema', 'FieldExtensionsType', 'RelationType',
  '__Type' , '__Field', '__InputValue', '__EnumValue', '__Directive'];
const objectKind = 'OBJECT';
const listKind = 'LIST';

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
                    description
                    extensions {
                      relation {
                        embedded
                        connectionField
                        displayField
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
    const rootQueryTypes = types.find(type => type.name === 'RootQueryType').fields.filter(field => field.type.kind === listKind);
    const mutations = types.find(type => type.name === 'Mutation').fields;

    if (types) {
      let filteredTypes = types.filter(type => type.kind === objectKind && excludedTypes.indexOf(type.name) === -1);

      for (const queryType of rootQueryTypes) {
        const typeName = queryType.type.ofType.name;
        const queryAllName = queryType.name;

        filteredTypes = filteredTypes.map(type => {
          if (type.name === typeName) {
            type.queryAll = queryAllName;
          }
          return type;
        })
      }

      for (const mutation of mutations) {
        const typeName = mutation.type.name;

        filteredTypes = filteredTypes.map(type => {
          if (type.name === typeName) {
            type.mutations = { ...type.mutations, [mutation.description || mutation.name]: mutation.name }
          }
          return type;
        })
      }

      return filteredTypes;
    }
  } catch (error) {
    console.log(error);
  }
};
