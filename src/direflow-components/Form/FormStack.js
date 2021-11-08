/* eslint-disable react/prop-types */
import React, {
  useCallback,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { Form as FormAntd } from 'antd';
import Form from './Form';
import { requestAddNewEntity, requestUpdateEntity } from './utils';
import { ConfigContext } from '../config-context';
import { requestEntity } from '../utils';
import { EntitiesContext } from '../entities-context';
import { InstancesContext } from './InstancesContext';

const FormStack = ({ displayEntity = null, onSuccess, mode, id }) => {
  const [entitiesStack, setEntitiesStack] = useState([
    {
      caller: undefined,
      requestCode: 'root',
      entity: displayEntity,
      formName: 'root',
      mode,
    },
  ]);
  const [openForResultForms, setOpenForResultForms] = useState({
    root: {
      caller: 'root',
      requestCode: 'root',
      entity: displayEntity,
      formName: 'root',
      mode,
    },
  });
  const configContext = useContext(ConfigContext);
  const url = configContext.url;
  const entitiesContext = useContext(EntitiesContext);
  const instancesRef = useRef({});

  const openForResult = useCallback(
    (caller, fieldNameArr, entity, setValue, linkField, containerEntity) => {
      let formName = '';

      fieldNameArr.forEach((item) => {
        formName = formName + `_${item}`;
      });

      setOpenForResultForms((oldState) => {
        const newState = { ...oldState };
        newState[formName] = {
          caller,
          formName: formName,
          callerField: fieldNameArr,
          entity,
          setValue,
          mode: 'CREATE',
          linkField,
          containerEntity,
        };
        return newState;
      });

      setEntitiesStack((oldState) => {
        const newState = [
          ...oldState,
          {
            caller,
            formName: formName,
            callerField: fieldNameArr,
            entity,
            setValue,
            mode: 'CREATE',
            linkField,
            containerEntity,
          },
        ];
        return newState;
      });
    },
    [entitiesStack, openForResultForms]
  );

  useEffect(() => {
    if (mode === 'UPDATE') {
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

      requestEntity(
        displayEntity,
        url,
        1,
        1,
        filtersForEntity,
        undefined,
        entitiesContext
      ).then((response) => {
        if (response && response.data) {
          const stored = response.data.data[displayEntity.queryAll][0];
          setEntitiesStack((old) => {
            const newState = [...old];
            newState[0].initialValue = stored;
            return newState;
          });
        }
      });
    }
  }, []);

  const onSubmit = (data, name) => {
    console.log(data);
    const item = openForResultForms[name];

    if (name === 'root' && mode === 'UPDATE') {
      data.id = id;
      requestUpdateEntity(item.entity, data, url).then((response) => {
        if (instancesRef.current[item.entity.name]) {
          instancesRef.current[item.entity.name][data.id] = data;
        } else {
          instancesRef.current[item.entity.name] = {};
          instancesRef.current[item.entity.name][data.id] = data;
        }
        console.log(response);
        onSuccess && onSuccess();
      });
    } else {
      requestAddNewEntity(item.entity, data, url).then((response) => {
        if (!response[item.entity.mutations.add]) {
          alert("Something was wrong. Try again!");
          onSuccess && onSuccess()
          return;
        }
        data.id = response[item.entity.mutations.add].id;
        if (instancesRef.current[item.entity.name]) {
          instancesRef.current[item.entity.name][data.id] = data;
        } else {
          instancesRef.current[item.entity.name] = {};
          instancesRef.current[item.entity.name][data.id] = data;
        }
        if (name !== 'root') {
          item.setValue(response[item.entity.mutations.add].id);

          setOpenForResultForms((old) => {
            let newState = { ...old };
            delete newState[name];
            return newState;
          });

          setEntitiesStack((old) => {
            let newState = [...old];
            newState.pop();
            return newState;
          });
        } else {
          onSuccess && onSuccess();
        }
      });
    }
  };
  const render = useCallback(() => {
    return (
      <FormAntd.Provider
        onFormFinish={(name, { values, forms }) => {
          onSubmit(values, name, forms);
        }}
      >
        <InstancesContext.Provider value={instancesRef}>
          {entitiesStack.map((item, index) => {
            return (
              <Form
                key={item.formName}
                name={item.formName}
                visible={entitiesStack.length - 1 === index}
                displayEntity={item.entity}
                openForResultHandler={openForResult}
                initialValues={item.initialValue}
                mode={item.mode}
                linkField={item.linkField}
                containerEntity={item.containerEntity}
              ></Form>
            );
          })}
        </InstancesContext.Provider>
      </FormAntd.Provider>
    );
  }, [entitiesStack]);

  return render();
};

export default FormStack;
