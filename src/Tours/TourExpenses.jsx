import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, Skeleton, Statistic, Space, Card, Divider } from 'antd';
import { fetchTour } from '../Tours/TourForm';
import ExpensesTable from '../Expenses/ExpensesTable';
import { SelectCurrency } from '../Expenses/Expenses';
import * as CurrencyApi from '../utils/currencyApi';

const TourExpenses = () => {
    const { tourId } = useParams();
    const [tour, setTour] = useState(null);

    useEffect(() => {
        tourId && fetchTour(tourId).then(data => setTour(data));
    }, [tourId]);

    if (!tour) {
        return <div className="container"><Skeleton active /></div>
    }

    return (
        <div className="container">
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={`${tour.tourCode || ''}: ${tour.title || ''}`}
                subTitle={`${tour.pilot}, ${tour.dateRangeAsString || ''}, ${tour.country}`}
            >
                <Card className='tourBudgetStats'>
                    <Space direction='vertical'>
                        <TourBudget tour={tour} />
                        <ExpensesSummary tour={tour} />
                    </Space>
                </Card>

                <ExpensesTable />
            </PageHeader>
        </div>
    )
}

const ExpensesSummary = ({ tour }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [expensesByCurrency, setExpensesByCurrency] = useState({});
    const [expensesByDate, setExpensesByDate] = useState({});
    const [totalExpensesInTourCurrency, setTotalExpensesInTourCurrency] = useState(0);
    const [totalExpensesCurrency, setTotalExpensesCurrency] = useState(tour.currency);

    useEffect(() => {
        setIsLoading(true);
        fetchTourExpenses(tour.id)
            .then(expenses => {
                setExpensesByDate(CurrencyApi.groupExpensesByDate(expenses));
                setExpensesByCurrency(CurrencyApi.groupExpensesByCurrency(expenses));
            })
            .finally(() => setIsLoading(false))
    }, [tour.id]);

    useEffect(() => {
        setIsLoading(true);
        CurrencyApi.fetchCurrencyExchangeRates(totalExpensesCurrency, expensesByDate)
            .then(amount => setTotalExpensesInTourCurrency(amount))
            .finally(() => setIsLoading(false))
    }, [expensesByDate, totalExpensesCurrency]);

    if (!tour) {
        return <Skeleton active />
    }

    const statsByCurrency = Object.keys(expensesByCurrency)
        .map(currency => {
            return <CurrencyStatistic key={currency} loading={isLoading} currency={currency}
                amount={expensesByCurrency[currency]} />
        })

    const statsTitle =
        <Space>
            <span>Tour total expenses</span>
            <SelectCurrency onChange={setTotalExpensesCurrency} defaultValue={tour.currency} size='small' />
        </Space>

    return (
        <Space size={'large'}>
            <CurrencyStatistic loading={isLoading} currency={totalExpensesCurrency}
                amount={totalExpensesInTourCurrency} title={statsTitle}
                valueStyle={{ color: tour.budget > totalExpensesInTourCurrency ? '#3f8600' : '#cf1322' }} />

            {statsByCurrency.length > 0 && <Divider plain>including</Divider>}

            {statsByCurrency}
        </Space>
    )
}

const TourBudget = ({ tour }) => {
    if (!tour) {
        return null;
    }

    return (
        <CurrencyStatistic currency={tour.currency} amount={tour.budget} title={`Tour total budget ${tour.currency}`} />
    )
}

const CurrencyStatistic = ({ currency, amount, ...rest }) => {
    const value = new Intl.NumberFormat(navigator.language,
        { style: 'currency', currency }).format(amount || 0);

    return (
        <Statistic title={`${currency}`} value={value} {...rest} />
    )
}

export const fetchTourExpenses = async (tourId) =>
    fetch(`http://localhost:3004/tour/${tourId}/expenses`)
        .then(r => r.json())

export default TourExpenses;