/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { deleteEntity } from './utils';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Button } from 'antd';
import { ConfigContext } from '../../config-context';

function DeleteButton({ record, displayEntity, handleRefresh }) {
  const { confirm } = Modal;
  const configContext = useContext(ConfigContext);
  const url = configContext.url;

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
      onCancel() {},
    });
  }

  const clickButtonDelete = (entity, record) => {
    deleteEntity(entity, record.id, url).then(() => {
      handleRefresh();
    });
  };

  return (
    <React.Fragment>
      <Button
        type="danger"
        shape="circle"
        icon={<DeleteOutlined />}
        size="medium"
        onClick={showDeleteConfirm}
      />
    </React.Fragment>
  );
}

export default DeleteButton;
