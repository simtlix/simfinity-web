import React, { useEffect, useState } from "react";
import { Table as TableAntd } from "antd";
import PropTypes from "prop-types";
import { requestEntity } from "./utils";
import { capitalize } from "../../utils/utils_string";

const Table = ({ displayEntity = null , url}) => {
  const [resultList, setResultList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pagination, setPagination] = useState({ current: 1,
    pageSize: 10, 
    position: ["bottomCenter"], 
    pageSizeOptions: ["10","20", "25", "30"], 
    showSizeChanger: true, 
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => `Total ${total} items`
  });
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (displayEntity) {
      const filteredColumns = displayEntity.fields.filter(
        (entity) =>{
          if(entity.name !== "id" &&
              entity.type.kind !== "LIST" && 
              entity.type.kind !== "OBJECT") {
            return true;
          } else if (entity.type.kind === "OBJECT" && 
                      entity?.extensions?.relation?.displayField){
            return true;
          } else {
            return false;
          }
        }
          
         

      );
      const pasedColumns = filteredColumns.map((entity) => ({
        title: capitalize(entity.name),
        dataIndex: entity.name,
        key: entity.type.kind === "OBJECT" && 
        entity?.extensions?.relation?.displayField ? `${entity.name}.${entity.extensions.relation.displayField}`: entity.name
      }));
      setColumns(pasedColumns);

      requestEntity(displayEntity, url, pagination.current, pagination.pageSize).then((response) => {
        console.log(response)
        if (response && response.data) {
          const parserResponse = response.data.data[displayEntity.queryAll].map(
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
          setTotalCount(response.data.extensions.count);
        }
      });
    }
  }, [displayEntity]);

  useEffect(()=>{
      if (displayEntity) {
      requestEntity(displayEntity, url, pagination.current, pagination.pageSize).then((response) => {
        console.log(response)
        if (response && response.data) {
          const parserResponse = response.data.data[displayEntity.queryAll].map(
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
          setTotalCount(response.data.extensions.count);
        }
      });
    }
  },[pagination])

  const handleTableChange = (pagination, filters, sorter) => {
    
    setPagination(paginationPrevious => {
      return { 
      ...paginationPrevious,
      current: pagination.current,
      pageSize: pagination.pageSize, 
      }
    }
);
  };

  return (
    <TableAntd
      columns={columns}
      dataSource={resultList}
      onChange={handleTableChange}
      pagination={{...pagination, total: totalCount}}
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
