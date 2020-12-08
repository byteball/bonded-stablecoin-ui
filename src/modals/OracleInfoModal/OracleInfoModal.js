import React from "react";
import { Modal, Typography } from "antd";
import { useTranslation } from 'react-i18next';
import config from "config";

const {Text} = Typography;

export const OracleInfoModal = ({ address, onCancel}) => {
  const {name, description} = config.oracleInfo[address] || {};
  const { t } = useTranslation();
  return <Modal footer={null} visible={!!address} onCancel={onCancel} title={t("modals.oracle_info.title", "Oracle info")} onOk={undefined}>
    {name ? <Text>
      <div><b>{t("modals.oracle_info.address", "Address")}: </b>{address}</div>
      <div><b>{t("modals.oracle_info.name", "Name")}: </b>{name}</div>
      <div><b>{t("modals.oracle_info.desc", "Description")}: </b>{description || t("modals.oracle_info.no_desc", "no description")}</div>
    </Text> : <Text type="secondary">{t("modals.oracle_info.no_info", "No information about this oracle")}</Text>}
  </Modal>
}