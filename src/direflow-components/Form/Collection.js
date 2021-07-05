/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useRef, useContext, useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Space, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { EntitiesContext } from "../entities-context";
import { isDate } from './utils'
import { capitalize } from "../../utils/utils_string";
import { requestEntity } from '../utils';
import {useIntl} from 'react-intl';
import { ConfigContext } from "../config-context";
import { Field } from './Field';
const EditableContext = React.createContext(null);


const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const generateEditableCellForEntity = (entity => {
  
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    const field = entity.fields.filter((item)=>item.name===dataIndex || (dataIndex?.indexOf(".")>=0 && dataIndex?.split(".")[0] === item.name))[0]
    
    useEffect(() => {
      if (editing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [editing]);
   
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
  
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
  
    let childNode = children;
  
    if (editable && field?.type?.kind !== "OBJECT" && !(field?.extensions?.stateMachine)) {
      childNode = editing ? (
        <Field entity={entity} form={form} field={field} renderLabel={false} onConfirm={save} reference={inputRef}></Field>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  
    return <td {...restProps}>{childNode}</td>;
  };

  return EditableCell;
})



const Collection = ({field, inline = true, parentId, mode, form}) => {


  const searchInputRef = useRef();
  const entitiesContext = useContext(EntitiesContext);
  const collectionEntity = entitiesContext.filter((e) => e.name === field.type.ofType.name)[0];
  const filterField = collectionEntity.fields.filter(item => item.extensions?.relation?.connectionField === field.extensions?.relation?.connectionField)[0]
  const intl = useIntl();
  const filters = {}
  const [data, setData] = useState([])
  const configContext = useContext(ConfigContext);
  const url = configContext.url;
  
  filters[filterField.name] = {
    value: parentId,
    key: filterField.name,
    field: "id",
    operator: "EQ",
    entity:{
      type:{
        kind:"OBJECT"
      },
      extensions:{
        relation:{
          displayFieldScalarType: "String",
        }
      }
    }
  }

  useEffect(()=>{
    if(parentId){
      requestEntity(collectionEntity,url,1,1000,filters).then((response)=>{
        if (response && response.data) {
          const parserResponse = response.data.data[collectionEntity.queryAll].map(
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
          setData(parserResponse);
        }
      })
    }
  },[parentId])

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


  const createColumns = (displayEntity, inline) => {
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
      field,
      entity: collectionEntity,
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

    if(!inline){
      return pasedColumns
    }else{
      const handleSave = (row) => {

        setData(old => {
          const newState = old.map(item => {
            if(item.id === row.id){
              return row
            } else {
              return item;
            }
          });
          return newState;
          
        })

        const filtersForEntity = {}
        filtersForEntity.id = {
          value: row.id,
          key: "id",
          operator: "EQ",
          entity:{
            type:{
              kind:"Scalar",
              name:"String"
            },
            extensions:{
              relation:{
                displayFieldScalarType: "String",
              }
            }
          }
        }

        requestEntity(collectionEntity,url,1,1,filtersForEntity).then((response)=>{
          if (response && response.data) {
            const original = response.data.data[collectionEntity.queryAll][0];
            filteredColumns.forEach(field => {
              if(field?.type?.kind !== "OBJECT" && !(field?.extensions?.stateMachine)){
                original[field.name] = row[field.name];
              } else if(field?.type?.kind === "OBJECT") {
                original[field.name] = {id: original[field.name].id}
              } else if(field?.extensions?.stateMachine) {
                delete original[field.name];
              }
            })
            original[filterField.name] = {id: original[filterField.name].id};

            const formData = form.getFieldValue(field.name) || {};
            if(formData.updated){
              const newUpdated = formData.updated.filter(item => item.id !== original.id)
              newUpdated.push(original);
              formData.updated = newUpdated;
            } else {
              formData.updated = [original]
            }
            
            const newFormData = {}
            newFormData[field.name] = {...formData}

            form.setFieldsValue(newFormData);

            console.log(original);
          }
        })
        

      };
  
      const columns = pasedColumns.map((col) => {
        //if (!col.editable) {
        //  return col;
        //}
  
        return {
          ...col,
          onCell: (record) => ({
            record,
            editable: true,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: handleSave,
          }),
        };
      });
  
      return columns;
    }
  }
 
  const components = {
    body: {
      row: EditableRow,
      cell: generateEditableCellForEntity(collectionEntity),
    },
  };

  const columns = createColumns(collectionEntity, inline);

  return (
    <Form.Item name={field.name}>
      {inline? <Table components={components} columns={columns} dataSource={data} /> : <Table columns={columns} dataSource={data} />}
    </Form.Item>
    );
  
}

export default Collection;