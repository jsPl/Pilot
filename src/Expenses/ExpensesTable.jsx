import { Button } from 'antd';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Table, Space, Tooltip } from 'antd';
import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import DeleteExpense from './DeleteExpense';

const ExpensesTable = ({ expenses, setExpenses, isLoading }) => {
    const { tourId } = useParams();

    const columns = [
        {
            title: 'Expense title',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: 'Value',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => new Intl.NumberFormat(navigator.language, { minimumFractionDigits: 2 }).format(text)
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            key: 'currency'
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Link to={`/tours/${tourId}/expenses/${record.id}`}>
                        <Tooltip title="Edit expense">
                            <Button type="dashed" icon={<EditOutlined />} size='small' />
                        </Tooltip>
                    </Link>
                    <DeleteExpense expense={record} setExpenses={setExpenses} />
                </Space>
            )
        }
    ]

    return (
        <>
            <h2>Manage tour expenses</h2>
            <Table rowKey='id' columns={columns} dataSource={expenses} loading={isLoading} />

            <Link to={`/tours/${tourId}/expenses/new`}>
                <Button type='primary' shape='round' icon={<PlusCircleOutlined />} size='large'>
                    Add new expense
                </Button>
            </Link>
        </>
    )
}

export default ExpensesTable;