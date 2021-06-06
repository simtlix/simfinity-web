import React, { useEffect, useState, useContext } from "react";
import { Form as FormAntd, Button, Input, Row, Col } from "antd";
import { useForm } from "react-hook-form";
import { EntitiesContext } from "../App";
import { requestAddNewEntity } from "./utils";
import { SelectEntities } from "./SelectEntities";
import { EmbeddedForm } from "./EmbeddedForm";

const Form = ({ displayEntity = null }) => {
  const { register, handleSubmit, watch } = useForm();

  const [filteredFieldsList, setFilteredFieldsList] = useState([]);

  const entitiesContext = useContext(EntitiesContext);
  console.log(displayEntity);
  console.log(entitiesContext);

  const onSubmit = (data) => {
    console.log(displayEntity);
    console.log(data);
    console.log(watch());
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
    console.log(field);
    const nameField = field?.name != null ? field.name : "";
    if (
      field?.type?.kind === "OBJECT" &&
      field?.extensions?.relation?.embedded == null /*||
      field?.type?.kind === "ENUM"*/
    ) {
      return <SelectEntities key={index} field={field} register={register} />;
    } else if (field?.type?.kind === "ENUM") {
      /*field.enumValues.map((field) => {
        console.log(field.name);
      });*/
      return (
        <FormAntd.Item key={index} label={nameField.toUpperCase()}>
          <select {...register(nameField)}>
            {field?.enumValues.map((field) => {
              return (
                <option key={field.name} value={field.name}>
                  {field.name}
                </option>
              );
            })}
          </select>
        </FormAntd.Item>
      );
    } else if (
      field?.type?.kind === "OBJECT" &&
      field?.extensions?.relation?.embedded === true
    ) {
      const entityEmbedded = entitiesContext.filter(
        (e) => e.name === field.name
      );
      console.log(entityEmbedded[0]);
      console.log(field);
      //return <Form displayEntity={currentEntity} />;
      //return <EmbeddedForm key={index} entityEmbedded={entityEmbedded} />;
      const _html = entityEmbedded[0]?.fields.map((field, index) => {
        console.log(field);
        console.log("ASD");
        return (
          <FormAntd.Item
            key={index}
            label={(nameField + " " + field.name).toUpperCase()}
          >
            <input {...register(nameField + "." + field.name)} />
          </FormAntd.Item>
        );
      });
      //return <div key={index}>{_html}</div>;
      return (
        /*<FormAntd.Item key={index} label={nameField.toUpperCase()}>
          <Col>{_html}</Col>
        </FormAntd.Item>*/
        <Col key={index}>{_html}</Col>
      );
    } else {
      if (field?.type?.name === "Int") {
        return (
          <FormAntd.Item key={index} label={nameField.toUpperCase()}>
            {/*<Input type="number" {...register(nameField, { required: true })} />*/}
            <input
              type="number"
              {...register(nameField, {
                valueAsNumber: true,
              })}
            />
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
