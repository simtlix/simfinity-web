import React, { useEffect, useState, useContext } from "react";
import { Controller } from "react-hook-form";
import { EntitiesContext } from "../App";
import { Form as FormAntd, Select } from "antd";
import { requestEntity } from "../Table/utils";

const { Option } = Select;

export const SelectEntities = ({ field, control }) => {
  const displayField = field?.extensions?.relation?.displayField;
  const nameField = field?.name != null ? field.name : "";
  const entitiesContext = useContext(EntitiesContext);
  const [responseEntity, setResponseEntity] = useState([]);

  useEffect(() => {
    const selectEntity = entitiesContext.find((e) => e.name === field.name);

    requestEntity(selectEntity).then((response) => {
      if (response) {
        setResponseEntity(response[selectEntity.queryAll]);
      }
    });
  }, [field]);

  const renderOptions = responseEntity?.map((field) => {
    return (
      <Option key={field.id} value={field.id}>
        {field[displayField]}
      </Option>
    );
  });

  // siempre se va a mandar el id como field en este tipo de conexion ?
  return (
    <FormAntd.Item label={nameField.toUpperCase()}>
      <Controller
        control={control}
        name={nameField + "." + "id"}
        render={({ field }) => <Select {...field}>{renderOptions}</Select>}
      />
    </FormAntd.Item>
  );
};
