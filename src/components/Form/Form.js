/* eslint-disable react/prop-types */
import React from 'react';
import { Form as FormAntd, Button, Row, Col, Collapse, Space } from 'antd';
import { FormItems } from './FormItems';
import Collection from './Collection';
import { useIntl } from 'react-intl';
import { isDate } from './utils';
import moment from 'moment';



const Form = ({
  displayEntity = null,
  visible = true,
  name,
  openForResultHandler,
  initialValues,
  mode,
  linkField,
  containerEntity,
}) => {
  const [form] = FormAntd.useForm();
  const intl = useIntl();

  // Early return if no displayEntity
  if (!displayEntity) {
    return null;
  }

  // Process initial values for date fields
  const processedInitialValues = { ...initialValues };
  displayEntity.fields.forEach((field) => {
    if (isDate(field) && processedInitialValues && processedInitialValues[field.name]) {
      processedInitialValues[field.name] = moment(processedInitialValues[field.name]);
    }

  });

  // Use useEffect to set form values after render
  React.useEffect(() => {
    if (processedInitialValues) {
      form.setFieldsValue(processedInitialValues);
    }
  }, [form, processedInitialValues]);

  const filteredFields = displayEntity.fields.filter(
    (field) => field.name !== 'id' && field.type.kind !== 'LIST'
  );

  const collectionFields = displayEntity.fields.filter(
    (field) =>
      field.name !== 'id' &&
      field.type.kind === 'LIST' &&
      field.type.ofType.kind === 'OBJECT' &&
      !field.extensions?.relation?.embedded &&
      (field.type.ofType?.name !== containerEntity?.name ||
        field.extensions?.relation?.connectionField !==
          linkField?.extensions?.relation?.connectionField)
  );

  return (
    <>
      <Row style={{ display: visible ? '' : 'none' }}>
        <Col span={24}>
          <FormAntd form={form} initialValues={processedInitialValues} name={name}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row gutter={24}>
                <FormItems
                  fields={filteredFields}
                  form={form}
                  openForResult={openForResultHandler}
                  entity={displayEntity}
                ></FormItems>
              </Row>
              <Row></Row>
              {collectionFields.length > 0 && (
                <Row>
                  <Col span={22}>
                    <Collapse 
                      style={{ marginBottom: 20, marginLeft: 10 }}
                      items={collectionFields.map((field, index) => {
                        let data = [];
                        if (initialValues) {
                          data = initialValues[field.name];
                        }
                        return {
                          key: index,
                          label: intl.formatMessage({
                            id: `entity.${displayEntity.name}.fields.${field.name}`,
                            defaultMessage: field.name,
                          }),
                          children: (
                            <Collection
                              key={field.name}
                              field={field}
                              data={data}
                              form={form}
                              parentId={
                                initialValues && initialValues.id
                                  ? initialValues.id
                                  : undefined
                              }
                              mode={mode}
                              openForResult={openForResultHandler}
                            />
                          ),
                        };
                      })}
                    />
                  </Col>
                </Row>
              )}

              {displayEntity != null ? (
                <FormAntd.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </FormAntd.Item>
              ) : null}
            </Space>
          </FormAntd>
        </Col>
      </Row>
    </>
  );
};

export default Form;
