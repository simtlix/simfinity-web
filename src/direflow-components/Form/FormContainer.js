import React, {useCallback, useState, useContext } from "react";
import { Form as FormAntd} from "antd";
import Form from "./Form";
import { requestAddNewEntity } from "./utils";
import { requestEditEntity } from "../Table/EditButton/utils";
import { ConfigContext } from "../config-context";


const FormContainer = ({ displayEntity = null, onSuccess, initialValue = null, }) => {

    const [entitiesStack, setEntitiesStack] = useState([{caller: undefined, requestCode:"root", entity: displayEntity, formName:"root", initialValue: initialValue,}])
    const [openForResultForms, setOpenForResultForms] = useState({root:{caller:"root", requestCode:"root", entity: displayEntity, formName:"root", initialValue: initialValue,}})
    const configContext = useContext(ConfigContext);
    const url = configContext.url;

    const openForResult = useCallback((caller, fieldNameArr, entity, setValue) => {

        let formName = "";

        fieldNameArr.forEach((item)=>{
            formName = formName + `_${item}`;
        });

        setOpenForResultForms((oldState)=>{
            const newState = {...oldState};
            newState[formName] = {caller, formName: formName, callerField: fieldNameArr, entity, setValue}
            return newState;
        });

        setEntitiesStack((oldState) => {
            const newState = [...oldState, {caller, formName: formName, callerField: fieldNameArr, entity, setValue}];
            return newState;
        })
    }, [entitiesStack, openForResultForms]);

    const onSubmit = (data, name, forms) => {
        console.log(data);
        const item = openForResultForms[name];
        
        if (initialValue === null){
          requestAddNewEntity(item.entity, data, url).then((response) => {
            if(name !== "root"){
                item.setValue(response[item.entity.mutations.add].id);
                let value = item.caller.getFieldsValue();
                let first = value;
                item.callerField.forEach((namePart, index) =>{
                    if(index<item.callerField.length-1){
                        value = value[namePart]
                    }
                    
                })

                value.id = response[item.entity.mutations.add].id;

                item.caller.setFieldsValue(first);


                setOpenForResultForms(old => {
                    let newState = {...old}
                    delete newState[name];
                    return newState;
                });

                setEntitiesStack(old => {
                    let newState = [...old]
                    newState.pop();
                    newState[newState.length-1].initialValue = first;
                    return newState;
                });
            } else {
                onSuccess && onSuccess()
            }
            
          });
        }
        else {
          requestEditEntity(item.entity, initialValue, data).then((response) => {
            console.log("response");
            console.log(response);
          });
        }  
    }

    return (
        <FormAntd.Provider onFormFinish={(name, { values, forms }) => {
            
            onSubmit(values, name, forms)

        }}>
            {

                entitiesStack.map((item,index)=>{
                    return <Form key={item.formName} name={item.formName} visible={entitiesStack.length-1===index} displayEntity={item.entity} openForResultHandler={openForResult} initialValues={item.initialValue}></Form>
                })
            }
        </FormAntd.Provider>
    )
    

}

export default FormContainer;