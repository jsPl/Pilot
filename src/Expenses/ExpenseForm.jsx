import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { Form, Input, Button, DatePicker, InputNumber, Spin } from 'antd';
import { SelectCurrency } from './Expenses';
import dayjs from 'dayjs';

const dateFormat_Tour = 'DD.MM.YYYY';

const onChange = value => console.log(`selected ${value}`);
const onSearch = value => console.log('search:', value);
const onValueChange = value => console.log('changed', value);

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
        number: "'${label}' is not a valid number!",
    },
};

export const fetchExpense = (id) =>
    fetch(`http://localhost:3004/expenses/${id}`)
        .then(r => r.json())
        .then(expense => {
            expense.date = dayjs(expense.date, dateFormat_Tour);
            return expense;
        })

const ExpenseForm = ({ setIsModalVisible }) => {
    let navigate = useNavigate();
    const [expenses, setExpenses] = useOutletContext();
    const { tourId, expenseId } = useParams();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (expenseId) {
            setIsLoading(true);
            fetchExpense(expenseId)
                .then(expense => {
                    form.setFieldsValue({ expense })
                })
                .finally(() => setIsLoading(false))
        }
    }, [expenseId, form]);

    const addExpense = (expenseData) => {
        console.log(expenseData, "expenseData")
        const url = expenseId ? `http://localhost:3004/expenses/${expenseId}` : `http://localhost:3004/tours/${tourId}/expenses`;
        const method = expenseId ? 'PATCH' : 'POST';

        setIsLoading(true);

        fetch(url, {
            method,
            body: JSON.stringify(expenseData),
            headers: { "Content-Type": "application/json" }
        })
            .then(r => r.json())
            .then(data => {
                setIsModalVisible(false);
                if (expenseId) {
                    setExpenses(prev => prev.map(o => o.id === Number(expenseId) ? data : o));
                } else {
                    setExpenses(prev => [...prev, data])
                }
                //navigate(`/tours/${tourId}/expenses`)
            })
            .catch(error => console.log(error))
    }

    const onFinish = (values) => {
        const { expense } = values;

        if (expense.date) {
            expense.date = expense.date.format(dateFormat_Tour);
        } else {
            delete expense.date;
        }
        addExpense(expense);
    };

    return (
        <Spin spinning={isLoading}>
            <Form {...layout} form={form} name="expense-form" onFinish={onFinish} validateMessages={validateMessages}>
                <Form.Item name={['expense', 'title']} label="Title" rules={[{ required: true }]}>
                    <Input autoFocus={!!!expenseId} />
                </Form.Item>

                <Form.Item name={['expense', 'date']} label="Date" >
                    <DatePicker format={dateFormat_Tour} onChange={onChange} />
                </Form.Item>

                <Form.Item name={['expense', 'price']} label="Value" rules={[{ required: true }]}>
                    <InputNumber min={1} onChange={onValueChange} />
                </Form.Item>

                <Form.Item
                    name={['expense', 'currency']} label="Currency" rules={[{ required: true }]}
                >
                    <SelectCurrency onChange={onChange} onSearch={onSearch} />
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                    <Button type="primary" htmlType="submit">
                        {tourId ? 'Save changes' : 'Submit'}
                    </Button>
                </Form.Item>
            </Form >
        </Spin>
    );
};

export default ExpenseForm;