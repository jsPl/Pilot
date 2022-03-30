import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber } from 'antd';
import { useParams, useNavigate } from "react-router-dom";
import { currencies } from '../utils/currencies';
import moment from 'moment';

const { RangePicker } = DatePicker;
const dateFormat_Tour = 'DD.MM.YYYY';
const distinctCurrencies = (arr) => [...new Set(arr)];

const { Option } = Select;

const onChange = value => console.log(`selected ${value}`);
const onSearch = value=> console.log('search:', value);
const onBudgetChange = value => console.log('changed', value);

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

const TourForm = ({ setIsModalVisible, setTours }) => {
    let navigate = useNavigate();
    const { tourId } = useParams();
    const [form] = Form.useForm();
    const [pilots, setPilots] = useState([]);

    useEffect(() => {
        console.log(tourId);
        tourId && fetchTour(tourId);
    }, []);

    console.log('TourForm params from url', tourId);

    useEffect(() => {
        fetch("http://localhost:3004/pilots")
            .then(r => r.json())
            .then(data => setPilots(data))
    }, []
    );

    const addTour = (tourData) => {
        console.log(tourData, "tourData")
        const url = tourId ? `http://localhost:3004/tours/${tourId}` : 'http://localhost:3004/tours';
        const method = tourId ? 'PATCH' : 'POST';

        fetch(url, {
            method,
            body: JSON.stringify(tourData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(r => r.json())
            .then(data => {
                setIsModalVisible(false);
                if (tourId) {
                    setTours(prev => prev.map(o => o.id === Number(tourId) ? data : o));
                } else {
                    setTours(prev => [...prev, data])
                }
                navigate('/tours')
            })
            .catch(error => {
                console.log(error)
            })
    }

    const fetchTour = (id) => {
        fetch(`http://localhost:3004/tours/${id}`)
            .then(r => r.json())
            .then(data => {
                data.dateRange = data.dateRange?.map(o => moment(o, dateFormat_Tour))
                console.log(data)
                form.setFieldsValue({ tour: data });
            })
            .catch(error => console.log(error))
    }

    const onFinish = (values) => {
        const { tour } = values;
        if (tour.dateRange) {
            tour.dateRange = tour.dateRange.map(o => o.format(dateFormat_Tour))
        } else {
            delete tour.dateRange;
        }
        console.log('onFinish', tour)
        addTour(tour);
    };

    return (
        <Form {...layout} form={form} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
            <Form.Item
                name={['tour', 'tourCode']}
                label="Tour code"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name={['tour', 'title']}
                label="Title"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item name={['tour', 'dateRange']} label="Date range" >
                <RangePicker format={dateFormat_Tour} />
            </Form.Item>

            <Form.Item
                name={['tour', 'country']} label="Country" rules={[{ required: true }]}
            >
                <Select
                    showSearch
                    placeholder="Select country"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={true}
                >
                    {currencies && currencies.map(curr => <Option key={`country_${curr.country}`} value={curr.country}>{curr.country}</Option>)}
                </Select>
            </Form.Item>


            <Form.Item
                name={['tour', 'currency']} label="Currency" rules={[{ required: true }]}
            >
                <Select
                    showSearch
                    placeholder="Select currency"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={true}
                >
                    {currencies && distinctCurrencies(currencies.map(o => o.currency_code))
                        .sort()
                        .map(curr => <Option key={`curr_${curr}`} value={curr}>{curr}</Option>)
                    }
                </Select>
            </Form.Item>

            <Form.Item
                name={['tour', 'pilot']}
                label="Pilot"
                rules={[{ required: true }]}
            >
                <Select
                    showSearch
                    placeholder="Select Pilot"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={true}
                >
                    {pilots && pilots.map(pilot => <Option key={`pilot_${pilot.name}`} value={pilot.name}>{pilot.name}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item name={['tour', 'budget']} label="Initial budget" rules={[{ required: true }]}>
                <InputNumber min={1} onChange={onBudgetChange} />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                <Button type="primary" htmlType="submit">
                    {tourId ? 'Save changes' : 'Submit'}
                </Button>
            </Form.Item>
        </Form >
    );
};

export default TourForm;