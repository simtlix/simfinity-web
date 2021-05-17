import React, { useEffect, useState } from "react";
import { Form as FormAntd, Button, Input, Row, Col } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {capitalize} from "../../utils/utils_string.js"
import * as yup from "yup";

const FormValidationSchema = yup.object().shape({
  name: yup.string().required(),
  director: yup.string().required()
});

const Form = ({ displayEntity = null }) => {
  const [fieldsFormList, setFieldsFormList] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(FormValidationSchema)
  });

  const submitForm = (data) => {
    console.log("Submiting....")
    console.log(data);
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
        <Input {...register(field)} />
        {
          errors && errors[field] && errors[field].message && 
          <p style={{color: "red"}}>
            {
              capitalize(errors[field].message)
            }
          </p>
        }
      </FormAntd.Item>
    );
  });

  return (
    <Row>
      <Col>
        <FormAntd size="large" onFinish={handleSubmit(submitForm)}>
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

    //<form onSubmit={handleSubmit(onSubmit)}>
    //  {renderFormFields}
    //  {displayEntity != null ? <input type="submit" /> : null}
    //</form>
  );
};

export default Form;
