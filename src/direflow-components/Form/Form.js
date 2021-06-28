import React, { useEffect, useState } from "react";
import { Form as FormAntd, Button, Input, Select, Row, Col } from "antd";
import { useForm, Controller } from "react-hook-form";
import { requestAddNewEntity } from "./utils";
import { SelectEntities } from "./SelectEntities";
import { EmbeddedForm } from "./EmbeddedForm";
import { convertDate } from "../../utils/date_formatter";

const { Option } = Select;

const Form = ({ displayEntity = null }) => {
  const { handleSubmit, watch, reset, control } = useForm();

  const [filteredFieldsList, setFilteredFieldsList] = useState([]);

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
      reset();
    }
  }, [displayEntity]);

  const renderFormFields = filteredFieldsList.map((field, index) => {
    const nameField = field?.name != null ? field.name : "";
    if (field?.extensions?.stateMachine) {
      return null;
    } else if (
      field?.type?.kind === "OBJECT" &&
      (field?.extensions?.relation?.embedded == null ||
        field?.extensions?.relation?.connectionField != null)
    ) {
      return <SelectEntities key={index} field={field} control={control} />;
    } else if (
      field?.type?.kind === "ENUM" /*&&
      !field?.extensions?.stateMachine*/
    ) {
      return (
        <FormAntd.Item key={index} label={nameField.toUpperCase()}>
          <Controller
            control={control}
            name={nameField}
            render={({ fieldController }) => (
              <Select {...fieldController} defaultValue="">
                {field?.enumValues.map((field) => {
                  return (
                    <Option key={field.name} value={field.name}>
                      {field.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          />
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
          control={control}
        />
      );
    } else {
      if (field?.type?.name === "Int") {
        return (
          <FormAntd.Item key={index} label={nameField.toUpperCase()}>
            <Controller
              name={nameField}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              )}
            />
          </FormAntd.Item>
        );
      } else if (field?.type?.name === "Date") {
        return (
          <FormAntd.Item key={index} label={nameField.toUpperCase()}>
            <Controller
              name={nameField}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="date"
                  onChange={(e) => field.onChange(convertDate(e.target.value))}
                />
              )}
            />
          </FormAntd.Item>
        );
      } /*else if (
        field?.type?.kind === "OBJECT" &&
        field?.extensions?.relation?.connectionField != null
      ) {
        return <SelectEntities key={index} field={field} control={control} />;
      }*/ else {
        return (
          <FormAntd.Item key={index} label={nameField.toUpperCase()}>
            <Controller
              name={nameField}
              control={control}
              defaultValue=""
              rules={{ required: field?.type?.kind === "NON_NULL" }}
              render={({ field }) => <Input {...field} />}
            />
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
