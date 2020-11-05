import React from "react";
import { Modal, Typography } from "antd"
import config from "config";

const {Text} = Typography;

export const OracleInfoModal = ({ address, onCancel}) =>{
  const {name, description} = config.oracleInfo[address] || {};
  return <Modal footer={null} visible={!!address} onCancel={onCancel} title="Oracle info" onOk={undefined}>
    {name ? <Text>
      <div><b>Address: </b>{address}</div>
      <div><b>Name: </b>{name}</div>
      <div><b>Description: </b>{description || "no description"}</div>
    </Text> : <Text type="secondary">No information about this oracle</Text>}
  </Modal>
}