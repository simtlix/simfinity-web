import React from "react";
import { Form as FormAntd, Input, Select, DatePicker, InputNumber} from "antd";
import { SelectEntities } from "./SelectEntities";
import { EmbeddedForm } from "./EmbeddedForm";
import { useIntl } from 'react-intl';
import { isDate, isEnum, isNumber} from './utils'

const { Option } = Select;

export const FormItems = ({fields, parentFieldName, form, openForResult, entity}) =>{
    const intl = useIntl()
    const renderFormFields = fields.map((field) => {
      const fieldName = parentFieldName? [parentFieldName, field.name] : field.name;
      const nameField = field?.name != null ? field.name : "";
      const label = intl.formatMessage({id:`entity.${entity.name}.fields.${nameField}`, defaultMessage: nameField.toUpperCase()});
      if (field?.extensions?.stateMachine) {
        return null;
      } else if (
        field?.type?.kind === "OBJECT" &&
        field?.extensions?.relation?.embedded == null 
      ) {
        return <SelectEntities key={fieldName} name={fieldName} field={field} form={form} openForResult={openForResult} label={label}/>;
      } else if (
        isEnum(field)
      ) {
        return (
          <FormAntd.Item key={fieldName} name={fieldName} label={label}>
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
            form={form}
            openForResult={openForResult}
            entity = {entity}
          />
        );
      } else {
        if (isNumber(field)) {
          return (
            <FormAntd.Item key={fieldName} name={fieldName} label={label}>
              <InputNumber
              />
            </FormAntd.Item>
          );
        } else if (isDate(field)) {
          return (
            <FormAntd.Item key={fieldName} name={fieldName} label={label}>
              <DatePicker/>
            </FormAntd.Item>
          );
        } else {
          return (
            <FormAntd.Item key={fieldName} name={fieldName} 
             label={label}
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