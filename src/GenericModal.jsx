import React, { useState } from 'react';
import { Modal } from 'antd';

export function GenericModal({ modalTitle, onAfterModalClose = () => { }, children }) {
    const [isModalVisible, setIsModalVisible] = useState(true);
    
    const handleCancel = () => {
        setIsModalVisible(false);
    }
    const handleAfterClose = () => {
        onAfterModalClose();
    }

    return (
        (<Modal title={modalTitle} open={isModalVisible} afterClose={handleAfterClose}
            onCancel={handleCancel} footer={null}>
            {children(setIsModalVisible)}
        </Modal>)
    );
}
