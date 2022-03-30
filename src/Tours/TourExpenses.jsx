import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import { PageHeader, Button, Tooltip } from 'antd';
import { EuroOutlined } from '@ant-design/icons';


const TourExpenses = () => {
    const {tourId} = useParams();
    return (
        <div className="site-page-header-ghost-wrapper">
            <PageHeader

                ghost={false}
                onBack={() => window.history.back()}
                title="Tour numnber + Tour title"
                subTitle="This is a subtitle"
            >
                Expenses
            </PageHeader>
        </div>

    )
}

export default TourExpenses;