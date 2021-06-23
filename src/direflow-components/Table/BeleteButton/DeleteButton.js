import React from 'react';
import { deleteEntity } from './utils';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Button, Space } from "antd";

function DeleteButton({record, displayEntity, handleRefresh}) {

    const { confirm } = Modal;

    function showDeleteConfirm() {
      console.log(displayEntity);
        confirm({
          title: 'Are you sure delete this item?',
          icon: <ExclamationCircleOutlined />,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            clickButtonDelete(displayEntity, record);
          },
          onCancel() {
          },
        });
      }

    const clickButtonDelete = (entity, record) => {
     
            deleteEntity(entity, record.id).then((response) => {
            handleRefresh();
        })
      }

    return (
        <React.Fragment>
            <Button 
                type="primary" 
                shape="round" 
                icon={<DeleteOutlined />} 
                size="large" 
                onClick={showDeleteConfirm}/>
        </React.Fragment>
    )
}

export default DeleteButton

