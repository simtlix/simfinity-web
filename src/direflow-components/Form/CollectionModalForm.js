/* eslint-disable react/prop-types */
import React from 'react';
import 'antd/dist/antd.css';
import {  Form, Button } from 'antd';
import { FormItems } from "./FormItems";


export const CollectionModalForm = ({ onCreate, onCancel, entity, openForResultHandler, collectionField }) => {
  const [form] = Form.useForm();
  
  

  const filteredFields = entity.fields.filter(
    (field) => {
      if (field.name !== "id" &&
      field.type.kind !== "LIST" &&
      field.type.kind !== "OBJECT") {
        return true;
      } else if (field.type.kind === "OBJECT" &&
      field?.extensions?.relation?.displayField && 
      field?.extensions?.relation?.connectionField !== collectionField?.extensions?.relation?.connectionField) {
        return true;
      } else {
        return false;
      }
    }
  );


  return (
    <Form
        form={form}
        layout="horizontal"
        wrapperCol={{ sm: 8 }}      
        name="form_in_modal"
        onFinish={(values) => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                onCreate(values);
              })
              .catch((info) => {
                console.log('Validate Failed:', info);
              });
          }}

      >
        <FormItems fields={filteredFields} form={form} openForResult={openForResultHandler} entity={entity}></FormItems>
        <Form.Item>
                <Button type="primary" onClick={() => {
            form
              .validateFields()
              .then((values) => {
                  console.log(values)
                form.resetFields();
                onCreate(values);
              })
              .catch((info) => {
                console.log('Validate Failed:', info);
              });
          }}>
                  Submit
                </Button>
                <Button type="dashed" onClick={() => {
            form.resetFields();
            onCancel();
          }}>
                  Cancel
                </Button>
         </Form.Item>
      </Form>
  );
};

