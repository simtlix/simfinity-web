import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from 'react';
import { EntitiesContext } from '../entities-context';
import { Form as FormAntd, Select, Button, Tooltip, Space } from 'antd';
import { requestEntity } from '../Table/utils';
import { ConfigContext } from '../config-context';
import { isString, isNumber, isBoolean } from '../utils';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { InstancesContext } from './InstancesContext';

const { Option } = Select;
export const SelectEntities = ({
  field,
  name,
  form,
  openForResult,
  label,
  containerEntity,
}) => {
  const displayField = field?.extensions?.relation?.displayField;
  const entitiesContext = useContext(EntitiesContext);
  const configContext = useContext(ConfigContext);
  const instancesContext = useContext(InstancesContext);
  const url = configContext.url;
  const [responseEntity, setResponseEntity] = useState([]);
  const [selectValues, setSelectValues] = useState(undefined);
  const currentEntity = useRef();
  const fixedName = [name, 'id'];
  const [initialValue, setInitialVaule] = useState();
  const initialValueFromForm = initialValue
    ? initialValue
    : form.getFieldValue(fixedName);
  const intl = useIntl();
  let current;

  entitiesContext.forEach(async (item) => {
    if (item.name === field.type.name) {
      current = item;
    }
  });

  currentEntity.current = current;

  const createCallback = (id) => {
    setInitialVaule(id);
    let value = form.getFieldsValue();
    let first = value;
    fixedName.forEach((namePart, index) => {
      if (index < fixedName.length - 1) {
        value = value[namePart];
      }
    });

    value.id = id;

    form.setFieldsValue(first);
  };

  useEffect(() => {
    if (initialValue || initialValueFromForm) {
      const fetch = async () => {
        let selectFilters = {};

        let current;

        entitiesContext.forEach(async (item) => {
          if (item.name === field.type.name) {
            current = item;
          }
        });

        currentEntity.current = current;

        selectFilters['id'] = {
          value: initialValue ? initialValue : initialValueFromForm,
          key: 'id',
          operator: 'EQ',
          entity: {
            type: {
              name: 'String',
              kind: 'SCALAR',
            },
          },
        };

        let response = await requestEntity(current, url, 1, 10, selectFilters);
        if (response && response.data) {
          return response.data.data[current.queryAll];
        }
      };
      fetch().then((data) => {
        if (data) {
          if (instancesContext.current[current.name]) {
            instancesContext.current[current.name][data[0].id] = data[0];
          } else {
            instancesContext.current[current.name] = {};
            instancesContext.current[current.name][data[0].id] = data[0];
          }
        }

        setResponseEntity(data);
      });
    }
    // eslint-disable-next-line
  }, [initialValue, initialValueFromForm]);

  useEffect(() => {
    if (selectValues) {
      const fetch = async () => {
        let selectFilters = {};

        let current;

        const descriptionField = field.extensions?.relation?.displayField;

        entitiesContext.forEach(async (item) => {
          if (item.name === field.type.name) {
            current = item;
          }
        });

        currentEntity.current = current;

        let currentField;
        current.fields.forEach((item) => {
          if (item.name === descriptionField) {
            currentField = item;
          }
        });

        selectFilters[descriptionField] = {
          value: selectValues,
          key: descriptionField,
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

        let response = await requestEntity(current, url, 1, 10, selectFilters);
        if (response && response.data) {
          return response.data.data[current.queryAll];
        }
      };
      fetch().then((data) => {
        setResponseEntity(data);
      });
    }
    // eslint-disable-next-line
  }, [selectValues]);
  const renderSelect = useCallback(() => {
    const options = responseEntity?.map((item) => {
      return (
        <Option key={item.id} value={item.id}>
          {item[displayField]}
        </Option>
      );
    });
    return options;
    // eslint-disable-next-line
  }, [responseEntity]);

  // siempre se va a mandar el id como field en este tipo de conexion ?

  const element = useCallback(() => {
    const onPlusButtonClick = () => {
      openForResult(
        form,
        fixedName,
        currentEntity.current,
        createCallback,
        field,
        containerEntity
      );
    };

    return (
      <FormAntd.Item
        name={fixedName}
        label={label}
        initialValue={initialValue ? initialValue : initialValueFromForm}
      >
        <Space>
          <Select
            showSearch
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={(value) => setSelectValues(value)}
            notFoundContent={null}
            onChange={(value) => {
              createCallback(value);
            }}
            value={initialValue ? initialValue : initialValueFromForm}
            style={{ display: 'inline-block', width: '200px' }}
          >
            {renderSelect()}
          </Select>
          <Tooltip
            title={intl.formatMessage({
              id: 'selectentity.tooltip',
              defaultMessage: 'Create',
            })}
          >
            <Button
              type="primary"
              shape="circle"
              onClick={onPlusButtonClick}
              style={{ display: 'inline-block' }}
              icon={<PlusOutlined />}
            />
          </Tooltip>
        </Space>
      </FormAntd.Item>
    );
    // eslint-disable-next-line
  }, [responseEntity, initialValue, initialValueFromForm]);

  return element();
};
