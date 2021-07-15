/* eslint-disable react/prop-types */
import React from 'react';
import 'antd/dist/antd.css';
import {  Form, Button, Space, Row, Col } from 'antd';
import { FormItems } from "./FormItems";
import { useIntl, FormattedMessage } from 'react-intl';


export const CollectionModalForm = ({ onCreate, onCancel, entity, openForResultHandler, collectionField }) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  

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
        wrapperCol={{sm:20}}
        labelCol={{sm:4}}
        style={{
          padding: "24px",
          background: "#fbfbfb",
          border: "1px solid #d9d9d9",
        }}
         
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
        <Row gutter={24}>
          <FormItems fields={filteredFields} form={form} openForResult={openForResultHandler} entity={entity}></FormItems>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item wrapperCol={{sm:24}}>
                    <Space style={{display:"flex", justifyContent:"flex-end"}}>
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
                        <FormattedMessage id="form.collection.ok" ></FormattedMessage>
                      </Button>
                      <Button onClick={() => {
                  form.resetFields();
                  onCancel();
                }}>
                        <FormattedMessage id="form.collection.cancel" ></FormattedMessage>

                      </Button> 
                    </Space>
            </Form.Item>
          </Col>
         </Row>
      </Form>
  );
};

