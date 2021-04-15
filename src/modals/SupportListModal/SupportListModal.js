import React from "react";
import { Modal, List, Button } from "antd";
import { useTranslation } from 'react-i18next';

export const SupportListModal = ({ decimals, symbol, supportList, activeSupportValue, onCancel, fund_aa }) => {
  const { t } = useTranslation();
  return (
    <Modal
      visible={activeSupportValue}
      title={t("modals.supportList.title", "Supporters")}
      footer={<Button type="primary" onClick={onCancel}>{t("modals.common.close", "Close")}</Button>}
      onCancel={onCancel}>
      <List
        dataSource={supportList.sort((a, b) => b.support - a.support)}
        renderItem={(item) => (<List.Item.Meta
          style={{ marginBottom: 10 }}
          title={item.address}
          description={<>{item.support / 10 ** decimals} {symbol || (fund_aa ? "T_SF" : "T1")}</>} />)}
      />
    </Modal>
  )
}