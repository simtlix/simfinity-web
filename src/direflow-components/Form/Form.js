import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./Form.css";

const Form = ({ displayEntity = null }) => {
  const { register, handleSubmit } = useForm();

  const [fieldsFormList, setFieldsFormList] = useState([]);

  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  useEffect(() => {
    if (displayEntity) {
      const fieldsFormList = displayEntity?.fields.map((field) => field.name);
      setFieldsFormList(fieldsFormList);
    }
  }, [displayEntity]);

  const renderFormFields = fieldsFormList.map((field, index) => {
    return (
      <div key={index}>
        <label>{field}</label>
        <input {...register(field, { required: true })} />
      </div>
    );
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {renderFormFields}
      <input type="submit" />
    </form>
  );
};

export default Form;
