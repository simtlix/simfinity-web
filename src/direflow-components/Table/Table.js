import React, { useEffect, useState } from "react";
import { Table as TableAntd } from "antd";
import PropTypes from "prop-types";
import { requestEntity } from "./utils";
import { capitalize } from "../../utils/utils_string";

const Table = ({ displayEntities = null }) => {
  const [currentEntity, setCurrentEntity] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (displayEntities) {
      const filteredColumns = displayEntities.fields.filter(
        (entity) =>
          entity.name !== "id" &&
          entity.type.kind !== "LIST" &&
          !entity?.extensions?.relation?.embedded
      );
      const pasedColumns = filteredColumns.map((entity) => ({
        title: capitalize(entity.name),
        dataIndex: entity.name,
        key: entity.name,
      }));
      setColumns(pasedColumns);

      requestEntity(displayEntities).then((entity) => {
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
  }, [displayEntities]);

  return (
    <TableAntd
      columns={columns}
      dataSource={currentEntity}
      pagination={{ position: ["bottomCenter"] }}
    />
  );
};

Table.propTypes = {
  displayEntities: PropTypes.shape({
    name: PropTypes.string,
    kind: PropTypes.string,
    fields: PropTypes.array,
    queryAll: PropTypes.string,
  }),
};

export default Table;
