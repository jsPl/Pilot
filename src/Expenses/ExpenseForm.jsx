import React, {useState, useEffect} from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { Form, Input, Button, Select, DatePicker, InputNumber, Spin } from 'antd';
import { currencies } from '../utils/currencies';
import moment from 'moment';

const dateFormat_Tour = 'DD.MM.YYYY';
const distinctCurrencies = (arr) => [...new Set(arr)];

const { Option } = Select;

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

const validateMessages = {
    required: "'${name}' is required!",
    types: {
        number: "'${name}' is not a valid number!",
    },
};
export const fetchTour = (id) =>
    fetch(`http://localhost:3004/tours/${id}`)
        .then(r => r.json())
        .then(data => {
            data.dateRangeAsString = data?.dateRange.join(' - ');
            data.dateRange = data.dateRange?.map(o => moment(o, dateFormat_Tour))
            return data;
        })
        .catch(error => console.log(error))

const ExpenseForm = ({ setIsModalVisible }) => {
    let navigate = useNavigate();
    const [setExpenses] = useOutletContext();
    const { tourId, expenseId } = useParams();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (expenseId) {
            setIsLoading(true);
            // fetchTour(tourId)
            //     .then(data => form.setFieldsValue(data.expenses))
            fetch(`http://localhost:3004/expenses/${expenseId}`)
                .then(r => r.json())
                .then(expense => {
                    expense.date = moment(expense.date, dateFormat_Tour);
                    form.setFieldsValue({expense})
                })
                .finally(() => setIsLoading(false))

        }
    }, []);

    // useEffect(() => {
    //     fetch(`http://localhost:3004/tour/${tourId}/expenses`)
    //         .then(r => r.json())
    //         .then(data => setExpenses(data))
    // }, []);

    const addExpense = (expenseData) => {
        console.log(expenseData, "expenseData")
        const url = expenseId ? `http://localhost:3004/expenses/${expenseId}` : `http://localhost:3004/tours/${tourId}/expenses`;
        const method = expenseId ? 'PATCH' : 'POST';

        fetch(url, {
            method,
            body: JSON.stringify(expenseData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(r => r.json())
            .then(data => {
                setIsModalVisible(false);
                if (expenseId) {
                    setExpenses(prev => prev.map(o => o.id === Number(expenseId) ? data : o));
                } else {
                    setExpenses(prev => [...prev, data])
                }
                navigate(`/tours/${tourId}/expenses`)
            })
            .catch(error => {
                console.log(error)
            })
    }


    const onFinish = (values) => {
        const { expense } = values;
        console.log('onFinish', expense);
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
                <Form.Item
                    name={['expense', 'title']}
                    label="Title"
                    rules={[{ required: true }]}
                >
                    <Input />
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