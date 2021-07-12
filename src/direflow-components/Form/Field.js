import React from "react";
import { Form as FormAntd, Input, Select, DatePicker, InputNumber } from "antd";
import { SelectEntities } from "./SelectEntities";
import { EmbeddedForm } from "./EmbeddedForm";
import { isDate, isEnum, isNumber } from './utils';
import { useIntl } from "react-intl";
const { Option } = Select;


export const Field = ({field, parentFieldName, entity, form, openForResult, renderLabel = true, onConfirm, reference}) => {
    const intl = useIntl()
    const fieldName = parentFieldName ? [parentFieldName, field.name] : field.name;
    const nameField = field?.name != null ? field.name : "";
    const label = intl.formatMessage({ id: `entity.${entity.name}.fields.${nameField}`, defaultMessage: nameField.toUpperCase() });
    if (field?.extensions?.stateMachine) {
        return null;
    } else if (field?.type?.kind === "OBJECT" &&
        field?.extensions?.relation?.embedded == null) {
        return <SelectEntities key={`${fieldName}`} name={fieldName} field={field} form={form} openForResult={openForResult} label={renderLabel?label:undefined} />;
    } else if (isEnum(field)) {
        return (
            <FormAntd.Item key={fieldName} name={fieldName} label={renderLabel?label:undefined}>
                <Select allowClear onBlur={onConfirm} onPressEnter={onConfirm} ref={r => reference.current = r}>
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
    } else if (field?.type?.kind === "OBJECT" &&
        field?.extensions?.relation?.embedded === true) {

        return (
            <EmbeddedForm
                key={fieldName}
                field={field}
                form={form}
                openForResult={openForResult}
                entity={entity} 
                fromForm/>
        );
    } else {
        if (isNumber(field)) {
            return (
                <FormAntd.Item key={fieldName} name={fieldName} label={renderLabel?label:undefined}>
                    <InputNumber onBlur={onConfirm} onPressEnter={onConfirm} ref={reference}/>
                </FormAntd.Item>
            );
        } else if (isDate(field)) {
            return (
                <FormAntd.Item key={fieldName} name={fieldName} label={renderLabel?label:undefined}>
                    <DatePicker onBlur={onConfirm} onPressEnter={onConfirm} ref={reference}/>
                </FormAntd.Item>
            );
        } else {
            return (
                <FormAntd.Item key={fieldName} name={fieldName}
                    label={renderLabel?label:undefined}
                    rules={[
                        {
                            required: field?.type?.kind === "NON_NULL",
                        },
                    ]}
                >
                    <Input onBlur={onConfirm} onPressEnter={onConfirm} ref={reference}/>
                </FormAntd.Item>
            );
        }
    }
};


