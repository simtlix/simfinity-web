import React, { useEffect, useState } from "react";
import { Table as TableAntd, Space} from "antd";
import PropTypes from "prop-types";
import { requestEntity } from "./utils";
import { capitalize } from "../../utils/utils_string";
import DeleteButton from './BeleteButton/DeleteButton'

const Table = ({ displayEntity = null  }) => {
  const [resultList, setResultList] = useState([]);
  const [columns, setColumns] = useState([]);



  useEffect(() => {

    const refreshTable = () => {

      requestEntity(displayEntity).then((response) => {
        if (response) {
          const parserResponse = response[displayEntity.queryAll].map(
            (element) => {
              const myObj = {};
              for (const prop in element) {
                if (typeof element[prop] === "object") {
                  let _valueObject = Object.values(element[prop]);
                  myObj[prop] = _valueObject[0];
                } else {
                  myObj[prop] = element[prop];
                }
              }
              myObj.key = element.id;
              return myObj;
            }
          );
          setResultList(parserResponse);
        }
      });
  
    };

    if (displayEntity) {
      const filteredColumns = displayEntity.fields.filter(
        (entity) =>
          entity.name !== "id" &&
          entity.type.kind !== "LIST" &&
          !entity?.extensions?.relation?.embedded
      );
      let pasedColumns = filteredColumns.map((entity) => ({
        title: capitalize(entity.name),
        dataIndex: entity.name,
        key: entity.name,
      }));

      pasedColumns.push({
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <DeleteButton record={record} displayEntity={displayEntity} handleRefresh={() => {refreshTable()}}/>
          </Space>
        )});
        
      setColumns(pasedColumns);

      refreshTable();
      
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
