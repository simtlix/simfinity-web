import React, { useEffect, useState } from "react";
import { Table as TableAntd, Button, Space } from "antd";
import { requestEntity } from "./utils";

const Table = (props) => {
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [sortedInfo, setSortedInfo] = useState(null);
  const [currentEntity, setCurrentEntity] = useState([]);
  const [columns, setColumns] = useState([]);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    if (props.displayEntities) {
      console.log(props.displayEntities.fields);
      setColumns(
        props.displayEntities.fields.map((entity) => {
          return {
            title: entity.name,
            dataIndex: entity.name,
            key: entity.name,
          };
        })
      );

      /*Falta ver de donde sacar el nombre correcto de la entidad. entity.name no existe */
      requestEntity().then((entity) => {
        if (entity) {
          if (entity[/*entity.name*/ "episodes"]) {
            var newObj = entity[/*entity.name*/ "episodes"].map((element) => {
              return {
                key: element.id,
                ...element,
              };
            });
            setCurrentEntity(newObj);
          }
        }
      });
    }
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

  const harcodedColumns = [
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
      <TableAntd
        columns={columns}
        dataSource={currentEntity}
        onChange={handleChange}
      />
    </>
  );
};

export default Table;
