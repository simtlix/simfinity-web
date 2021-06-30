import React, {useContext } from "react";
import { Form as FormAntd, Button, Row, Col} from "antd";
import { requestAddNewEntity, getFormItems } from "./utils";
import { ConfigContext } from "../config-context";
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
  const configContext = useContext(ConfigContext);
  const url = configContext.url;
 
  if(!displayEntity){
    return;
  }

  const filteredFields = displayEntity.fields.filter(
    (field) => field.name !== "id" && field.type.kind !== "LIST"
  )

  

  const renderFormFields = getFormItems(filteredFields,undefined,form, openForResultHandler);

  return (
    


    <Row style={{display: visible?"":"none"}}>
      <Col span={24}>
        <FormAntd {...layout} form={form} initialValues={initialValues} name={name} >
         {renderFormFields}
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
