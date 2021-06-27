import React, { useEffect, useState, useContext } from "react";
import { EntitiesContext } from "../entities-context";
import { Form as FormAntd, Select } from "antd";
import { requestEntity } from "../Table/utils";
import { ConfigContext } from "../config-context";

const { Option } = Select;
export const SelectEntities = ({ field, name }) => {
  const displayField = field?.extensions?.relation?.displayField;
  const nameField = field?.name != null ? field.name : "";
  const entitiesContext = useContext(EntitiesContext);
  const configContext = useContext(ConfigContext);
  const url = configContext.url;
  const [responseEntity, setResponseEntity] = useState([]);

  useEffect(() => {
    const selectEntity = entitiesContext.find((e) => e.name === field.name);

    requestEntity(selectEntity,url,1,10).then(({data}) => {
      if (data.data) {
        setResponseEntity(data.data[selectEntity.queryAll]);
      }
    });
  }, [entitiesContext]);

  const renderSelect = responseEntity?.map((item) => {
    return (
      <Option key={item.id} value={item.id}>
        {item[displayField]}
      </Option>
    );
  });

  // siempre se va a mandar el id como field en este tipo de conexion ?
  const fixedName = [name,"id"];

  return (
    <FormAntd.Item name={fixedName} label={nameField.toUpperCase()}>
      <Select allowClear>{renderSelect}</Select>
    </FormAntd.Item>
  );
};
