import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, Space, Button } from "antd";
import { generateLink } from "utils/generateLink";
import config from "config";
import { useSelector } from "react-redux";

export const AddProtectionModal = ({
  visible,
  setVisible,
  activeWallet,
  deposit = {},
}) => {
  const { params, deposit_aa } = useSelector((state) => state.active);
  const [amount, setAmount] = useState({
    value: undefined,
    valid: undefined,
  });
  const amountInputRef = useRef(null);
  const addBtnRef = useRef(null);

  const { id } = deposit;
  const { reserve_asset, reserve_asset_decimals } = params;

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
  return (
    <Modal
      visible={visible}
      title="Add protection to deposit"
      onCancel={setVisible}
      style={{ zIndex: -1 }}
      footer={
        <Space>
          <Button
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
              deposit_aa
            )}
          >
            Add protection
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
            ref={amountInputRef}
            suffix={
              reserve_asset in config.reserves
                ? config.reserves[reserve_asset].name
                : "reserve token"
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
    </Modal>
  );
};
