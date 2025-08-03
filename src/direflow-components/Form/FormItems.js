import React from 'react';
import { Field } from './Field';
import { Card, Row, Space, Col } from 'antd';

export const FormItems = ({
  fields,
  parentFieldName,
  form,
  openForResult,
  entity,
  span = 12,
}) => {
  const notEmbeddedFields = fields.filter(
    (item) => !item.extensions?.relation?.embedded
  );
  const embeddedFields = fields.filter(
    (item) => item.extensions?.relation?.embedded
  );

  const renderFormFields = notEmbeddedFields.map((field) => {
    const fieldName = parentFieldName
      ? [parentFieldName, field.name]
      : field.name;
    return (
      <Field
        parentFieldName={parentFieldName}
        entity={entity}
        form={form}
        openForResult={openForResult}
        field={field}
        key={fieldName}
        span={span}
      ></Field>
    );
  });

  const renderFormEmbedded = embeddedFields.map((field) => {
    const fieldName = parentFieldName
      ? [parentFieldName, field.name]
      : field.name;
    return (
      <Field
        parentFieldName={parentFieldName}
        entity={entity}
        form={form}
        openForResult={openForResult}
        field={field}
        key={fieldName}
        span={span}
      ></Field>
    );
  });

  return (
    <>
      <Space style={{ width: '100%' }} direction="vertical">
        <Col span={24}>
          <Card style={{ width: '100%' }}>{renderFormFields}</Card>
        </Col>
        {renderFormEmbedded}
      </Space>
    </>
  );
};
