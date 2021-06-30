import React, { useContext } from "react";
import { EntitiesContext } from "../entities-context";
import { Col, Row, Divider, Card } from "antd";
import {getFormItems} from "./utils"
import 'antd/dist/antd.css';

export const EmbeddedForm = ({ field, index, form, openForResult }) => {
  const nameField = field?.name != null ? field.name : "";
  const entitiesContext = useContext(EntitiesContext);

  const entityEmbedded = entitiesContext.filter((e) => e.name === field.name);
  const filteredFields = entityEmbedded[0].fields.filter(
    (field) => field.name !== "id" && field.type.kind !== "LIST"
  );
  const renderFormFields = getFormItems(filteredFields, nameField, form, openForResult);
  
  return (<Row>
               <Col >
                <Card size="small" title={field.name} >
                  {renderFormFields}
                </Card>
               </Col>
          </Row>
          );
};
