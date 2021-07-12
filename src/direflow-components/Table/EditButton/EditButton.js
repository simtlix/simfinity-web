/* eslint-disable react/prop-types */
import React from "react";
import { EditOutlined } from "@ant-design/icons";
import {Button } from "antd";

function EditButton({ onClick }) {
  return (
    <React.Fragment>
      <Button
        type="primary"
        shape="round"
        icon={<EditOutlined />}
        size="large"
        onClick={onClick}
      />
    </React.Fragment>
  );
}

export default EditButton;