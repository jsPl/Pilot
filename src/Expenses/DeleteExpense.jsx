import React, { useState } from "react";
import { Button, Tooltip } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';

const DeleteExpense = ({ expense, setExpenses }) => {
    const [isVisible, setIsVisible] = useState(false);

    const confirm = (e) => {
        fetch(`http://localhost:3004/expenses/${expense.id}`, {
            method: "DELETE"
        })
            .then(() => {
                setIsVisible(false);
                setExpenses(prev => prev.filter(o => o.id !== expense.id))
            })
    }

    return (
        <Popconfirm
            visible={isVisible}
            title={`Are you sure to delete expense: ${expense.title}?`}
            onConfirm={confirm}
            onCancel={() => setIsVisible(false)}
            okText="Yes"
            cancelText="No"
        >
            <Tooltip title="Delete expense">
                <Button type="primary" size='small' icon={<DeleteOutlined />} onClick={() => setIsVisible(true)} />
            </Tooltip>
        </Popconfirm>
    )

}

export default DeleteExpense;