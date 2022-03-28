import React, { useState } from 'react';
import { Modal } from 'antd';
import PilotForm from './PilotForm';

const PilotModal = ({ setPilots, modalTitle, modalDefaultVisible = false, actionButton, onModalClose }) => {
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
            <Modal title={modalTitle} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
                <PilotForm setIsModalVisible={setIsModalVisible} setPilots={setPilots} />
            </Modal>
        </>
    )
}

export default PilotModal;
