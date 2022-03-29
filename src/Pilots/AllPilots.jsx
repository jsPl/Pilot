import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Table, Space, Button, Tooltip } from 'antd';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
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
            .finally(() => setIsLoading(false))
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
                <PilotModal setPilots={setPilots} modalTitle='Edit pilot'
                    onModalClose={() => navigate('/pilots')}
                    actionButton={showModal => (
                        <Link to={`/pilots/${record.id}`}>
                            <Tooltip title="Edit pilot">
                                <Button type="dashed" icon={<EditOutlined />} size='small' onClick={showModal} />
                            </Tooltip>
                        </Link>
                    )}
                />
                <DeletePilot pilot={record} setPilots={setPilots} />
            </Space>
        ),
    },
    ]

    return (
        <div className="container">
            <h1 className="all-pilots-title">Manage pilots group</h1>
            <Table rowKey='id' columns={columns} dataSource={pilots} loading={isLoading} />

            <PilotModal setPilots={setPilots} modalTitle='Add new pilot' actionButton={showModal => (
                <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={showModal}>
                    Add new pilot
                </Button>)}
            />
        </div>
    )
}

export default AllPilots