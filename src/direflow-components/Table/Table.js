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
      setColumns(
        props.displayEntities.fields.map((entity) => {
          if (entity.name !== "id" && entity.type.kind !== "LIST") {
            //si extension es distinto de null chequeo que no sea embedded
            if (entity.extensions) {
              if (!entity?.extensions?.relation?.embedded) {
                return {
                  title: entity.name,
                  dataIndex: entity.name,
                  key: entity.name,
                };
              } else {
                return columns;
              }
            } else {
              return {
                title: entity.name,
                dataIndex: entity.name,
                key: entity.name,
              };
            }
          } else {
            return columns;
          }
        })
      );

      requestEntity(props.displayEntities).then((entity) => {
        if (entity) {
          let name = Object.keys(entity);
          let _keys = Object.keys(entity[name[0]][0]);
          let newObj = entity[name[0]].map((element) => {
            var myObj = new Object();
            for (let prop in element) {
              if (typeof element[prop] === "object") {
                let _valueObject = Object.values(element[prop]);
                myObj[prop] = _valueObject[0];
              } else {
                myObj[prop] = element[prop];
              }
            }
            myObj.key = element.id;
            return myObj;
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
