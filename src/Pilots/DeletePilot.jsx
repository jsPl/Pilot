import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';

const DeletePilot = ({ pilot, setPilots }) => {
    const [isVisible, setIsVisible] = useState(false);

    const confirm = (e) => {
        console.log(e, pilot);

        fetch(`http://localhost:3004/pilots/${pilot.id}`, {
            method: "DELETE"
        })
            .then(() => {
                setIsVisible(false);
                setPilots(prev => prev.filter(o => o.id !== pilot.id))
            })
    }

    return (
        <Popconfirm
            visible={isVisible}
            title={`Are you sure to delete pilot: ${pilot.name}?`}
            onConfirm={confirm}
            onCancel={() => setIsVisible(false)}
            okText="Yes"
            cancelText="No"
        >
            <Button type="primary" size='small' icon={<DeleteOutlined />} onClick={() => setIsVisible(true)} />
        </Popconfirm>
    )

}

export default DeletePilot;