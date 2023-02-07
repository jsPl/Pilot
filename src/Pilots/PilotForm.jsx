import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

const generateRandomFaceUrl = () => `https://boredhumans.b-cdn.net/faces2/${Math.floor(Math.random() * (994 - 1)) + 1}.jpg`;

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 16,
    },
}

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: "'${label}' is required!",
    types: {
        email: "'${label}' is not a valid email!",
        number: "'${label}' is not a valid number!",
    },
}

export const fetchPilot = (id) =>
    fetch(`http://localhost:3004/pilots/${id}`)
        .then(r => r.json())
        .catch(error => console.log(error))

const PilotForm = ({ setIsModalVisible }) => {
    const { pilotId } = useParams();
    const [setPilots] = useOutletContext();
    const [form] = Form.useForm();
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (pilotId) {
            setIsLoading(true);
            fetchPilot(pilotId)
                .then(data => form.setFieldsValue({ pilot: data }))
                .finally(() => setIsLoading(false))
        }
    }, [pilotId, form])

    const addPilot = (pilotData) => {
        console.log(pilotData, "pilotData")
        const url = pilotId ? `http://localhost:3004/pilots/${pilotId}` : 'http://localhost:3004/pilots';
        const method = pilotId ? 'PATCH' : 'POST';

        setIsLoading(true);

        fetch(url, {
            method,
            body: JSON.stringify(pilotData),
            headers: { "Content-Type": "application/json" }
        })
            .then(r => r.json())
            .then(data => {
                setIsModalVisible(false);

                if (pilotId) {
                    setPilots(prev => prev.map(o => o.id === Number(pilotId) ? data : o));
                }
                else {
                    setPilots(prev => [...prev, data])
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    const onFinish = (values) => {
        const { pilot } = values;
        if (!pilotId) {
            pilot.picture = generateRandomFaceUrl();
        }
        addPilot(pilot);
    };

    return (
        <Spin spinning={isLoading}>
            <Form {...layout} form={form} name="pilot-form" onFinish={onFinish} validateMessages={validateMessages}>
                <Form.Item
                    name={['pilot', 'name']}
                    label="Name Surname"
                    rules={[{ required: true }]}
                >
                    <Input autoFocus={!!!pilotId} />
                </Form.Item>

                <Form.Item
                    name={['pilot', 'email']}
                    label="Email"
                    rules={[{ required: true, type: 'email' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name={['pilot', 'comment']} label="Comment">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                    <Button type="primary" htmlType="submit">
                        {pilotId ? 'Save changes' : 'Submit'}
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    );
}

export default PilotForm;