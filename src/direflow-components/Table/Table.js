import React, { useEffect, useState, useRef } from "react";
import { Table as TableAntd, Input, Button, Space, Select } from "antd";
import PropTypes from "prop-types";
import { requestEntity } from "./utils";
import { capitalize } from "../../utils/utils_string";
import { SearchOutlined } from '@ant-design/icons';
const { Option } = Select;
const Table = ({ displayEntity = null , url}) => {
  const [resultList, setResultList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pagination, setPagination] = useState({ current: 1,
    pageSize: 10, 
    position: ["bottomCenter"], 
    pageSizeOptions: ["10","20", "25", "30"], 
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => `Total ${total} items`
  });
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({});
  const searchInput = useRef(null);
  const [selectedOperator, _setSelectedOperator] = useState("EQ")
  const selectedOperatorRef = useRef(selectedOperator)
  const setSelectedOperator = operator => {
    selectedOperatorRef.current = operator
    _setSelectedOperator(operator)
  }

  const handleSearch = (selectedKeys, confirm, dataIndex, entity) => {
    confirm();

    setFilters(previous => {
      const newState = {...previous}
      newState[entity.name] = { value: selectedKeys[0], 
        key:dataIndex.indexOf(".")>0?dataIndex.split(".")[0]:dataIndex, 
        field:dataIndex.indexOf(".")>0?dataIndex.split(".")[1]:undefined,
        entity,
        operator: selectedOperatorRef.current
      }
      return newState;
      }
    )
    console.log("handleSearch")
  };

  const handleReset = (clearFilters, entity) => {
    clearFilters();
    setFilters(previous => {
      const newState = {...previous};
      delete newState[entity.name];
      return newState;
      }
    )
    console.log("handleReset")
  };

  const getOptions = (entity) => {
    if(entity.type.kind !== "OBJECT"){
      return (
        <>
        <Option value="EQ">=</Option>
        <Option value="LT">&lt;</Option>
        <Option value="LTE">&lt;=</Option>
        <Option value="GT">&gt;</Option>
        <Option value="GTE">&gt;=</Option>
        {(entity.type.name === "String" || (entity.type.kind === "NON_NULL" && entity.type.ofType.name === "String")) && <Option value="LIKE">Contains</Option>}
        </>
      )
    } else{
      return (
        <>
          <Option value="EQ">=</Option>
        </>
      )
    }
  }

  const handleSelectOnChange = (value) =>{
    setSelectedOperator(value)
  }

  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
          <div>
            <Space style={{display:'flex', flexDirection:'row'}}>
              <Select defaultValue="EQ" style={{ marginBottom: 8, display:'block'}} onChange={handleSelectOnChange}>
                {getOptions(type)}
              </Select>
              
              <Input
                ref={searchInput}
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, type)}
                style={{ marginBottom: 8, display:'block'}}
              />
            </Space>
          </div>
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex, type)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters, type)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex, type)}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    
  });

  


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
        ...getColumnSearchProps(entity.type.kind === "OBJECT" && 
        entity?.extensions?.relation?.displayField ? `${entity.name}.${entity.extensions.relation.displayField}`: entity.name, entity),
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
      requestEntity(displayEntity, url, pagination.current, pagination.pageSize, filters).then((response) => {
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
  },[pagination, filters])

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
