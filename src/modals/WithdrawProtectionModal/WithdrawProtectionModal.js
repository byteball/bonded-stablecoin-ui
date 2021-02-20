import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, Space, Button, Typography } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

import { generateLink } from "utils/generateLink";
import config from "config";
import { QRButton } from "components/QRButton/QRButton";

const { Text } = Typography;

export const WithdrawProtectionModal = ({
  visible,
  setVisible,
  activeWallet,
  deposit = {},
}) => {
  const [amount, setAmount] = useState({
    value: undefined,
    valid: undefined,
  });
  const { id, protection, amount: currentAmount } = deposit;
  const { params, deposit_aa, reserve_asset_symbol } = useSelector((state) => state.active);
  const { reserve_asset, reserve_asset_decimals, decimals2 } = params;

  const amountInput = useRef(null);
  const withdrawBtnRef = useRef(null);
  const { t } = useTranslation();

  const totalProtectionRatio = (((protection || 0) / 10 ** reserve_asset_decimals - (amount.valid ? Number(amount.value) : 0))) / (currentAmount / 10 ** decimals2);

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
    if (amountInput.current) {
      setAmount({ value: undefined, valid: false });
      amountInput.current.focus();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      title={t("modals.withdraw_protection.title", "Withdraw protection from deposit")}
      onCancel={setVisible}
      style={{ zIndex: -1 }}
      footer={
        <Space>
          <QRButton
            type="primary"
            ref={withdrawBtnRef}
            onClick={() =>
              setTimeout(() => {
                setVisible();
              }, 100)
            }
            disabled={
              !amount.valid ||
              !protection ||
              amount.value * 10 ** reserve_asset_decimals > protection
            }
            href={generateLink(
              1e4,
              {
                withdraw_protection: 1,
                id,
                amount: amount.value * 10 ** reserve_asset_decimals,
              },
              activeWallet,
              deposit_aa
            )}
          >
            {t("modals.withdraw_protection.withdraw_protection", "Withdraw protection")}
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
            ref={amountInput}
            autoFocus={true}
            suffix={
              reserve_asset in config.reserves
                ? config.reserves[reserve_asset].name
                : reserve_asset_symbol || "reserve token"
            }
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                if (amount.valid) {
                  withdrawBtnRef.current.click();
                }
              }
            }}
          />
          {protection && (
            <Text type="secondary">
              {" "}
              {t("modals.withdraw_protection.max_withdrawal", "Max. withdrawal")}: {protection / 10 ** reserve_asset_decimals}{" "}
              {reserve_asset in config.reserves
                ? config.reserves[reserve_asset].name
                : reserve_asset_symbol || "reserve token"}
            </Text>
          )}
        </Form.Item>
      </Form>
      <div>
        <b>{t("modals.withdraw_protection.ratio", "Protection ratio")}:</b> {totalProtectionRatio > 0 ? +Number(totalProtectionRatio).toPrecision(3) : 0}
      </div>
    </Modal>
  );
};
