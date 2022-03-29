import React from 'react';
import { PageHeader, Button, Descriptions } from 'antd';

const TourExpenses = () => {

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