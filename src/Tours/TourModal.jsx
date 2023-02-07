import React from 'react';
import { GenericModal } from '../GenericModal';
import { useNavigate } from "react-router-dom";
import TourForm from './TourForm';

const TourModal = ({ title }) => {
    const navigate = useNavigate();

    const handleAfterClose = () => {
        navigate(`/tours`)
    }

    return (
        <GenericModal modalTitle={title} onAfterModalClose={handleAfterClose}>
            {setIsModalVisible => (
                <TourForm setIsModalVisible={setIsModalVisible} />
            )}
        </GenericModal>
    )
}

export default TourModal;
