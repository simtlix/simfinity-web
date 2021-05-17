import React, { useEffect, useState, useContext } from "react";
import { Form as FormAntd, Button, Input, Row, Col } from "antd";
import { useForm } from "react-hook-form";
import { requestEntity } from "./utils";
import { EntitiesContext } from "../App";

const Form = ({ displayEntity = null }) => {
  const entitiesContext = useContext(EntitiesContext);
  console.log(entitiesContext);
  const { register, handleSubmit } = useForm();
  //console.log(displayEntity);

  const [filteredFieldsList, setFilteredFieldsList] = useState([]);
  //const [fieldsFormList, setFieldsFormList] = useState([]);

  const onSubmit = (data) => {
    requestEntity(displayEntity, data).then((response) => {
      console.log(response);
    });
    alert(JSON.stringify(data));
  };

  useEffect(() => {
    if (displayEntity) {
      const filteredFields = displayEntity.fields.filter(
        (field) => field.name !== "id" && field.type.kind !== "LIST"
      );
      setFilteredFieldsList(filteredFields);
      //const fieldsFormList = filteredFields.map((field) => field.name);
      //setFieldsFormList(fieldsFormList);
    }
  }, [displayEntity]);

  const renderFormFields = filteredFieldsList.map((field, index) => {
    console.log(field?.extensions?.relation?.embedded);
    const nameField = field?.name != null ? field.name : "";
    if (
      (field?.type?.kind === "OBJECT" &&
        field?.extensions?.relation?.embedded == null) ||
      field?.type?.kind === "ENUM"
    ) {
      /*return (
        <FormAntd.Item key={index} label={nameField.toUpperCase()}>
          <Input type="number" {...register(nameField, { required: true })} />
        </FormAntd.Item>
      );*/
      return (
        <FormAntd.Item key={index} label={nameField.toUpperCase()}>
          <select {...register(nameField)}>
            <option value="GoT">GoT</option>
            <option value="Breaking Bad">Breaking Bad</option>
            <option value="other">other</option>
          </select>
        </FormAntd.Item>
      );
    } else {
      if (field?.type?.name === "Int") {
        return (
          <FormAntd.Item key={index} label={nameField.toUpperCase()}>
            <Input type="number" {...register(nameField, { required: true })} />
          </FormAntd.Item>
        );
      } else {
        return (
          <FormAntd.Item key={index} label={nameField.toUpperCase()}>
            <Input {...register(nameField, { required: true })} />
          </FormAntd.Item>
        );
      }
    }
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
