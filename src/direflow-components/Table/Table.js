import React, { useEffect, useState } from "react";
import { Table as TableAntd } from "antd";
import PropTypes from "prop-types";
import { requestEntity } from "./utils";
import { capitalize } from "../../utils/utils_string";

const Table = ({ displayEntity = null }) => {
  const [resultList, setResultList] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (displayEntity) {
      const filteredColumns = displayEntity.fields.filter(
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

      requestEntity(displayEntity).then((response) => {
        if (response) {
          const parserResponse = response[displayEntity.queryAll].map(
            (element) => {
              const myObj = {};
              for (const prop in element) {
                if (element[prop] === null) {
                  myObj[prop] = null;
                } else {
                  if (typeof element[prop] === "object") {
                    let _valueObject = Object.values(element[prop]);
                    myObj[prop] = _valueObject[0];
                  } else {
                    myObj[prop] = element[prop];
                  }
                }
              }
              myObj.key = element.id;
              return myObj;
            }
          );
          setResultList(parserResponse);
        }
      });
    }
  }, [displayEntity]);

  return (
    <TableAntd
      columns={columns}
      dataSource={resultList}
      pagination={{ position: ["bottomCenter"] }}
    />
  );
};

Table.propTypes = {
  displayEntity: PropTypes.shape({
    name: PropTypes.string,
    kind: PropTypes.string,
    fields: PropTypes.array,
    queryAll: PropTypes.string,
  }),
};

export default Table;
