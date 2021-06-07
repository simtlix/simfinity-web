import React, { useContext } from "react";
import { EntitiesContext } from "../App";
import { useForm } from "react-hook-form";
import { Form as FormAntd, Col } from "antd";

export const EmbeddedForm = ({ field, index }) => {
  const { register } = useForm();
  const nameField = field?.name != null ? field.name : "";
  const entitiesContext = useContext(EntitiesContext);

  const entityEmbedded = entitiesContext.filter((e) => e.name === field.name);
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
  return <Col key={index}>{_html}</Col>;
};
