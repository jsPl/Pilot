import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Table, Space, Button, Tooltip } from 'antd';
import { EditOutlined, PlusCircleOutlined, EuroOutlined } from '@ant-design/icons';
import TourModal from "./TourModal";
import DeleteTour from './DeleteTour';
import TourExpenses from './TourExpenses';
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
    }, []
    );


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

                <TourModal setTours={setTours} modalTitle='Edit tour'
                    onModalClose={() => navigate('/tours')}
                    actionButton={showModal => (
                        <Link to={`/tours/${record.id}`}>
                            <Tooltip title="Edit tour">
                                <Button type="dashed" icon={<EditOutlined />} size='small' onClick={showModal} />
                            </Tooltip>
                        </Link>
                    )}
                />

                <DeleteTour tour={record} setTours={setTours} />

                <Link to={`/tours/${record.id}/expenses`}>
                    <Tooltip title="Show expenses">
                        <Button type="dashed" icon={<EuroOutlined />} size='small' />
                    </Tooltip>
                </Link>
                {/* <TourExpenses/> */}

            </Space>
        ),
    },
    ]

    return (
        <div className="container">
            <h1 className="all-pilots-title">Manage tours</h1>
            <Table rowKey='id' columns={columns} dataSource={tours} loading={isLoading} />

            <TourModal setTours={setTours} modalTitle='Add new tour' actionButton={showModal => (
                <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={showModal}>
                    Add new tour
                </Button>)}
            />
        </div>
    )
}

export default AllTours;