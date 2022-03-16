import React from 'react';
import { Field } from './Field';
import { Col } from 'antd';
export const FormItems = ({
  fields,
  parentFieldName,
  form,
  openForResult,
  entity,
  span = 24,
}) => {
  const renderFormFields = fields.map((field) => {
    const fieldName = parentFieldName
      ? [parentFieldName, field.name]
      : field.name;
    return (
      <Col span={span} key={fieldName}>
        <Field
          parentFieldName={parentFieldName}
          entity={entity}
          form={form}
          openForResult={openForResult}
          field={field}
        ></Field>
      </Col>
    );
  });

  return renderFormFields;
};
