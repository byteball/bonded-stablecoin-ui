import React from "react";
import { Modal, Space, Button } from "antd";
import { useTranslation } from 'react-i18next';

import { SelectWallet } from "components/SelectWallet/SelectWallet";

export const SelectWalletModal = ({ visible, onCancel }) => {
  const { t } = useTranslation();
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title={t("modals.select_wallet.title", "Select wallet")}
      footer={
        <Space>
          <Button key="Cancel" onClick={onCancel}>
            {t("modals.common.done", "Done")}
          </Button>
        </Space>
      }
    >
      <SelectWallet width="100%" size="large" />
    </Modal>
  );
};
