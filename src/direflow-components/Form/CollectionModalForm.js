/* eslint-disable react/prop-types */
import React from 'react';
import 'antd/dist/antd.css';
import { Modal, Form } from 'antd';
import { FormItems } from "./FormItems";


export const CollectionModalForm = ({ onCreate, onCancel, entity, openForResultHandler, collectionField }) => {
  const [form] = Form.useForm();
  
  const filteredFields = entity.fields.filter(
    (field) => 
    (field.name !== "id" && field.type.kind !== "LIST") 
    || 
    (field.type.kind === "OBJECT" && 
     field?.extensions?.relation?.displayField && 
     field?.extensions?.relation?.connectionField !== collectionField?.extensions?.relation?.connectionField)
  )

  return (
    <Form
        form={form}
        layout="vertical"
        name="form_in_modal"

      >
        <FormItems fields={filteredFields} form={form} openForResult={openForResultHandler} entity={entity}></FormItems>

      </Form>
  );
};

