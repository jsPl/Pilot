import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useParams } from 'react-router-dom';
import { Table, Space, Button, Tooltip } from 'antd';
import { EditOutlined, PlusCircleOutlined, EuroOutlined } from '@ant-design/icons';
import '../style/generic.scss';

const ExpensesTable = (props) => {
    const { tourId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:3004/tour/${tourId}/expenses`)
            .then(r => r.json())
            .then(data => setExpenses(data))
            .finally(() => setIsLoading(false))
    }, [tourId]);

    return (
        <>
            <h1 className="all-pilots-title">Manage tour expenses</h1>

            <Table rowKey='id' columns={columns} dataSource={expenses} loading={isLoading} />

            <Link to={`/tours/${tourId}/expenses/new`}>
                <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large'>
                    Add new expense
                </Button>
            </Link>

            <Outlet />
        </>
    )
}

const columns = [{
    title: 'Expense title',
    dataIndex: 'title',
    key: 'title',
},
{
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
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
    key: 'currency',
},
{
    title: 'Action',
    key: 'action',
    render: (text, record) => (
        <Space size="middle">
            {/* <Link to={`/tours/${record.id}`}>
                <Tooltip title="Edit tour">
                    <Button type="dashed" icon={<EditOutlined />} size='small' />
                </Tooltip>
            </Link>

            <DeleteTour tour={record} setTours={setTours} />

            <Link to={`/tours/${record.id}/expenses`}>
                <Tooltip title="Show expenses">
                    <Button type="dashed" icon={<EuroOutlined />} size='small' />
                </Tooltip>
            </Link> */}
        </Space>
    )
}]

export default ExpensesTable;