import React, { useEffect, useState } from "react";
import { Form as FormAntd, Button, Input, Row, Col } from "antd";
import { useForm } from "react-hook-form";
import { requestEntity } from "./utils";

const Form = ({ displayEntity = null }) => {
  const { register, handleSubmit } = useForm();

  const [fieldsFormList, setFieldsFormList] = useState([]);

  const onSubmit = (data) => {
    requestEntity(displayEntity, data).then((response) => {
      console.log(response);
    });
    alert(JSON.stringify(data));
  };

  useEffect(() => {
    //se sacan los list ?
    if (displayEntity) {
      const filteredFields = displayEntity.fields.filter(
        (field) => field.name !== "id" && field.type.kind !== "LIST"
      );
      const fieldsFormList = filteredFields.map((field) => field.name);
      setFieldsFormList(fieldsFormList);
    }
  }, [displayEntity]);

  const renderFormFields = fieldsFormList.map((field, index) => {
    return (
      <FormAntd.Item key={index} label={field.toUpperCase()}>
        <Input {...register(field, { required: true })} />
      </FormAntd.Item>
    );
  });

  return (
    /*{<Row>
      <Col>
        <FormAntd size="large" onSubmit={handleSubmit(onSubmit)}>
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
    </Row>}*/

    <Row>
      <Col>
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderFormFields}
          {displayEntity != null ? (
            <FormAntd.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </FormAntd.Item>
          ) : null}
        </form>
      </Col>
    </Row>
  );
};

export default Form;
