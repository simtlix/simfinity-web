/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useRef, useContext, useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Space, Form, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { EntitiesContext } from '../entities-context';
import { isDate } from './utils';
import { requestEntity, capitalize } from '../utils';
import { useIntl } from 'react-intl';
import { ConfigContext } from '../config-context';
import { InstancesContext } from './InstancesContext';
import { Field } from './Field';
import { CollectionModalForm } from './CollectionModalForm';
import { EditButton } from './EditButton/EditButton';
import { DeleteButton } from './DeleteButton/DeleteButton';

const EditableContext = React.createContext(null);

const EditableRow = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const generateEditableCellForEntity = (entity) => {
  const EditableCell = ({
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
    const field = entity.fields.filter(
      (item) =>
        item.name === dataIndex ||
        (dataIndex?.indexOf('.') >= 0 && dataIndex?.split('.')[0] === item.name)
    )[0];

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

    if (
      editable &&
      field?.type?.kind !== 'OBJECT' &&
      !field?.extensions?.stateMachine
    ) {
      childNode = editing ? (
        <Field
          entity={entity}
          form={form}
          field={field}
          renderLabel={false}
          onConfirm={save}
          reference={inputRef}
        ></Field>
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
};

const Collection = ({
  field,
  inline = true,
  parentId,
  form,
  openForResult,
}) => {
  const entitiesContext = useContext(EntitiesContext);

  const instancesContext = useContext(InstancesContext);

  const collectionEntity = entitiesContext.filter(
    (e) => e.name === field.type.ofType.name
  )[0];

  const isEmbedded = field.extensions?.relation?.embedded;

  const filteredColumns = collectionEntity.fields.filter((entity) => {
    if (
      entity.name !== 'id' &&
      entity.type.kind !== 'LIST' &&
      entity.type.kind !== 'OBJECT'
    ) {
      return true;
    } else if (
      entity.type.kind === 'OBJECT' &&
      entity?.extensions?.relation?.displayField &&
      entity?.extensions?.relation?.connectionField !==
        field?.extensions?.relation?.connectionField
    ) {
      return true;
    } else {
      return false;
    }
  });

  const searchInputRef = useRef();
  const filterField = collectionEntity.fields.filter(
    (item) =>
      item.extensions?.relation?.connectionField ===
      field.extensions?.relation?.connectionField
  )[0];
  const intl = useIntl();
  const filters = {};
  const [data, setData] = useState(
    isEmbedded ? form.getFieldValue(field.name) : []
  );
  const configContext = useContext(ConfigContext);
  const url = configContext.url;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState();
  const [modalDefaultData, setModalDefaultData] = useState();

  filters[filterField.name] = {
    value: parentId,
    key: filterField.name,
    field: 'id',
    operator: 'EQ',
    entity: {
      type: {
        kind: 'OBJECT',
      },
      extensions: {
        relation: {
          displayFieldScalarType: 'String',
        },
      },
    },
  };

  useEffect(() => {
    if (parentId && !isEmbedded) {
      requestEntity(collectionEntity, url, 1, 1000, filters).then(
        (response) => {
          if (response && response.data) {
            const parserResponse = response.data.data[
              collectionEntity.queryAll
            ].map((element) => {
              const myObj = {};
              for (const prop in element) {
                if (element[prop] === null) {
                  myObj[prop] = null;
                } else {
                  if (typeof element[prop] === 'object') {
                    let _valueObject = Object.values(element[prop]);
                    myObj[prop] = _valueObject[0];
                  } else {
                    myObj[prop] = element[prop];
                  }
                }
              }
              myObj.key = element.id;
              return myObj;
            });
            setData(parserResponse);
          }
        }
      );
    }
  }, [parentId]);

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInputRef}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
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
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
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
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInputRef.current.select(), 100);
      }
    },
  });

  const onUpdateRequested = (id) => {
    //This snipet handle the case when the item was already updated
    const formData = form.getFieldValue(field.name);

    if (formData?.added) {
      let items = formData.added.filter((item) => item.id === id);
      if (items.length > 0) {
        const item = items[0];
        setModalDefaultData(item);
        setModalMode('UPDATE');
        setModalVisible(true);
        return;
      }
    }

    if (formData?.updated) {
      let items = formData.updated.filter((item) => item.id === id);
      if (items.length > 0) {
        const item = items[0];
        setModalDefaultData(item);
        setModalMode('UPDATE');
        setModalVisible(true);
        return;
      }
    }

    const filtersForEntity = {};
    filtersForEntity.id = {
      value: id,
      key: 'id',
      operator: 'EQ',
      entity: {
        type: {
          kind: 'Scalar',
          name: 'String',
        },
        extensions: {
          relation: {
            displayFieldScalarType: 'String',
          },
        },
      },
    };

    requestEntity(collectionEntity, url, 1, 1, filtersForEntity).then(
      (response) => {
        if (response && response.data) {
          const original = response.data.data[collectionEntity.queryAll][0];
          setModalDefaultData(original);
          setModalMode('UPDATE');
          setModalVisible(true);
        }
      }
    );
  };

  const createColumns = (displayEntity, inline) => {
    const pasedColumns = filteredColumns.map((item) => ({
      title: intl.formatMessage({
        id: `entity.${displayEntity.name}.fields.${item.name}`,
        defaultMessage: capitalize(item.name),
      }),
      ...getColumnSearchProps(
        item.type.kind === 'OBJECT' && item?.extensions?.relation?.displayField
          ? `${item.name}.${item.extensions.relation.displayField}`
          : item.name,
        item
      ),
      dataIndex: item.name,
      field: item,
      entity: collectionEntity,
      key:
        item.type.kind === 'OBJECT' && item?.extensions?.relation?.displayField
          ? `${item.name}.${item.extensions.relation.displayField}`
          : item.name,
      render: (text) => {
        if (isDate(item) && text) {
          return new Date(text).toLocaleDateString();
        } else {
          return text;
        }
      },
    }));

    if (!inline) {
      return pasedColumns;
    } else {
      /*
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
            filteredColumns.forEach(item => {
              if(item?.type?.kind !== "OBJECT" && !(item?.extensions?.stateMachine)){
                original[item.name] = row[item.name];
              } else if(item?.type?.kind === "OBJECT") {
                original[item.name] = {id: original[item.name].id}
              } else if(item?.extensions?.stateMachine) {
                delete original[item.name];
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

          }
        })
        

      };
      */

      const columns = pasedColumns.map((col) => {
        return {
          ...col,
          onCell: (record) => ({
            record,
            editable: true,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: onUpdate,
          }),
        };
      });

      columns.push({
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <DeleteButton
              record={record}
              onDelete={(record) => {
                setData((oldData) => {
                  return oldData.filter((item) => item.id !== record.id);
                });

                const formData = form.getFieldValue(field.name) || {};

                //In case the item was previously added
                let wasPreviouslyAdded = false;
                if (formData.added) {
                  const newAdded = formData.added.filter(
                    (item) => item.id !== record.id
                  );
                  formData.added = newAdded;
                  wasPreviouslyAdded = true;
                }

                //In case the item was previously updated
                if (formData.updated) {
                  const newUpdated = formData.updated.filter(
                    (item) => item.id !== record.id
                  );
                  formData.updated = newUpdated;
                }

                if (!wasPreviouslyAdded) {
                  if (formData.deleted) {
                    formData.deleted.push(record.id);
                  } else {
                    formData.deleted = [record.id];
                  }
                }
                const newFormData = {};
                newFormData[field.name] = { ...formData };

                form.setFieldsValue(newFormData);
              }}
            />
            <EditButton
              onClick={() => {
                onUpdateRequested(record.id);
              }}
            ></EditButton>
          </Space>
        ),
      });

      return columns;
    }
  };

  const components = {
    body: {
      row: EditableRow,
      cell: generateEditableCellForEntity(collectionEntity),
    },
  };

  const columns = createColumns(collectionEntity, inline);

  const onCreateInlineRequested = () => {
    setModalDefaultData(undefined);
    setModalMode('CREATE');
    setModalVisible(true);
  };

  const onCreateRequested = () => {};

  const onUpdate = (row) => {
    const fixFields = (value, valueForTable) => {
      filteredColumns.forEach((field) => {
        if (
          field?.type?.kind !== 'OBJECT' &&
          !field?.extensions?.stateMachine
        ) {
          value[field.name] = row[field.name];
          valueForTable[field.name] = row[field.name];
        } else if (field?.type?.kind === 'OBJECT') {
          value[field.name] = { id: row[field.name].id };
          valueForTable[field.name] =
            instancesContext.current[field.type.name][row[field.name].id][
              field.extensions.relation.displayField
            ];
        } else if (field?.extensions?.stateMachine) {
          delete value[field.name];
        }
      });
    };

    //This snipet handle the case when the item added and then updated
    const formData = form.getFieldValue(field.name);

    if (formData?.added) {
      let items = formData.added.filter((item) => item.id === row.id);
      if (items.length > 0) {
        const value = items[0];
        const valueForTable = { ...value };
        fixFields(value, valueForTable);
        setData((old) => {
          const newState = old.map((item) => {
            if (item.id === row.id) {
              return valueForTable;
            } else {
              return item;
            }
          });
          return newState;
        });
        let newAdded = formData.added.filter((item) => item.id !== row.id);
        newAdded.push(value);
        formData.added = newAdded;

        const newFormData = {};
        newFormData[field.name] = { ...formData };

        form.setFieldsValue(newFormData);

        setModalVisible(false);

        return;
      }
    }

    //Updating a an item that was not previously added
    const filtersForEntity = {};
    filtersForEntity.id = {
      value: row.id,
      key: 'id',
      operator: 'EQ',
      entity: {
        type: {
          kind: 'Scalar',
          name: 'String',
        },
        extensions: {
          relation: {
            displayFieldScalarType: 'String',
          },
        },
      },
    };

    requestEntity(collectionEntity, url, 1, 1, filtersForEntity).then(
      (response) => {
        if (response && response.data) {
          const original = response.data.data[collectionEntity.queryAll][0];
          const originalForTable = { ...original };
          fixFields(original, originalForTable);
          original[filterField.name] = { id: original[filterField.name].id };
          setData((old) => {
            const newState = old.map((item) => {
              if (item.id === row.id) {
                return originalForTable;
              } else {
                return item;
              }
            });
            return newState;
          });

          const formData = form.getFieldValue(field.name) || {};
          if (formData.updated) {
            const newUpdated = formData.updated.filter(
              (item) => item.id !== original.id
            );
            newUpdated.push(original);
            formData.updated = newUpdated;
          } else {
            formData.updated = [original];
          }

          const newFormData = {};
          newFormData[field.name] = { ...formData };

          form.setFieldsValue(newFormData);

          setModalVisible(false);
        }
      }
    );
  };

  const onCreate = (value) => {
    value.id = new Date().getTime();

    const valueForTable = { ...value };

    filteredColumns.forEach((field) => {
      if (field?.type?.kind === 'OBJECT') {
        valueForTable[field.name] =
          instancesContext.current[field.type.name][
            valueForTable[field.name].id
          ][field.extensions.relation.displayField];
      }
    });

    setData((old) => {
      const newState = [...old, valueForTable];
      return newState;
    });

    const formData = form.getFieldValue(field.name) || {};
    if (formData.added) {
      formData.added.push(value);
    } else {
      formData.added = [value];
    }

    const newFormData = {};
    newFormData[field.name] = { ...formData };

    form.setFieldsValue(newFormData);

    setModalVisible(false);
  };

  return (
    <Form.Item name={field.name} wrapperCol={{ sm: 24 }}>
      {inline && (
        <Row span={24}>
          <Col span={24}>
            <Row span={24}>
              <Col
                span={24}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Button
                  type="primary"
                  onClick={() => onCreateInlineRequested()}
                  icon={<PlusOutlined />}
                  size="large"
                ></Button>
              </Col>
            </Row>
            <Row span={24}>
              <Col span={24}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {modalVisible && modalMode === 'CREATE' && (
                    <CollectionModalForm
                      entity={collectionEntity}
                      collectionField={field}
                      openForResultHandler={openForResult}
                      onSubmit={onCreate}
                      onCancel={() => setModalVisible(false)}
                    ></CollectionModalForm>
                  )}
                  {modalVisible && modalMode === 'UPDATE' && (
                    <CollectionModalForm
                      entity={collectionEntity}
                      collectionField={field}
                      openForResultHandler={openForResult}
                      onSubmit={onUpdate}
                      onCancel={() => setModalVisible(false)}
                      initialValues={modalDefaultData}
                    ></CollectionModalForm>
                  )}

                  <Table
                    components={components}
                    columns={columns}
                    dataSource={data}
                  />
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      {!inline && (
        <>
          <Row>
            <Col
              span={24}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                type="primary"
                onClick={() => onCreateRequested()}
                icon={<PlusOutlined />}
                size="large"
              ></Button>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table columns={columns} dataSource={data} />
            </Col>
          </Row>
        </>
      )}
    </Form.Item>
  );
};

export default Collection;
