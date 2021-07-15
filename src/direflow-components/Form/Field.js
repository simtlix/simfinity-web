import React from "react";
import { Form as FormAntd, Input, Select, DatePicker, InputNumber, Col } from "antd";
import { SelectEntities } from "./SelectEntities";
import { EmbeddedForm } from "./EmbeddedForm";
import { isDate, isEnum, isNumber } from './utils';
import { useIntl } from "react-intl";
const { Option } = Select;


export const Field = ({field, parentFieldName, entity, form, openForResult, renderLabel = true, onConfirm, reference, span}) => {
    const intl = useIntl()
    const fieldName = parentFieldName ? [parentFieldName, field.name] : field.name;
    const nameField = field?.name != null ? field.name : "";
    const label = intl.formatMessage({ id: `entity.${entity.name}.fields.${nameField}`, defaultMessage: nameField.toUpperCase() });
    if (field?.extensions?.stateMachine) {
        return null;
    } else if (field?.type?.kind === "OBJECT" &&
        field?.extensions?.relation?.embedded == null) {
        return <Col span={span}><SelectEntities key={`${fieldName}`} name={fieldName} field={field} form={form} openForResult={openForResult} label={renderLabel?label:undefined} /></Col>;
    } else if (isEnum(field)) {
        return (
            <Col span={span}>
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
            </Col>
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
                span={span} 
                fromForm/>
           
        );
    } else {
        if (isNumber(field)) {
            return (
                <Col span={span}>
                    <FormAntd.Item key={fieldName} name={fieldName} label={renderLabel?label:undefined}>
                        <InputNumber onBlur={onConfirm} onPressEnter={onConfirm} ref={reference}/>
                    </FormAntd.Item>
                </Col>
            );
        } else if (isDate(field)) {
            return (
                <Col span={span}>
                    <FormAntd.Item key={fieldName} name={fieldName} label={renderLabel?label:undefined}>
                        <DatePicker onBlur={onConfirm} onPressEnter={onConfirm} ref={reference}/>
                    </FormAntd.Item>
                </Col>
            );
        } else {
            return (
                <Col span={span}>
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
                </Col>
            );
        }
    }
};


