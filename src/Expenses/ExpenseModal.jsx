import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Modal } from 'antd';
import ExpenseForm from './ExpenseForm';

const ExpenseModal = ({ modalTitle, modalDefaultVisible = true, onModalClose }) => {
    const { tourId } = useParams();
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(modalDefaultVisible);
    const handleOk = () => setIsModalVisible(false);
    const handleCancel = () => {
        setIsModalVisible(false);
        onModalClose && onModalClose();
        navigate(`/tours/${tourId}/expenses`);
    }

    return (
        <Modal title={modalTitle} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
            <ExpenseForm setIsModalVisible={setIsModalVisible} />
        </Modal>
    )
}

export default ExpenseModal;
