import React, { useEffect, useState, useContext } from "react";
import { Form as FormAntd, Button, Input, Select, Row, Col } from "antd";
import { useForm } from "react-hook-form";
import { EntitiesContext } from "../App";
import { requestAddNewEntity } from "./utils";
import { SelectEntities } from "./SelectEntities";
import { EmbeddedForm } from "./EmbeddedForm";
import { convertDate } from "../../utils/date_formatter";

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
      field?.extensions?.relation?.embedded == null
    ) {
      return <SelectEntities key={index} field={field} register={register} />;
    } else if (
      field?.type?.kind === "ENUM" &&
      !field?.extensions?.stateMachine
    ) {
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
            <input
              type="number"
              {...register(nameField, {
                valueAsNumber: true,
              })}
            />
          </FormAntd.Item>
        );
      } else if (field?.type?.name === "Date") {
        return (
          <FormAntd.Item key={index} label={nameField.toUpperCase()}>
            <input
              type="date"
              {...register(nameField, {
                setValueAs: (v) => convertDate(v),
              })}
            />
          </FormAntd.Item>
        );
      } else {
        // tiene sentido solo validar aca y en los ENUM types en lugar de envolver todo ?
        if (!field?.extensions?.stateMachine) {
          return (
            <FormAntd.Item key={index} label={nameField.toUpperCase()}>
              <Input
                {...register(nameField, {
                  required: field?.type?.kind === "NON_NULL",
                })}
              />
            </FormAntd.Item>
          );
        }
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
