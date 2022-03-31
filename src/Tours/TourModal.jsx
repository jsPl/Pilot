import React, { useState } from 'react';
import { Modal } from 'antd';
import TourForm from './TourForm';

const TourModal = ({ setTours, modalTitle, modalDefaultVisible = false, actionButton, onModalClose }) => {
    const [isModalVisible, setIsModalVisible] = useState(modalDefaultVisible);
    const showModal = () => setIsModalVisible(true);
    const handleOk = () => setIsModalVisible(false);
    const handleCancel = () => {
        setIsModalVisible(false);
        onModalClose && onModalClose();
    }

    return (
        <>
            {actionButton && actionButton(showModal)}
            <Modal forceRender title={modalTitle} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
                <TourForm setIsModalVisible={setIsModalVisible} />
            </Modal>
        </>
    )
}

export default TourModal;
