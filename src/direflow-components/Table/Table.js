import React, { useEffect, useState } from "react";
import { Table as TableAntd } from "antd";
import { requestEntity } from "./utils";

const Table = (props) => {
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [sortedInfo, setSortedInfo] = useState(null);
  const [currentEntity, setCurrentEntity] = useState([]);
  const [columns, setColumns] = useState([]);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    if (props.displayEntities) {
      console.log("entity recibida en Table");
      console.log(props.displayEntities);
      console.log(props.displayEntities.fields);
      setColumns(
        props.displayEntities.fields.map((entity) => {
          if (entity.name !== "id") {
            return {
              title: entity.name,
              dataIndex: entity.name,
              key: entity.name,
            };
          } else {
            return columns;
          }
        })
      );

      requestEntity(props.displayEntities).then((entity) => {
        if (entity) {
          let name = Object.keys(entity);
          let newObj = entity[name[0]].map((element) => {
            return {
              key: element.id,
              ...element,
            };
          });
          setCurrentEntity(newObj);
        }
      });
    }
  }, [props.displayEntities.fields]);

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

  return (
    <>
      <TableAntd
        columns={columns}
        dataSource={currentEntity}
        onChange={handleChange}
        pagination={{ position: ["bottomCenter"] }}
      />
    </>
  );
};

export default Table;
