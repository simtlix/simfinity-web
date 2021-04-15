import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { requestCurrentEntity } from "./utils";

const TableOfEntities = (props) => {
  const [entity, setEntity] = useState([]);

  //useEffect(() => {
  requestCurrentEntity(props.url, props.displayEntities).then((entity) => {
    if (entity) {
      setEntity(entity);
    }
  });
  //}, [props.displayEntities]);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
  ];

  return (
    <div>
      <Table dataSource={entity} columns={columns} />
    </div>
  );
};

export default TableOfEntities;
