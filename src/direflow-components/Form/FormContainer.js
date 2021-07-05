/* eslint-disable react/prop-types */
import React, {useCallback, useState, useContext, useEffect } from "react";
import { Form as FormAntd} from "antd";
import Form from "./Form";
import { requestAddNewEntity, requestUpdateEntity } from "./utils";
import { ConfigContext } from "../config-context";
import { requestEntity } from '../utils';
import { EntitiesContext } from "../entities-context";




const FormContainer = ({ displayEntity = null, onSuccess, mode="UPDATE", id="60dbca363507a52512db5e93" }) => {

    const [entitiesStack, setEntitiesStack] = useState([{caller: undefined, requestCode:"root", entity: displayEntity, formName:"root", mode}])
    const [openForResultForms, setOpenForResultForms] = useState({root:{caller:"root", requestCode:"root", entity: displayEntity, formName:"root", mode}})
    const configContext = useContext(ConfigContext);
    const url = configContext.url;
    const entitiesContext = useContext(EntitiesContext);


    const openForResult = useCallback((caller, fieldNameArr, entity, setValue) => {

        let formName = "";

        fieldNameArr.forEach((item)=>{
            formName = formName + `_${item}`;
        });

        setOpenForResultForms((oldState)=>{
            const newState = {...oldState};
            newState[formName] = {caller, formName: formName, callerField: fieldNameArr, entity, setValue, mode:"CREATE"}
            return newState;
        });

        setEntitiesStack((oldState) => {
            const newState = [...oldState, {caller, formName: formName, callerField: fieldNameArr, entity, setValue, mode:"CREATE"}];
            return newState;
        })
    }, [entitiesStack, openForResultForms]);

    useEffect(()=>{
        if(mode === "UPDATE") {
            const filtersForEntity = {}
            filtersForEntity.id = {
            value: id,
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

            requestEntity(displayEntity,url,1,1,filtersForEntity,undefined,entitiesContext).then((response)=>{
            if (response && response.data) {
                const stored = response.data.data[displayEntity.queryAll][0];
                setEntitiesStack((old) => {
                    const newState = [...old];
                    newState[0].initialValue = stored;
                    return newState;
                })
            }
            })
    }
    },[]);

    const onSubmit = (data, name, forms) => {
        console.log(data);
        const item = openForResultForms[name];

        if(name === "root" && mode === "UPDATE") {
            data.id = id;
            requestUpdateEntity(item.entity, data, url).then((response) => {
                console.log(response);
                onSuccess && onSuccess()
            });
        } else {
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
        
        
    }
    const render = useCallback(()=>{return (
        <FormAntd.Provider onFormFinish={(name, { values, forms }) => {
            
            onSubmit(values, name, forms)

        }}>
            {

                entitiesStack.map((item,index)=>{
                    return <Form key={item.formName} name={item.formName} visible={entitiesStack.length-1===index} displayEntity={item.entity} openForResultHandler={openForResult} initialValues={item.initialValue} mode={mode}></Form>
                })
            }
        </FormAntd.Provider>
    )},[entitiesStack])
    
    return render();
    

}

export default FormContainer;