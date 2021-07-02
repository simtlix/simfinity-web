/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useRef, useContext } from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { EntitiesContext } from "../entities-context";
import { isDate } from './utils'
import { capitalize } from "../../utils/utils_string";
import {useIntl} from 'react-intl';



const Collection = ({data, field, parentEntity}) => {


  const searchInputRef = useRef();
  const entitiesContext = useContext(EntitiesContext);
  const collectionEntity = entitiesContext.filter((e) => e.name === field.type.ofType.name);
  const intl = useIntl();

  

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();

    
  };

  const handleReset = clearFilters => {
    clearFilters();
  };


  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInputRef}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });

            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInputRef.current.select(), 100);
      }
    },
  });


  const createColumns = (displayEntity) => {
    const filteredColumns = displayEntity.fields.filter(
      (entity) => {
        if (entity.name !== "id" &&
          entity.type.kind !== "LIST" &&
          entity.type.kind !== "OBJECT") {
          return true;
        } else if (entity.type.kind === "OBJECT" &&
          entity?.extensions?.relation?.displayField && 
          entity?.extensions?.relation?.connectionField !== field?.extensions?.relation?.connectionField) {
          return true;
        } else {
          return false;
        }
      }
    );
  
    const pasedColumns = filteredColumns.map((field) => ({
      title: intl.formatMessage({ id:`entity.${displayEntity.name}.fields.${field.name}`, defaultMessage:capitalize(field.name)}),
      ...getColumnSearchProps(field.type.kind === "OBJECT" &&
        field?.extensions?.relation?.displayField ? `${field.name}.${field.extensions.relation.displayField}` : field.name, field),
      dataIndex: field.name,
      key: field.type.kind === "OBJECT" &&
        field?.extensions?.relation?.displayField ? `${field.name}.${field.extensions.relation.displayField}` : field.name,
      render: (text) => {
        if (isDate(field) && text) {
          return new Date(text).toLocaleDateString();
        } else {
          return text;
        }
      }
    }));

    return pasedColumns;
  }
 
    const columns = createColumns(collectionEntity[0]);
    return <Table columns={columns} dataSource={data} />;
  
}

export default Collection;