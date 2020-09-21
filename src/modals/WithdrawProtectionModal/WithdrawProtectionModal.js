import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, Space, Button, Typography } from "antd";
import { useSelector } from "react-redux";
import { generateLink } from "utils/generateLink";
import config from "config";

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
  const { id, protection } = deposit;
  const { params, deposit_aa } = useSelector((state) => state.active);
  const { reserve_asset, reserve_asset_decimals } = params;

  const amountInput = useRef(null);
  const withdrawBtnRef = useRef(null);
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
      title="Withdraw protection from deposit"
      onCancel={setVisible}
      style={{ zIndex: -1 }}
      footer={
        <Space>
          <Button
            danger
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
            Withdraw protection
          </Button>
          <Button type="default" onClick={setVisible}>
            Close
          </Button>
        </Space>
      }
    >
      <Form size="large">
        <Form.Item>
          <Input
            placeholder="Amount"
            onChange={handleChangeAmount}
            value={amount.value}
            ref={amountInput}
            autoFocus={true}
            suffix={
              reserve_asset in config.reserves
                ? config.reserves[reserve_asset].name
                : "reserve token"
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
              Max. withdrawal: {protection / 10 ** reserve_asset_decimals}{" "}
              {reserve_asset in config.reserves
                ? config.reserves[reserve_asset].name
                : "reserve token"}
            </Text>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};
