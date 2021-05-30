import React, { useEffect, useState, useContext } from "react";
import { EntitiesContext } from "../App";
import { Form as FormAntd } from "antd";
import { requestEntity } from "../Table/utils";

export const SelectEntities = ({ field, register }) => {
  const nameField = field?.name != null ? field.name : "";
  const entitiesContext = useContext(EntitiesContext);
  const [responseEntity, setResponseEntity] = useState([]);

  useEffect(() => {
    const selectEntity = entitiesContext.find((e) => e.name === field.name);

    console.log(selectEntity);

    requestEntity(selectEntity).then((response) => {
      if (response) {
        setResponseEntity(response.series);
      }
    });
  }, [entitiesContext]);

  const renderSelect = responseEntity?.map((field) => {
    return (
      <option key={field.id} value={field.id}>
        {field.name}
      </option>
    );
  });

  return (
    <FormAntd.Item label={nameField.toUpperCase()}>
      <select {...register(nameField)}>{renderSelect}</select>
    </FormAntd.Item>
  );
};
