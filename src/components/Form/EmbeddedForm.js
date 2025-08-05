/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { EntitiesContext } from '../entities-context';
import { Col, Row, Card } from 'antd';
import { FormItems } from './FormItems';
import { useIntl } from 'react-intl';

export const EmbeddedForm = ({ field, form, openForResult, entity, span }) => {
  const nameField = field?.name != null ? field.name : '';
  const entitiesContext = useContext(EntitiesContext);
  const intl = useIntl();

  // Handle NON_NULL types - get the actual type name from ofType
  const typeName = field.type.kind === 'NON_NULL' 
    ? field.type.ofType.name 
    : field.type.name;
  
  const entityEmbedded = entitiesContext.filter((e) => e.name === typeName);
  const filteredFields = entityEmbedded[0].fields.filter(
    (field) => field.name !== 'id' && field.type.kind !== 'LIST'
  );
  return (
    <Col span={24}>
      <Card
        size="small"
        title={intl.formatMessage({
          id: `entity.${entity.name}.fields.${field.name}`,
          defaultMessage: field.name,
        })}
      >
        <Row gutter={24}>
          <FormItems
            fields={filteredFields}
            parentFieldName={nameField}
            form={form}
            openForResult={openForResult}
            entity={entity}
            span={span}
          ></FormItems>
        </Row>
      </Card>
    </Col>
  );
};
