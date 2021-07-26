import React from "react";
import { Form as FormAntd, Button, Row, Col} from "antd";
import { FormItems } from "./FormItems";
import 'antd/dist/antd.css';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};



const Form = ({ displayEntity = null, visible=true, name, openForResultHandler, initialValues }) => {

  const [form] = FormAntd.useForm();
 
  if(!displayEntity){
    return;
  }

  const filteredFields = displayEntity.fields.filter(
    (field) => field.name !== "id" && field.type.kind !== "LIST"
  )


  return (
    <Row style={{display: visible?"":"none"}}>
      <Col span={24}>
        <FormAntd {...layout} form={form} initialValues={initialValues} name={name} >
         <FormItems fields={filteredFields} form={form} openForResult={openForResultHandler} entity={displayEntity}></FormItems>
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
  );
};

export default Form;
