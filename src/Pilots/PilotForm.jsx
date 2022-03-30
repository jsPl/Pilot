import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
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

const validateMessages = {
  required: "'${name}' is required!",
  types: {
    email: "'${name}' is not a valid email!",
    number: "'${name}' is not a valid number!",
  },
};

const PilotForm = ({ setIsModalVisible }) => {
  const { pilotId } = useParams();
  const [setPilots] = useOutletContext();
  const [form] = Form.useForm();
  let navigate = useNavigate();

  useEffect(() => {
    console.log(pilotId);
    pilotId && fetchPilot(pilotId);
  }, [])

  console.log('PilotForm params from url', pilotId)

  const addPilot = (pilotData) => {
    console.log(pilotData, "pilotData")
    const url = pilotId ? `http://localhost:3004/pilots/${pilotId}` : 'http://localhost:3004/pilots';
    const method = pilotId ? 'PATCH' : 'POST';

    fetch(url, {
      method,
      body: JSON.stringify(pilotData),
      headers: {
        "Content-Type": "application/json"
      }
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
        navigate('/pilots');
      })
      .catch(error => {
        console.log(error)
      })
  }

  const fetchPilot = (id) => {
    fetch(`http://localhost:3004/pilots/${id}`)
      .then(r => r.json())
      .then(data => {
        console.log(data)
        form.setFieldsValue({ pilot: data });
      })
      .catch(error => console.log(error))
  }

  const onFinish = (values) => {
    const { pilot } = values;
    if (!pilotId) {
      pilot.picture = generateRandomFaceUrl();
    }
    console.log('onFinish', pilot)
    addPilot(pilot);
  };

  return (
    <Form {...layout} form={form} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
      <Form.Item
        name={['pilot', 'name']}
        label="Name Surname"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={['pilot', 'email']}
        label="Email"
        rules={[
          {
            required: true,
            type: 'email',
          },
        ]}
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
  );
};

export default PilotForm;