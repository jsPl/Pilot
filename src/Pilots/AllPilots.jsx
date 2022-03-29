import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { Table, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import PilotModal from "./PilotModal";
import DeletePilot from './DeletePilot';
import '../style/generic.scss';

const AllPilots = () => {
    let navigate = useNavigate();
    const [pilots, setPilots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true)
        fetch("http://localhost:3004/pilots")
            .then(r => r.json())
            .then(data => setPilots(data))
            .finally(() => setIsLoading(false));
    }, [])

    const columns = [{
        title: 'Name Surname',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: text => <a href={`mailto:${text}`}>{text}</a>,
    },
    {
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <Link to={`/pilots/${record.id}`}>
                    <Button type="dashed" icon={<EditOutlined />} size='small' />
                </Link>
                <DeletePilot pilot={record} setPilots={setPilots} />
            </Space>
        ),
    },
    ]

    return (
        <div className="container">
            <h1 className="all-pilots-title">Manage pilots group</h1>
            <Table loading={isLoading} rowKey='id' columns={columns} dataSource={pilots} />

            <Link to={`/pilots/new`}>
                <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large'>
                    Add new pilot
                </Button>
            </Link>

            <Outlet context={[setPilots]} />
        </div>
    )
}

export default AllPilots