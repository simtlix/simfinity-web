import React, {useContext } from "react";
import { Form as FormAntd, Button, Row, Col} from "antd";
import { requestAddNewEntity, getFormItems } from "./utils";
import { ConfigContext } from "../config-context";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};



const Form = ({ displayEntity = null }) => {

  const [form] = FormAntd.useForm();
  const configContext = useContext(ConfigContext);
  const url = configContext.url;
 
  if(!displayEntity){
    return;
  }

  const filteredFields = displayEntity.fields.filter(
    (field) => field.name !== "id" && field.type.kind !== "LIST"
  )

  const onSubmit = (data) => {
    console.log(data);
    requestAddNewEntity(displayEntity, data, url).then((response) => {
      console.log(response);
    });
  }
  

  const renderFormFields = getFormItems(filteredFields,undefined,form);

  return (
    

    <Row>
      <Col>
        <FormAntd {...layout} form={form} /*initialValues={{number:1, year:2020, serie:{id:"60d26e1867bf88326fd0ad31"}}}*/ name="control-hooks" onFinish={onSubmit}>
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
