import React, {useCallback, useState, useContext } from "react";
import { Form as FormAntd} from "antd";
import Form from "./Form";
import { requestAddNewEntity } from "./utils";
import { ConfigContext } from "../config-context";


const FormContainer = ({ displayEntity = null, onSuccess }) => {

    const [entitiesStack, setEntitiesStack] = useState([{caller: undefined, requestCode:"root", entity: displayEntity, formName:"root"}])
    const [openForResultForms, setOpenForResultForms] = useState({root:{caller:"root", requestCode:"root", entity: displayEntity, formName:"root"}})
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
        
        requestAddNewEntity(item.entity, data, url).then((response) => {
            if(name !== "root"){
                item.setValue(response[item.entity.mutations.add].id);
                

                setOpenForResultForms(old => {
                    let newState = {...old}
                    delete newState[name];
                    return newState;
                });

                setEntitiesStack(old => {
                    let newState = [...old]
                    newState.pop();
                    return newState;
                });
            } else {
                onSuccess && onSuccess(response[item.entity.mutations.add].id)
            }
            
        });
    }

    return (
        <FormAntd.Provider onFormFinish={(name, { values, forms }) => {
            
            onSubmit(values, name, forms)

        }}>
            {

                entitiesStack.map((item,index)=>{
                    return <Form key={item.formName} name={item.formName} visible={entitiesStack.length-1===index} displayEntity={item.entity} openForResultHandler={openForResult} ></Form>
                })
            }
        </FormAntd.Provider>
    )
    

}

export default FormContainer;