import { Modal, Typography } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AddTokensToCarburetor } from "./AddTokensToCarburetor";
import { CreateCarburetor } from "./CreateCarburetor";
import { Trans, useTranslation } from "react-i18next";
const { Title, Text } = Typography;

export const RedeemBothModal = ({ visible, onCancel }) => {

  const { activeWallet } = useSelector((state) => state.settings);
  const { address: carburetorAddress } = useSelector((state) => state.carburetor);
  const { symbol1, symbol2 } = useSelector((state) => state.active);
  const [pending, setPending] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    let getCarburetor;
    if (pending) {
      getCarburetor = setInterval(() => {
        if (carburetorAddress) {
          clearInterval(getCarburetor);
          setPending(false);
        }
      }, 10 * 1000)
    }

    return () => {
      getCarburetor && clearInterval(getCarburetor);
    }
  }, [pending]);

  useEffect(() => {
    setPending(false);
  }, [activeWallet]);

  return (
    <Modal
      title={<b>{t("modals.redeem-both.modal_title", "Simultaneously redeem")}<sup>Beta</sup></b>}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      size="large"
      width="800px"
    >
      <Text type="secondary">
        <Trans i18nKey="modals.redeem-both.desc" symbol1={symbol1 || "T1"} symbol2={symbol2 || "T2"}>
          To <b>simultaneously</b> redeem {{ symbol1: symbol1 || "T1" }} and {{ symbol2: symbol2 || "T2" }}, you need to
          <ul>
            <li>create an intermediary Autonomous Agent</li>
            <li>send {{ symbol1: symbol1 || "T1" }} and {{ symbol2: symbol2 || "T2" }} to the intermediary AA in two separate transactions.</li>
          </ul>
          <p>
            Once the AA has received both tokens, it will automatically redeem them in such a proportion that the fee is 0. Then, you'll be able to withdraw the excess amount of the token ({symbol1 || "T1"} or {symbol2 || "T2"}) that was not fully redeemed.
          </p>
        </Trans>
      </Text>

      {carburetorAddress ?
        <div>
          <Title level={4}>{t("modals.redeem-both.add_title", "Add tokens")}</Title>
          <AddTokensToCarburetor />
        </div> : <CreateCarburetor pending={pending} setPending={setPending} />}

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <a href="https://github.com/Taump/redeem-both" target="_blank" rel="noopener">{t("modals.redeem-both.github", "Open github page with the AA source code")}</a>
      </div>
    </Modal>
  )
}