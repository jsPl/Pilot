import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { Table, Space, Button, Tooltip } from 'antd';
import { EditOutlined, PlusCircleOutlined, EuroOutlined } from '@ant-design/icons';
import DeleteTour from './DeleteTour';
import '../style/generic.scss';

const AllTours = () => {
    let navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetch("http://localhost:3004/tours")
            .then(r => r.json())
            .then(data => setTours(data))
            .finally(() => setIsLoading(false))
    }, []);

    const columns = [{
        title: 'Tour code',
        dataIndex: 'tourCode',
        key: 'tourCode',
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Date range',
        dataIndex: 'dateRange',
        key: 'dateRange',
        render: text => (<p>{`${text[0]} - ${text[1]}`}</p>)
    },
    {
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
    },
    {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency',
    },
    {
        title: 'Pilot',
        dataIndex: 'pilot',
        key: 'pilot',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <Link to={`/tours/${record.id}`}>
                    <Tooltip title="Edit tour">
                        <Button type="dashed" icon={<EditOutlined />} size='small' />
                    </Tooltip>
                </Link>

                <DeleteTour tour={record} setTours={setTours} />

                <Link to={`/tours/${record.id}/expenses`}>
                    <Tooltip title="Show expenses">
                        <Button type="dashed" icon={<EuroOutlined />} size='small' />
                    </Tooltip>
                </Link>
            </Space>
        )
    },
    ]

    return (
        <div className="container">
            <h1 className="all-pilots-title">Manage tours</h1>
            <Table rowKey='id' columns={columns} dataSource={tours} loading={isLoading} />

            <Link to={`/tours/new`}>
                <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large'>
                    Add new tour
                </Button>
            </Link>

            <Outlet context={[setTours]} />
        </div>
    )
}

export default AllTours;