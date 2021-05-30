import React, { useEffect, useState, useContext } from "react";
import { Form as FormAntd, Button, Input, Row, Col } from "antd";
import { useForm } from "react-hook-form";
import { requestAddNewEntity } from "./utils";
import { SelectEntities } from "./SelectEntities";

const Form = ({ displayEntity = null }) => {
  const { register, handleSubmit } = useForm();

  const [filteredFieldsList, setFilteredFieldsList] = useState([]);

  const onSubmit = (data) => {
    requestAddNewEntity(displayEntity, data).then((response) => {
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
    }
  }, [displayEntity]);

  const renderFormFields = filteredFieldsList.map((field, index) => {
    const nameField = field?.name != null ? field.name : "";
    if (
      field?.type?.kind === "OBJECT" &&
      field?.extensions?.relation?.embedded == null /*||
      field?.type?.kind === "ENUM"*/
    ) {
      return <SelectEntities key={index} field={field} register={register} />;
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
