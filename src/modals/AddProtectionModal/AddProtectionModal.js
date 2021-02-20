import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, Space, Button } from "antd";
import { useTranslation } from 'react-i18next';

import { generateLink } from "utils/generateLink";
import config from "config";
import { useSelector } from "react-redux";
import { QRButton } from "components/QRButton/QRButton";

export const AddProtectionModal = ({
  visible,
  setVisible,
  activeWallet,
  deposit = {},
}) => {
  const { params, deposit_aa, reserve_asset_symbol } = useSelector((state) => state.active);
  const [amount, setAmount] = useState({
    value: undefined,
    valid: undefined,
  });
  const amountInputRef = useRef(null);
  const addBtnRef = useRef(null);
  const { t } = useTranslation();

  const { id, amount: currentAmount, protection } = deposit;
  const { reserve_asset, reserve_asset_decimals, decimals2 } = params;

  const handleChangeAmount = (ev) => {
    const value = ev.target.value;
    const reg = /^[0-9.]+$/;

    if (value === "" || value === "0" || Number(value) === 0) {
      setAmount({ value, valid: undefined });
    } else {
      if (
        (~(value + "").indexOf(".") ? (value + "").split(".")[1].length : 0) <=
        reserve_asset_decimals
      ) {
        if (reg.test(String(value))) {
          setAmount({ value, valid: true });
        } else {
          setAmount({ value, valid: false });
        }
      }
    }
  };

  useEffect(() => {
    if (amountInputRef.current) {
      setAmount({ value: undefined, valid: false });
      amountInputRef.current.focus();
    }
  }, [visible]);

  const totalProtectionRatio = (((protection || 0) / 10 ** reserve_asset_decimals + (amount.valid ? Number(amount.value) : 0))) / (currentAmount / 10 ** decimals2);
  
  return (
    <Modal
      visible={visible}
      title={t("modals.add_protection.title", "Add protection to deposit")}
      onCancel={setVisible}
      style={{ zIndex: -1 }}
      footer={
        <Space>
          <QRButton
            type="primary"
            disabled={!amount.valid}
            ref={addBtnRef}
            onClick={() =>
              setTimeout(() => {
                setVisible();
              }, 100)
            }
            href={generateLink(
              amount.value * 10 ** reserve_asset_decimals,
              { add_protection: 1, id },
              activeWallet,
              deposit_aa,
              reserve_asset,
              true
            )}
          >
            {t("modals.add_protection.btn", "Add protection")}
          </QRButton>
          <Button type="default" onClick={setVisible}>
            {t("modals.common.close", "Close")}
          </Button>
        </Space>
      }
    >
      <Form size="large">
        <Form.Item>
          <Input
            placeholder={t("modals.common.amount", "Amount")}
            onChange={handleChangeAmount}
            value={amount.value}
            ref={amountInputRef}
            suffix={
              reserve_asset in config.reserves
                ? config.reserves[reserve_asset].name
                : reserve_asset_symbol || "reserve token"
            }
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                if (amount.valid) {
                  addBtnRef.current.click();
                }
              }
            }}
            autoFocus={true}
          />
        </Form.Item>
      </Form>
      <div>
        <b>{t("modals.add_protection.ratio", "Protection ratio")}:</b> {+Number(totalProtectionRatio).toPrecision(3)}
      </div>
    </Modal>
  );
};
