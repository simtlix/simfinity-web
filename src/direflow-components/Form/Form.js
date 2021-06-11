import React, { useEffect, useState, useContext } from "react";
import { Form as FormAntd, Button, Input, Select, Row, Col } from "antd";
import { useForm } from "react-hook-form";
import { EntitiesContext } from "../App";
import { requestAddNewEntity } from "./utils";
import { SelectEntities } from "./SelectEntities";
import { EmbeddedForm } from "./EmbeddedForm";

const { Option } = Select;

const Form = ({ displayEntity = null }) => {
  const { register, handleSubmit, watch } = useForm();

  const [filteredFieldsList, setFilteredFieldsList] = useState([]);

  //const entitiesContext = useContext(EntitiesContext);

  const onSubmit = (data) => {
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
    const nameField = field?.name != null ? field.name : "";
    if (
      field?.type?.kind === "OBJECT" &&
      field?.extensions?.relation?.embedded == null /*||
      field?.type?.kind === "ENUM"*/
    ) {
      return <SelectEntities key={index} field={field} register={register} />;
    } else if (field?.type?.kind === "ENUM") {
      return (
        <FormAntd.Item key={index} label={nameField.toUpperCase()}>
          <Select {...register(nameField)}>
            {field?.enumValues.map((field) => {
              return (
                <Option key={field.name} value={field.name}>
                  {field.name}
                </Option>
              );
            })}
          </Select>
        </FormAntd.Item>
      );
    } else if (
      field?.type?.kind === "OBJECT" &&
      field?.extensions?.relation?.embedded === true
    ) {
      /*const entityEmbedded = entitiesContext.filter(
        (e) => e.name === field.name
      );
      const _html = entityEmbedded[0]?.fields.map((field, index) => {
        return (
          <FormAntd.Item
            key={index}
            label={(nameField + " " + field.name).toUpperCase()}
          >
            <input {...register(nameField + "." + field.name)} />
          </FormAntd.Item>
        );
      });
      return <Col key={index}>{_html}</Col>;*/
      return (
        <EmbeddedForm
          key={index}
          field={field}
          index={index}
          register={register}
        />
      );
    } else {
      if (field?.type?.name === "Int") {
        return (
          <FormAntd.Item key={index} label={nameField.toUpperCase()}>
            {/*<Input type="number" {...register(nameField, { required: true })} />*/}
            <Input
              type="number"
              {...register(nameField, {
                valueAsNumber: true,
              })}
            />
          </FormAntd.Item>
        );
      } else if (field?.type?.name === "Date") {
        console.log(field?.type?.name);
        return (
          <FormAntd.Item key={index} label={nameField.toUpperCase()}>
            <Input
              type="date"
              {...register(nameField, {
                valueAsDate: true,
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
