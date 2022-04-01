import React, { useState } from 'react';
import { Modal } from 'antd';
import ExpenseForm from './ExpenseForm';

const ExpenseModal = ({ modalTitle, modalDefaultVisible = false, onModalClose }) => {
    const [isModalVisible, setIsModalVisible] = useState(modalDefaultVisible);
    const handleOk = () => setIsModalVisible(false);
    const handleCancel = () => {
        setIsModalVisible(false);
        onModalClose && onModalClose();
    }

    return (
        <Modal title={modalTitle} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
            <ExpenseForm setIsModalVisible={setIsModalVisible} />
        </Modal>
    )
}

export default ExpenseModal;
