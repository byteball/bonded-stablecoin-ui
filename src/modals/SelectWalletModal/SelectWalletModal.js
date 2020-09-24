import React from "react";
import { Modal, Space, Button } from "antd";

import { SelectWallet } from "components/SelectWallet/SelectWallet";

export const SelectWalletModal = ({ visible, onCancel }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Select wallet"
      footer={
        <Space>
          <Button key="Cancel" onClick={onCancel}>
            Done
          </Button>
        </Space>
      }
    >
      <SelectWallet width="100%" size="large" />
    </Modal>
  );
};
