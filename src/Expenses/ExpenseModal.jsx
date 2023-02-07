import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import ExpenseForm from './ExpenseForm';
import { GenericModal } from '../GenericModal';

const ExpenseModal = ({ title }) => {
    const { tourId } = useParams();
    const navigate = useNavigate();

    const handleAfterClose = () => {
        navigate(`/tours/${tourId}/expenses`)
    }

    return (
        <GenericModal modalTitle={title} onAfterModalClose={handleAfterClose}>
            {setIsModalVisible => (
                <ExpenseForm setIsModalVisible={setIsModalVisible} />
            )}
        </GenericModal>
    )
}

export default ExpenseModal;
