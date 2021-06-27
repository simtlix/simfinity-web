import React, { useContext } from "react";
import { EntitiesContext } from "../entities-context";
import { Form as FormAntd, Col } from "antd";
import {getFormItems} from "./utils"

export const EmbeddedForm = ({ field, index, form }) => {
  const nameField = field?.name != null ? field.name : "";
  const entitiesContext = useContext(EntitiesContext);

  const entityEmbedded = entitiesContext.filter((e) => e.name === field.name);
  const filteredFields = entityEmbedded[0].fields.filter(
    (field) => field.name !== "id" && field.type.kind !== "LIST"
  );
  const renderFormFields = getFormItems(filteredFields, nameField, form);
  
  return <Col >{renderFormFields}</Col>;
};
