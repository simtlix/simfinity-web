/* eslint-disable react/prop-types */
import React from "react";
import { Form as FormAntd, Button, Row, Col, Collapse} from "antd";
import { FormItems } from "./FormItems";
import Collection from "./Collection";
import 'antd/dist/antd.css';
import { useIntl } from "react-intl";
import { isDate } from "./utils"
import moment from "moment";

const { Panel } = Collapse; 

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};



const Form = ({ displayEntity = null, visible=true, name, openForResultHandler, initialValues, mode }) => {

  const [form] = FormAntd.useForm();
  const intl = useIntl()

  displayEntity.fields.forEach(field => {
    if(isDate(field) && initialValues && initialValues[field.name]){
      initialValues[field.name] = moment(initialValues[field.name])
    }
  });

  form.setFieldsValue(initialValues);

  if(!displayEntity){
    return;
  }

  const filteredFields = displayEntity.fields.filter(
    (field) => field.name !== "id" && field.type.kind !== "LIST"
  )

  const collectionFields = displayEntity.fields.filter(
    (field) => field.name !== "id" && field.type.kind === "LIST" && field.type.ofType.kind === 'OBJECT'
  )


  return (
    <>
      <Row style={{display: visible?"":"none"}}>
        <Col span={24}>
          <FormAntd {...layout} form={form} initialValues={initialValues} name={name} >
          <FormItems fields={filteredFields} form={form} openForResult={openForResultHandler} entity={displayEntity}></FormItems>
          { collectionFields.length > 0 && 
              <Row>
                <Col span={24}>
                  <Collapse>
                  
                  {
                    collectionFields.map((field, index) => {
                      let data = []
                      if(initialValues){
                        data = initialValues[field.name]
                      }
                      return (<Panel header={intl.formatMessage({id:`entity.${displayEntity.name}.fields.${field.name}`, defaultMessage:field.name})} key={index}>
                                  <Collection key={field.name} field={field} data={data} form={form} parentId={initialValues && initialValues.id?initialValues.id:undefined} mode={mode} openForResult={openForResultHandler}/>
                              </Panel>)
                    })
                  }
                  </Collapse>
                </Col>
              </Row>
          }


            {displayEntity != null ? (
              <FormAntd.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </FormAntd.Item>
            ) : null}
            </FormAntd>
        </Col>
      </Row>
      
    </>
  );
};

export default Form;
