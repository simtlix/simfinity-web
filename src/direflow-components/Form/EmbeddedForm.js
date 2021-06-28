import React, { useContext } from "react";
import { Controller } from "react-hook-form";
import { EntitiesContext } from "../App";
import { Form as FormAntd, Input, Col } from "antd";

export const EmbeddedForm = ({ field, index, control }) => {
  const nameField = field?.name != null ? field.name : "";
  const entitiesContext = useContext(EntitiesContext);

  const entityEmbedded = entitiesContext.filter((e) => e.name === field.name);
  const _html = entityEmbedded[0]?.fields.map((field, index) => {
    /*return (
      <FormAntd.Item
        key={index}
        label={(nameField + " " + field.name).toUpperCase()}
      >
        <input {...register(nameField + "." + field.name)} />
      </FormAntd.Item>
    );*/

    return (
      <FormAntd.Item
        key={index}
        label={(nameField + " " + field.name).toUpperCase()}
      >
        <Controller
          name={nameField + "." + field.name}
          control={control}
          //rules={{ required: field?.type?.kind === "NON_NULL" }}
          render={({ field }) => <Input {...field} />}
        />
      </FormAntd.Item>
    );
  });
  return <Col key={index}>{_html}</Col>;
};
