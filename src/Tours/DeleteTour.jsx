import React, { useState } from "react";
import { Button, Tooltip } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';

const DeleteTour = ({ tour, setTours }) => {
    const [isVisible, setIsVisible] = useState(false);

    const confirm = (e) => {
        console.log(e, tour);

        fetch(`http://localhost:3004/tours/${tour.id}`, {
            method: "DELETE"
        })
            .then(() => {
                setIsVisible(false);
                setTours(prev => prev.filter(o => o.id !== tour.id))
            })
    }

    return (
        <Popconfirm
            open={isVisible}
            title={`Are you sure to delete tour: ${tour.tourCode} - ${tour.title}?`}
            onConfirm={confirm}
            onCancel={() => setIsVisible(false)}
            okText="Yes"
            cancelText="No"
        >
            <Tooltip title="Delete tour">
                <Button type="primary" size='small' icon={<DeleteOutlined />} onClick={() => setIsVisible(true)} />
            </Tooltip>
        </Popconfirm>
    )

}

export default DeleteTour;