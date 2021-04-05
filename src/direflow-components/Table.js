import React, { useEffect, useState } from "react";
import { Table as TableAntd, Button, Space } from "antd";
import { requestEntity } from "./Table/utils";

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
  },
];

const Table = (props) => {
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [sortedInfo, setSortedInfo] = useState(null);
  const [entity, setEntity] = useState([]);
  const [columns1, setColumns1] = useState([]);
  const [keys, setKeys] = useState([]);
  console.log("al iniciar");
  console.log(props);
  console.log(props.displayEntities.fields);
  var columnas = [];

  if (props.displayEntities.fields) {
    columnas = props.displayEntities.fields.map((entity, index) => entity.name);
    //console.log(columnas);
    //setColumns1(columnas);
  }
  console.log("columnas");
  console.log(columnas);

  useEffect(() => {
    requestEntity().then(() => {
      if (entity) {
        setEntity(entity);
      }
      console.log("Entity consultada");
      console.log(entity);
    });
  }, []);

  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearFilters = () => {
    setFilteredInfo(null);
  };

  const clearAll = () => {
    setFilteredInfo(null);
    setSortedInfo(null);
  };

  const setAgeSort = () => {
    setSortedInfo({
      order: "descend",
      columnKey: "age",
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      /*filters: [
        { text: "Joe", value: "Joe" },
        { text: "Jim", value: "Jim" },
      ],
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
      ellipsis: true,*/
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      /*sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === "age" && sortedInfo.order,
      ellipsis: true,*/
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      /*filters: [
        { text: "London", value: "London" },
        { text: "New York", value: "New York" },
      ],
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,*/
    },
  ];

  return (
    <>
      {/*<Space style={{ marginBottom: 16 }}>
        <Button onClick={this.setAgeSort}>Sort age</Button>
        <Button onClick={this.clearFilters}>Clear filters</Button>
        <Button onClick={this.clearAll}>Clear filters and sorters</Button>
  </Space>*/}
      {console.log(props.episodes + "Dentro del return")}
      <TableAntd columns={columns} dataSource={data} onChange={handleChange} />
    </>
  );
};

export default Table;
