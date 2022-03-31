import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import { PageHeader, Button, Tooltip, Skeleton , Card, Space, Statistic} from 'antd';
import {fetchTour} from '../Tours/TourForm';
import ExpensesTable from '../Expenses/ExpensesTable';

export const fetchTourExpenses = async (tourId) =>
    fetch(`http://localhost:3004/tour/${tourId}/expenses`)
        .then(r => r.json())


const TourExpenses = () => {
    const {tourId} = useParams();
    const [tour, setTour] = useState(null);

    useEffect(() => {
        tourId && fetchTour(tourId).then(data => setTour(data));
    }, [tourId]);

    if(!tour) {
        return <div className='container'><Skeleton active/></div>
    }

    return (
        <div className="container">
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={`${tour.tourCode || ''} : ${tour.title || ''}`}
                subTitle={`${tour.pilot}, ${tour.dateRangeAsString || ''}, ${tour.country}`}
            >
                <Card className='tourBudgetStatus'>
                    <Space direction='vertical'>
                        <TourBudget tour={tour}/>
                    </Space>
                </Card>
                <ExpensesTable/>
            </PageHeader>
        </div>

    )
}


const TourBudget = ({tour}) => {
    if(!tour){
        return null
    }

    return (<CurrencyStatistic currency={tour.currency} amount={tour.budget} title={`Tour total budget ${tour.currency}`}/>)
}

const CurrencyStatistic = ({currency, amount, ...rest}) => {
    const value = new Intl.NumberFormat(navigator.language, {style: 'currency', currency}).format(amount || 0);
    return (
        <Statistic title={`${currency}`} value ={value} {...rest}/>
    )
}
export default TourExpenses;