import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./Form.css";

const Form = ({ displayEntity = null }) => {
  const { register, handleSubmit } = useForm();

  const [fieldsFormList, setFieldsFormList] = useState([]);

  console.log(displayEntity?.fields);

  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  useEffect(() => {
    if (displayEntity) {
      const fieldsFormList = displayEntity?.fields.map(
        (field, index) => field.name
      );
      console.log(fieldsFormList);
      setFieldsFormList(fieldsFormList);
      console.log(fieldsFormList);
    }
  }, [displayEntity]);

  const renderFormFields = fieldsFormList.map((field, index) => {
    console.log(field);
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
