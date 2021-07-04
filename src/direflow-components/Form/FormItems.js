import React from "react";
import { Field } from "./Field";

export const FormItems = ({fields, parentFieldName, form, openForResult, entity}) =>{
    const renderFormFields = fields.map(field => {
        const fieldName = parentFieldName ? [parentFieldName, field.name] : field.name;
        return <Field parentFieldName={parentFieldName} entity={entity} form={form} openForResult={openForResult} field={field} key={fieldName}></Field>
    });
  
    return renderFormFields;
  }


