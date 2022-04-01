import React from 'react';
import { Select } from 'antd';
import { currencies } from '../utils/currencies';
import { distinctCurrencies } from '../utils/currencyApi';

const Expenses = () => (
    <h1>Expenses</h1>
)

const options = distinctCurrencies(currencies.map(o => o.currency_code))
    .sort().map(o => ({ label: o, value: o }));

export const SelectCurrency = ({ handleChange, ...restProps }) => {
    return (
        <Select
            showSearch
            placeholder="Select currency"
            onChange={handleChange}
            style={{ minWidth: '70px' }}
            options={options}
            {...restProps}
        />
    )
}

export default Expenses;