import React from "react";
import { Modal, List, Button } from "antd";

export const SupportListModal = ({ decimals, symbol, supportList, activeSupportValue, onCancel }) => {
  return (
    <Modal
      visible={activeSupportValue}
      title="Supporters"
      footer={<Button type="primary" onClick={onCancel}>Cancel</Button>}
      onCancel={onCancel}>
      <List
        dataSource={supportList.sort((a, b) => b.support - a.support)}
        renderItem={(item) => (<List.Item.Meta
          style={{ marginBottom: 10 }}
          title={item.address}
          description={<>{item.support / 10 ** decimals} {symbol || "T1"}</>} />)}
      />
    </Modal>
  )
}