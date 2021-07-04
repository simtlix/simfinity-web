import React from "react";
import { deleteEntity } from "./utils";
import { EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, Button, Space } from "antd";

function EditButton({ record, displayEntity, handleRefresh }) {
  return (
    <React.Fragment>
      <Button
        type="primary"
        shape="round"
        icon={<EditOutlined />}
        size="large"
        onClick={console.log("clicked")}
      />
    </React.Fragment>
  );
}

export default EditButton;
