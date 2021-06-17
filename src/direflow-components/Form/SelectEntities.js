import React, { useEffect, useState, useContext } from "react";
import { EntitiesContext } from "../App";
import { Form as FormAntd, Select } from "antd";
import { requestEntity } from "../Table/utils";

const { Option } = Select;

export const SelectEntities = ({ field, register }) => {
  const displayField = field?.extensions?.relation?.displayField;
  const nameField = field?.name != null ? field.name : "";
  const entitiesContext = useContext(EntitiesContext);
  const [responseEntity, setResponseEntity] = useState([]);
  console.log(nameField);

  useEffect(() => {
    const selectEntity = entitiesContext.find((e) => e.name === field.name);
    console.log(selectEntity);

    requestEntity(selectEntity).then((response) => {
      if (response) {
        setResponseEntity(response[selectEntity.queryAll]);
      }
    });
  }, [entitiesContext]);

  const renderSelect = responseEntity?.map((field) => {
    return (
      <option key={field.id} value={field.id}>
        {field[displayField]}
      </option>
    );
  });

  // siempre se va a mandar el id como field en este tipo de conexion ?
  return (
    <FormAntd.Item label={nameField.toUpperCase()}>
      <select {...register(nameField + "." + "id")}>{renderSelect}</select>
    </FormAntd.Item>
  );
};
