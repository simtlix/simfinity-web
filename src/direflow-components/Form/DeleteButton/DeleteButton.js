/* eslint-disable react/prop-types */
import React from 'react';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Button  } from "antd";

export function DeleteButton({record, onDelete}) {

    const { confirm } = Modal;

    function showDeleteConfirm() {
        confirm({
          title: 'Are you sure delete this item?',
          icon: <ExclamationCircleOutlined />,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            clickButtonDelete(record);
          },
          onCancel() {
          },
        });
      }

    const clickButtonDelete = (record) => {
     
            onDelete(record);
        }
      

    return (
        <React.Fragment>
            <Button 
                type="primary" 
                shape="round" 
                icon={<DeleteOutlined />} 
                size="small" 
                onClick={showDeleteConfirm}/>
        </React.Fragment>
    )
}

