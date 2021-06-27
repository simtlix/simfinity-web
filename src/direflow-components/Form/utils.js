import axios from "axios";
import React from "react";
import { Form as FormAntd, Button, Input, Select, Row, Col, DatePicker, InputNumber} from "antd";
import { SelectEntities } from "./SelectEntities";
import { EmbeddedForm } from "./EmbeddedForm";
const { Option } = Select;

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

export const getFormItems = (fields, parentFieldName) =>{
  const renderFormFields = fields.map((field) => {
    const fieldName = parentFieldName? [parentFieldName, field.name] : [field.name];
    const nameField = field?.name != null ? field.name : "";
    if (field?.extensions?.stateMachine) {
      return null;
    } else if (
      field?.type?.kind === "OBJECT" &&
      field?.extensions?.relation?.embedded == null 
    ) {
      return <SelectEntities key={fieldName} name={fieldName} field={field} />;
    } else if (
      isEnum(field)
    ) {
      return (
        <FormAntd.Item key={fieldName} name={fieldName} label={nameField.toUpperCase()}>
          <Select allowClear>
            {field?.enumValues.map((item) => {
              return (
                <Option key={item.name} value={item.name}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </FormAntd.Item>
      );
    } else if (
      field?.type?.kind === "OBJECT" &&
      field?.extensions?.relation?.embedded === true
    ) {
     
      return (
        <EmbeddedForm
          key={fieldName}
          field={field}
        />
      );
    } else {
      if (isNumber(field)) {
        return (
          <FormAntd.Item key={fieldName} name={fieldName} label={nameField.toUpperCase()}>
            <InputNumber
            />
          </FormAntd.Item>
        );
      } else if (isDate(field)) {
        return (
          <FormAntd.Item key={fieldName} name={fieldName} label={nameField.toUpperCase()}>
            <DatePicker/>
          </FormAntd.Item>
        );
      } else {
        return (
          <FormAntd.Item key={fieldName} name={fieldName} 
            label={nameField.toUpperCase()}
            rules={[
              {
                required: field?.type?.kind === "NON_NULL",
              },
            ]}
            >
            <Input
            />
          </FormAntd.Item>
        );
      }
    }
  });

  return renderFormFields;
}
