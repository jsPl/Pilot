import React from 'react';
import { GenericModal } from '../GenericModal';
import { useNavigate } from "react-router-dom";
import PilotForm from './PilotForm';

const PilotModal = ({ title }) => {
    const navigate = useNavigate();

    const handleAfterClose = () => {
        navigate(`/pilots`)
    }

    return (
        <GenericModal modalTitle={title} onAfterModalClose={handleAfterClose}>
            {setIsModalVisible => (
                <PilotForm setIsModalVisible={setIsModalVisible} />
            )}
        </GenericModal>
    )
}

export default PilotModal;
