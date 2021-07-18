import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button } from "antd";

function EditButton({handleClick}) {

    return (
        <React.Fragment>
            <Button
              type="primary"
              shape="round"
              icon={<EditOutlined />}
              size="large"
              onClick={() => handleClick()}
            />
        </React.Fragment>
    )
}

export default EditButton