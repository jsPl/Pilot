import React from 'react';
import { Select } from 'antd';
import { currencies } from '../utils/currencies';
import { distinctCurrencies } from '../utils/currencyApi';

const Expenses = () => (
    <h1>Expenses</h1>
)

export const SelectCurrency = ({ handleChange, ...rest }) => {
    return (
        <Select
            showSearch
            placeholder="Select currency"
            optionFilterProp="children"
            onChange={handleChange}
            filterOption={true}
            style={{ minWidth: '70px' }}
            {...rest}
        >
            {currencies && distinctCurrencies(currencies.map(o => o.currency_code))
                .sort()
                .map(curr => <Select.Option key={`curr_${curr}`} value={curr}>{curr}</Select.Option>)
            }
        </Select>
    )
}

export default Expenses;