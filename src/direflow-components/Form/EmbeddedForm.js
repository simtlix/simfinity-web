import React, { useEffect, useState, useContext } from "react";
import { set, useForm } from "react-hook-form";
import { Form as FormAntd, Button, Input, Row, Col } from "antd";

export const EmbeddedForm = ({ entityEmbedded }) => {
  const { register, handleSubmit, watch } = useForm();
  const [nameEmbeddedEntity, setNameEmbeddedEntity] = useState("");
  const [fieldEmbeddedEntity, setFieldEmbeddedEntity] = useState(null);

  console.log(entityEmbedded[0]);
  setFieldEmbeddedEntity(entityEmbedded[0]);

  const onSubmit = (data) => {
    console.log(data);
  };

  useEffect(() => {
    const name = entityEmbedded.map((e) => {
      return e.name;
    });
    setNameEmbeddedEntity(name);
    const fields = entityEmbedded.map((e) => {
      console.log(e);
      return e.fields;
    });
    console.log(fields);
    setFieldEmbeddedEntity(entityEmbedded[0]);
    //console.log(fieldEmbeddedEntity);
  }, []);

  /*const renderFormFields = fieldEmbeddedEntity.map((field, index) => {
    return (
      <FormAntd.Item key={index} label={field.name.toUpperCase()}>
        <Input {...register(field.name, { required: true })} />
      </FormAntd.Item>
    );
  });*/

  const renderSelect = fieldEmbeddedEntity?.fields?.map((field) => {
    return <Input {...register(field?.name, { required: true })} />;
  });

  return (
    <FormAntd.Item label="{field.name.toUpperCase()}">
      {renderSelect}
    </FormAntd.Item>
  );
};

//export default EmbeddedForm;
