import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, Skeleton, Statistic, Space, Card, Divider } from 'antd';
import { fetchTour } from '../Tours/TourForm';
import ExpensesTable from '../Expenses/ExpensesTable';
import * as CurrencyApi from '../utils/currencyApi';
import moment from 'moment';

const dateFormat_TourExpense = 'DD.MM.YYYY';

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

    useEffect(() => {
        setIsLoading(true);
        fetchExpensesByCurrency(tour, setExpensesByCurrency, setExpensesByDate)
            .finally(() => setIsLoading(false))
    }, [tour]);

    useEffect(() => {
        fetchCurrencyExchangeRates(tour, expensesByDate, setTotalExpensesInTourCurrency);
    }, [expensesByDate, tour]);

    if (!tour) {
        return <Skeleton active />
    }

    const statsByCurrency = Object.keys(expensesByCurrency)
        .map(currency => {
            return <CurrencyStatistic key={currency} loading={isLoading} currency={currency}
                amount={expensesByCurrency[currency]} />
        })

    return (
        <Space size={'large'}>
            <CurrencyStatistic loading={isLoading} currency={tour.currency}
                amount={totalExpensesInTourCurrency} title="Tour total expenses"
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
        <CurrencyStatistic currency={tour.currency} amount={tour.budget} title="Tour total budget" />
    )
}

const CurrencyStatistic = ({ currency, amount, title, ...rest }) => {
    const value = new Intl.NumberFormat(navigator.language,
        { style: 'currency', currency }).format(amount || 0);

    return (
        <Statistic title={`${title || ''} ${currency}`} value={value} {...rest} />
    )
}

const fetchCurrencyExchangeRates = async (tour, expensesByDate, setTotalExpensesInTourCurrency) => {
    //console.log('expensesByDate', expensesByDate)

    const sumArrayValues = (a, b) => a + b;
    const tourCurrencyExchangeData = await CurrencyApi.fetchCurrencyExchangeRateToPLN(tour.currency);

    const result = Object.keys(expensesByDate).map(async date => {
        const dateInApiFormat = moment(date, dateFormat_TourExpense).format(CurrencyApi.dateFormat_CurrencyApi);

        const expensesInTourCurrency = Object.keys(expensesByDate[date]).map(async currency => {
            const expenseCurrencyExchangeData = await CurrencyApi.fetchCurrencyExchangeRateToPLN(currency, dateInApiFormat);
            const amount = expensesByDate[date][currency];
            const amountInTourCurrency = CurrencyApi.convert(amount, expenseCurrencyExchangeData, tourCurrencyExchangeData);

            return amountInTourCurrency;
        })

        //console.log('expensesInTourCurrency', expensesInTourCurrency)

        return Promise.all(expensesInTourCurrency).then(amounts => amounts.reduce(sumArrayValues, 0));
    })
    //console.log('result', result)

    Promise.all(result).then(amounts => setTotalExpensesInTourCurrency(amounts.reduce(sumArrayValues, 0)));
}

const fetchExpensesByCurrency = async (tour, setExpensesByCurrency, setExpensesByDate) =>
    fetch(`http://localhost:3004/tour/${tour.id}/expenses`)
        .then(r => r.json())
        .then(expenses => {
            setExpensesByDate(CurrencyApi.groupExpensesByDate(expenses));
            setExpensesByCurrency(CurrencyApi.groupExpensesByCurrency(expenses));
        })


export default TourExpenses;