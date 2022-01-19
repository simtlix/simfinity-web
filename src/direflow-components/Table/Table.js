/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Table as TableAntd,
  Input,
  Button,
  Space,
  Select,
  InputNumber,
  Switch,
  DatePicker,
  Row,
  Col,
} from 'antd';
import PropTypes from 'prop-types';
import { requestEntity } from './utils';
import {
  isBoolean,
  isNumber,
  isString,
  isDate,
  isEnum,
  capitalize,
} from '../utils';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

import { FormattedMessage, useIntl } from 'react-intl';
import DeleteButton from './DeleteButton/DeleteButton';
import EditButton from './EditButton/EditButton';
import 'antd/dist/antd.css';

const { Option } = Select;

const Table = ({
  displayEntity = null,
  url,
  entities,
  onCreateRequested,
  onUpdateRequested,
}) => {
  const intl = useIntl();
  const [resultList, setResultList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    position: ['bottomCenter'],
    pageSizeOptions: ['10', '20', '25', '30'],
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => {
      return intl.formatMessage(
        { id: 'table.total', defaultMessage: 'Total {total} items' },
        { total }
      );
    },
  });
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({});
  const searchInput = useRef(null);
  const [selectedOperator, setSelectedOperator] = useState('EQ');
  const [selectValuesFilter, setSelectValuesFilter] = useState(undefined);
  const [selectValues, setSelectValues] = useState();
  const [sort, setSort] = useState();
  const [lastDeleted, setLastDeleted] = useState();

  useEffect(() => {
    if (displayEntity && selectValuesFilter) {
      const { selectedKeys, dataIndex, entity } = selectValuesFilter;

      const fetch = async () => {
        let selectFilters = {};
        const propName = dataIndex.split('.')[0];
        const fieldName = dataIndex.split('.')[1];
        let current;

        entities.forEach(async (item) => {
          if (item.name === entity.type.name) {
            current = item;
          }
        });

        let currentField;
        current.fields.forEach((field) => {
          if (field.name === fieldName) {
            currentField = field;
          }
        });

        if (entity.extensions?.relation?.embedded) {
          selectFilters = { ...filters };
          selectFilters[propName] = {
            value: selectedKeys,
            key: propName,
            field: fieldName,
            operator: isString(currentField) ? 'LIKE' : 'EQ',
            entity: {
              type: {
                kind: 'OBJECT',
              },
              extensions: {
                relation: {
                  displayFieldScalarType: isString(currentField)
                    ? 'String'
                    : isNumber(currentField)
                    ? 'Int'
                    : isBoolean(currentField)
                    ? 'Boolean'
                    : 'DateTime',
                },
              },
            },
          };
        } else {
          selectFilters[fieldName] = {
            value: selectedKeys,
            key: fieldName,
            operator: isString(currentField) ? 'LIKE' : 'EQ',
            entity: {
              type: {
                name: isString(currentField)
                  ? 'String'
                  : isNumber(currentField)
                  ? 'Int'
                  : isBoolean(currentField)
                  ? 'Boolean'
                  : 'DateTime',
                kind: 'SCALAR',
              },
            },
          };

          if (Object.keys(filters).length > 0) {
            let relationField;
            current.fields.forEach((field) => {
              if (
                field?.extensions?.relation?.connectionField ===
                entity?.extensions?.relation?.connectionField
              ) {
                relationField = field;
              }
            });

            selectFilters[relationField.name] = {
              terms: filters,
              key: relationField.name,
            };
          }
        }

        let response = await requestEntity(
          entity.extensions?.relation?.embedded ? displayEntity : current,
          url,
          1,
          10,
          selectFilters
        );
        if (response && response.data) {
          const parserResponse = [];

          response.data.data[
            entity.extensions?.relation?.embedded
              ? displayEntity.queryAll
              : current.queryAll
          ].forEach((element) => {
            let value;
            if (entity.extensions?.relation?.embedded) {
              value = element[propName][fieldName];
            } else {
              value = element[fieldName];
            }

            if (parserResponse.indexOf(value) < 0) {
              parserResponse.push(value);
            }
          });

          setSelectValues(parserResponse);
        }
      };
      fetch();
    }
  }, [selectValuesFilter, displayEntity, entities, url]);

  const handleReset = (clearFilters, entity) => {
    clearFilters();
    setSelectValues(undefined);
    setFilters((previous) => {
      const newState = { ...previous };
      delete newState[entity.name];
      return newState;
    });
    console.log('handleReset');
  };

  const getObjectFilterOptions = (selectValuesParam) => {
    return selectValuesParam.map((item) => (
      <Option key={item} value={item}>
        {item}
      </Option>
    ));
  };

  const getOptions = (entity) => {
    if (entity.type.kind !== 'OBJECT') {
      return (
        <>
          <Option value="EQ">=</Option>
          <Option value="LT">&lt;</Option>
          <Option value="LTE">&lt;=</Option>
          <Option value="GT">&gt;</Option>
          <Option value="GTE">&gt;=</Option>
          {(entity.type.name === 'String' ||
            (entity.type.kind === 'NON_NULL' &&
              entity.type.ofType.name === 'String')) && (
            <Option value="LIKE">Contains</Option>
          )}
        </>
      );
    } else {
      return (
        <>
          <Option value="EQ">=</Option>
        </>
      );
    }
  };

  const getColumnSearchProps = useCallback(
    (dataIndex, type) => {
      const handleSearch = (selectedKeys, confirm, dataIndex, entity) => {
        confirm();
        if (entity.type.kind !== 'OBJECT') {
          setFilters((previous) => {
            const newState = { ...previous };
            newState[entity.name] = {
              value: selectedKeys[0],
              key:
                dataIndex.indexOf('.') > 0
                  ? dataIndex.split('.')[0]
                  : dataIndex,
              field:
                dataIndex.indexOf('.') > 0
                  ? dataIndex.split('.')[1]
                  : undefined,
              entity,
              operator: selectedOperator,
            };
            return newState;
          });
        } else {
          let current;
          const propName = dataIndex.split('.')[0];
          const fieldName = dataIndex.split('.')[1];

          entities.forEach(async (item) => {
            if (item.name === entity.type.name) {
              current = item;
            }
          });

          let currentField;
          current.fields.forEach((field) => {
            if (field.name === fieldName) {
              currentField = field;
            }
          });
          const filter = {
            value: selectedKeys,
            key: propName,
            field: fieldName,
            operator: selectedOperator,
            entity: {
              type: {
                kind: 'OBJECT',
              },
              extensions: {
                relation: {
                  displayFieldScalarType: isString(currentField)
                    ? 'String'
                    : isNumber(currentField)
                    ? 'Int'
                    : isBoolean(currentField)
                    ? 'Boolean'
                    : 'DateTime',
                },
              },
            },
          };

          setFilters((previous) => {
            const newState = { ...previous };
            newState[entity.name] = filter;
            return newState;
          });
        }
      };

      const placeholder = intl.formatMessage(
        {
          id: `table.search`,
          defaultMessage: `Search ${intl.formatMessage({
            id: `entity.${displayEntity.name}.fields.${type.name}`,
            defaultMessage: `${type.name}`,
          })}`,
        },
        {
          field: intl.formatMessage({
            id: `entity.${displayEntity.name}.fields.${type.name}`,
            defaultMessage: `${type.name}`,
          }),
        }
      );

      return {
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <div>
              <Space style={{ display: 'flex', flexDirection: 'row' }}>
                <Select
                  defaultValue="EQ"
                  style={{ marginBottom: 8, display: 'block', flex: 1 }}
                  onChange={setSelectedOperator}
                >
                  {getOptions(type)}
                </Select>

                {type.type.kind !== 'OBJECT' ? (
                  <>
                    {(isEnum(type) || isString(type)) && (
                      <Input
                        ref={searchInput}
                        placeholder={placeholder}
                        value={selectedKeys[0]}
                        onChange={(e) =>
                          setSelectedKeys(
                            e.target.value ? [e.target.value] : []
                          )
                        }
                        onPressEnter={() =>
                          handleSearch(selectedKeys, confirm, dataIndex, type)
                        }
                        style={{
                          width: 200,
                          marginBottom: 8,
                          display: 'block',
                          flex: 2,
                        }}
                      />
                    )}
                    {isNumber(type) && (
                      <InputNumber
                        ref={searchInput}
                        placeholder={placeholder}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e ? [e] : [])}
                        onPressEnter={() =>
                          handleSearch(selectedKeys, confirm, dataIndex, type)
                        }
                        style={{
                          width: 200,
                          marginBottom: 8,
                          display: 'block',
                          flex: 2,
                        }}
                      />
                    )}
                    {isBoolean(type) && (
                      <Switch
                        checked={selectedKeys[0]}
                        onChange={(e) => {
                          setSelectedKeys(e ? [e] : []);
                        }}
                        style={{ marginBottom: 8, display: 'block', flex: 2 }}
                      />
                    )}
                    {isDate(type) && (
                      <DatePicker
                        value={selectedKeys[0]}
                        onChange={(e) => {
                          setSelectedKeys(e ? [e] : []);
                        }}
                        style={{ marginBottom: 8, display: 'block', flex: 2 }}
                      />
                    )}
                  </>
                ) : (
                  <Select
                    style={{
                      width: 200,
                      marginBottom: 8,
                      display: 'block',
                      flex: 2,
                    }}
                    showSearch
                    value={selectedKeys}
                    placeholder={placeholder}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={(value) => {
                      setSelectedKeys(value);
                      setSelectedOperator('EQ');
                      setSelectValuesFilter({
                        selectedKeys: value,
                        confirm,
                        dataIndex,
                        entity: type,
                      });
                    }}
                    onChange={(value) => {
                      setSelectedKeys(value);
                      setSelectedOperator('EQ');
                      handleSearch(
                        [value],
                        confirm,
                        dataIndex,
                        type
                      ); /*selectValuesRef.current = undefined*/
                    }}
                    notFoundContent={null}
                  >
                    {selectValues && getObjectFilterOptions(selectValues)}
                  </Select>
                )}
              </Space>
            </div>
            <Space>
              <Button
                type="primary"
                onClick={() =>
                  handleSearch(selectedKeys, confirm, dataIndex, type)
                }
                size="small"
                style={{ width: 90 }}
              >
                <FormattedMessage
                  id="table.filter.search"
                  defaultMessage="Search"
                ></FormattedMessage>
              </Button>
              <Button
                onClick={() => handleReset(clearFilters, type)}
                size="small"
                style={{ width: 90 }}
              >
                <FormattedMessage
                  id="table.filter.reset"
                  defaultMessage="Reset"
                ></FormattedMessage>
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() =>
                  handleSearch(selectedKeys, confirm, dataIndex, type)
                }
              >
                <FormattedMessage
                  id="table.filter.filter"
                  defaultMessage="Filter"
                ></FormattedMessage>
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput?.current?.select(), 100);
          } else {
            setSelectValues(undefined);
          }
        },
      };
    },
    [selectValues, selectedOperator]
  );

  const createColumns = (
    displayEntity,
    getColumnSearchProps,
    isDate,
    setColumns
  ) => {
    const filteredColumns = displayEntity.fields.filter((entity) => {
      if (
        entity.name !== 'id' &&
        entity.type.kind !== 'LIST' &&
        entity.type.kind !== 'OBJECT'
      ) {
        return true;
      } else if (
        entity.type.kind === 'OBJECT' &&
        entity?.extensions?.relation?.displayField
      ) {
        return true;
      } else {
        return false;
      }
    });

    const pasedColumns = filteredColumns.map((entity) => ({
      title: intl.formatMessage({
        id: `entity.${displayEntity.name}.fields.${entity.name}`,
        defaultMessage: capitalize(entity.name),
      }),
      ...getColumnSearchProps(
        entity.type.kind === 'OBJECT' &&
          entity?.extensions?.relation?.displayField
          ? `${entity.name}.${entity.extensions.relation.displayField}`
          : entity.name,
        entity
      ),
      dataIndex: entity.name,
      sorter: true,
      key:
        entity.type.kind === 'OBJECT' &&
        entity?.extensions?.relation?.displayField
          ? `${entity.name}.${entity.extensions.relation.displayField}`
          : entity.name,
      render: (text) => {
        if (isDate(entity) && text) {
          return new Date(text).toLocaleDateString();
        } else {
          return text;
        }
      },
    }));

    pasedColumns.push({
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <DeleteButton
            record={record}
            displayEntity={displayEntity}
            handleRefresh={() => {
              setLastDeleted(record.id);
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

    setColumns(pasedColumns);
  };

  useEffect(() => {
    if (displayEntity) {
      createColumns(displayEntity, getColumnSearchProps, isDate, setColumns);
    }
  }, [getColumnSearchProps]);

  useEffect(() => {
    if (displayEntity) {
      createColumns(displayEntity, getColumnSearchProps, isDate, setColumns);

      requestEntity(
        displayEntity,
        url,
        pagination.current,
        pagination.pageSize,
        filters,
        sort
      ).then((response) => {
        console.log(response);
        if (response && response.data) {
          const parserResponse = response.data.data[displayEntity.queryAll].map(
            (element) => {
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
            }
          );
          setResultList(parserResponse);
          setTotalCount(response.data.extensions.count);
        }
      });
    }
  }, [displayEntity, pagination, filters, url, sort, lastDeleted]);

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination((paginationPrevious) => {
      if (
        pagination.current !== paginationPrevious.current ||
        pagination.pageSize !== paginationPrevious.pageSize
      ) {
        return {
          ...paginationPrevious,
          current: pagination.current,
          pageSize: pagination.pageSize,
        };
      } else {
        return paginationPrevious;
      }
    });

    if (sorter) {
      setSort((sortPrevious) => {
        const order =
          sorter.order === 'descend'
            ? 'DESC'
            : sorter.order === 'ascend'
            ? 'ASC'
            : null;
        if (
          sortPrevious?.field !== sorter.columnKey ||
          sortPrevious?.order !== order
        ) {
          return order ? { field: sorter.columnKey, order: order } : null;
        } else {
          return sortPrevious;
        }
      });
    }
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Space direction={'vertical'} style={{ width: '100%' }}>
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
                  ghost
                >
                  Add
                </Button>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <TableAntd
                  columns={columns}
                  dataSource={resultList}
                  onChange={handleTableChange}
                  pagination={{ ...pagination, total: totalCount }}
                />
              </Col>
            </Row>
          </Space>
        </Col>
      </Row>
    </>
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
