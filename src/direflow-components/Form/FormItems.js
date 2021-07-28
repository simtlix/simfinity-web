import React from "react";
import { Field } from "./Field";


export const FormItems = ({fields, parentFieldName, form, openForResult, entity, span=12}) =>{
    const renderFormFields = fields.map((field) => {
        const fieldName = parentFieldName ? [parentFieldName, field.name] : field.name;
        return <Field parentFieldName={parentFieldName} entity={entity} form={form} openForResult={openForResult} field={field} key={fieldName} span={span}></Field>
    });
  
    return renderFormFields;
  }


