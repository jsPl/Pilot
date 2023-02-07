import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, Spin } from 'antd';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { currencies } from '../utils/currencies';
import { SelectCurrency } from '../Expenses/Expenses';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const dateFormat_Tour = 'DD.MM.YYYY';

const { Option } = Select;

const onSearch = value => console.log('search:', value);

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
};
export const fetchTour = (id) =>
    fetch(`http://localhost:3004/tours/${id}`)
        .then(r => r.json())
        .then(data => {
            data.dateRangeAsString = data?.dateRange.join(' - ');
            data.dateRange = data.dateRange?.map(o => dayjs(o, dateFormat_Tour))
            return data;
        })
        .catch(error => console.log(error))

const TourForm = ({ setIsModalVisible }) => {
    let navigate = useNavigate();
    const { tourId } = useParams();
    const [setTours] = useOutletContext();
    const [form] = Form.useForm();
    const [pilots, setPilots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (tourId) {
            setIsLoading(true);
            fetchTour(tourId)
                .then(data => form.setFieldsValue(data))
                .finally(() => setIsLoading(false))
        }
    }, [tourId, form]);

    useEffect(() => {
        fetch("http://localhost:3004/pilots")
            .then(r => r.json())
            .then(data => setPilots(data))
    }, []);

    const onChange = value => {
        console.log(`selected ${value}`);
    }

    const addTour = (tourData) => {
        //console.log("tourData", tourData);
        const url = tourId ? `http://localhost:3004/tours/${tourId}` : 'http://localhost:3004/tours';
        const method = tourId ? 'PATCH' : 'POST';

        setIsLoading(true);

        fetch(url, {
            method,
            body: JSON.stringify(tourData),
            headers: { "Content-Type": "application/json" }
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
            .catch(error => console.log(error))
    }

    const onFinish = (tour) => {
        if (tour.dateRange) {
            tour.dateRange = tour.dateRange.map(o => o.format(dateFormat_Tour))
        } else {
            delete tour.dateRange;
        }
        tour.budget = form.getFieldValue('budget');

        //console.log('onFinish', tour)
        addTour(tour);
    };

    return (
        <Spin spinning={isLoading}>
            <Form {...layout} form={form} name="tour-form" onFinish={onFinish} validateMessages={validateMessages}>
                <Form.Item name='tourCode' label="Tour code" rules={[{ required: true }]}>
                    <Input autoFocus={!!!tourId} />
                </Form.Item>

                <Form.Item name='title' label="Title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name='dateRange' label="Date range">
                    <RangePicker format={dateFormat_Tour} />
                </Form.Item>

                <Form.Item name='country' label="Country" rules={[{ required: true }]}>
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

                <Form.Item name='currency' label="Currency" rules={[{ required: true }]}>
                    <SelectCurrency onChange={onChange} onSearch={onSearch} />
                </Form.Item>

                <Form.Item
                    name='pilot'
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

                <Form.Item label="Total budget" rules={[{ required: true }]} dependencies={['currency']}>
                    {({ getFieldValue }) =>
                        <InputNumber value={getFieldValue('budget')} min={1}
                            onChange={budget => form.setFieldsValue({ budget })}
                            addonAfter={getFieldValue('currency')} />
                    }
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                    <Button type="primary" htmlType="submit">
                        {tourId ? 'Save changes' : 'Submit'}
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default TourForm;