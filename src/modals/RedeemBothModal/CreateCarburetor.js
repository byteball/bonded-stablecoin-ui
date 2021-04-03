import { InteractionOutlined, LoadingOutlined } from "@ant-design/icons";
import React from "react";
import { Button, Result } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { QRButton } from "components/QRButton/QRButton";
import { generateLink } from "utils/generateLink";
import config from "config";

export const CreateCarburetor = ({ pending, setPending }) => {
  const { activeWallet } = useSelector((state) => state.settings);
  const { t } = useTranslation();

  if (pending) {
    return (
      <Result
        icon={<LoadingOutlined />}
        style={{ paddingBottom: 24 }}
        title={t("modals.redeem-both.create_title", "We are waiting for the transaction to become stable")}
        extra={<Button type="primary" danger onClick={() => setPending(false)}>{t("modals.common.cancel", "Cancel")}</Button>}
      />
    )
  }

  return (
    <Result
      title={t("modals.redeem-both.create_title_action", "Create an intermediary agent")}
      icon={<InteractionOutlined />}
      extra={<div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <QRButton
          href={generateLink(1e4, { create: 1 }, activeWallet, config.CARBURETOR_FACTORY, "base", true)}
          type="primary"
          size="large"
          onClick={() => setPending(true)}
        >
          {t("modals.redeem-both.create_btn", "Create intermediary agent")}
        </QRButton>
        <div style={{ fontSize: 10, textAlign: "center", marginTop: 10 }}>{t("modals.redeem-both.info", "The address from which the request will be sent will be the owner of intermediary agent.")}</div>
      </div>}
    />
  )
}