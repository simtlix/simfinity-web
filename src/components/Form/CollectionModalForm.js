/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Form, Button, Row, Col, Space } from 'antd';
import { FormItems } from './FormItems';
import { FormattedMessage } from 'react-intl';
import { isDate, getActualTypeKind } from './utils';
import moment from 'moment';

export const CollectionModalForm = ({
  onSubmit,
  onCancel,
  entity,
  openForResultHandler,
  collectionField,
  initialValues,
}) => {
  const [form] = Form.useForm();

  // Process initial values for date fields
  const processedInitialValues = { ...initialValues };
  entity.fields.forEach((field) => {
    if (isDate(field) && processedInitialValues && processedInitialValues[field.name]) {
      processedInitialValues[field.name] = moment(processedInitialValues[field.name]);
    }
  });

  // Set initial values on the form
  useEffect(() => {
    if (processedInitialValues) {
      form.setFieldsValue(processedInitialValues);
    }
  }, [form, processedInitialValues]);

  const filteredFields = entity.fields.filter((field) => {
    const actualTypeKind = getActualTypeKind(field);
    
    if (
      field.name !== 'id' &&
      actualTypeKind !== 'LIST' &&
      actualTypeKind !== 'OBJECT'
    ) {
      return true;
    } else if (
      actualTypeKind === 'OBJECT' &&
      field?.extensions?.relation?.displayField &&
      field?.extensions?.relation?.connectionField !==
        collectionField?.extensions?.relation?.connectionField
    ) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <Form
      form={form}
      initialValues={processedInitialValues}
      style={{
        padding: '24px',
        background: '#fbfbfb',
        border: '1px solid #d9d9d9',
      }}
    >
      <Row gutter={24}>
        <FormItems
          fields={filteredFields}
          form={form}
          openForResult={openForResultHandler}
          entity={entity}
        ></FormItems>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  form
                    .validateFields()
                    .then((values) => {
                      console.log(values);
                      form.resetFields();
                      if (initialValues) {
                        values.id = initialValues.id;
                      }
                      onSubmit(values);
                    })
                    .catch((info) => {
                      console.log('Validate Failed:', info);
                    });
                }}
              >
                <FormattedMessage id="form.collection.ok"></FormattedMessage>
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  onCancel();
                }}
              >
                <FormattedMessage id="form.collection.cancel"></FormattedMessage>
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
    </Form>
  );
};
