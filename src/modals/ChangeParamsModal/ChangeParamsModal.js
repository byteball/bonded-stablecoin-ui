import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, Button, Space, Typography } from "antd";

import { generateLink } from "utils/generateLink";
import { redirect } from "utils/redirect";

const { Text } = Typography;

export const ChangeParamsModal = ({
  visible = false,
  param,
  onCancel,
  symbol,
  decimals,
  activeWallet,
  governance_aa,
  asset,
  value = undefined,
  balance,
  isMyVote,
  supportParamsByAddress,
  supportsByValue,
  base_governance
}) => {

  const validateParams = {
    fee_multiplier: {
      validator: (value) => base_governance === "Y4VBXMROK5BWBKSYYAMUW7QUEZFXYBCF" ? value >= 1 : value >= 0,
      rule: `The value of the fee_multiplier parameter must be greater than ${base_governance === "FCFYMFIOGS363RLDLEWIDBIIBU7M7BHP" ? 1 : 0}`,
    },
    moved_capacity_share: {
      validator: (value) => value > 0 && value <= 1,
      rule:
        "The value of the moved_capacity_share parameter must be in the range from 0 to 1",
    },
    threshold_distance: {
      validator: (value) => value > 0 && value <= 0.2,
      rule:
        "The value of the threshold_distance parameter must be in the range from 0 to 0.2",
    },
    move_capacity_timeout: {
      validator: (value) => value > 0 && Number.isInteger(Number(value)),
      rule:
        "The value of the move_capacity_timeout parameter must be an integer greater than 0",
    },
    slow_capacity_share: {
      validator: (value) => value >= 0 && value <= 1,
      rule:
        "The value of the slow_capacity_share parameter must be in the range from 0 to 1",
    },
    interest_rate: {
      validator: (value) => value >= 0,
      rule:
        "The value of the interest_rate (as a percentage) parameter must be greater than or equal to 0",
    },
  };
  const [amount, setAmount] = useState({
    value: undefined,
    valid: false,
  });

  const [paramValue, setParamValue] = useState({
    value: undefined,
    valid: false,
  });
  useEffect(() => {
    setParamValue({
      value: value !== "undefined" && !isNaN(value) ? value : undefined,
      valid: value !== "undefined",
    });
    setAmount({
      value: undefined,
      valid: false,
    });
  }, [visible]); // eslint-disable-line

  const valueInput = useRef(null);
  const supportInput = useRef(null);
  const handleChangeAmount = (ev) => {
    const value = ev.target.value;
    const reg = /^[0-9.]+$/;

    if (value === "" || value === "0") {
      setAmount({ value, valid: undefined });
    } else {
      if (
        (~(value + "").indexOf(".") ? (value + "").split(".")[1].length : 0) <=
        decimals
      ) {
        if (reg.test(String(value))) {
          setAmount({ value, valid: true });
        } else {
          setAmount({ value, valid: false });
        }
      }
    }
  };

  const handleChangeParamValue = (ev) => {
    const value = ev.target.value;
    let reg;
    if (param === "move_capacity_timeout") {
      reg = /^[0-9]+$/;
    } else {
      reg = /^(0|[1-9]\d*)([.,]\d+)?$/;
    }
    if (value === "") {
      setParamValue({ value: undefined, valid: undefined });
    } else if (
      reg.test(String(value)) &&
      validateParams[param].validator(value)
    ) {
      setParamValue({ value, valid: true });
    } else {
      setParamValue({ value, valid: false });
    }
  };

  const link = generateLink(
    amount.valid ? Math.ceil(amount.value * 10 ** decimals) : 1e4,
    {
      name: param,
      value:
        param === "interest_rate" ? paramValue.value / 100 : paramValue.value,
    },
    activeWallet,
    governance_aa,
    amount.valid ? asset : undefined
  );

  const handleKeyPress = (ev) => {
    if (ev.key === "Enter") {
      if (finalSupport !== 0 && paramValue.valid) {
        redirect(link);
        onCancel();
      }
    }
  };

  useEffect(() => {
    if (valueInput.current) {
      if (isMyVote) {
        supportInput.current.focus();
      } else {
        valueInput.current.focus();
      }
    }
  }, [visible]);

  const finalSupport = balance + (amount.valid ? Number(amount.value) : 0);

  const validateStatus = param && (paramValue.value || Number(paramValue.value) === 0) ? validateParams[param].validator(paramValue.value) : undefined;

  const totalSupport =
    paramValue.value in supportsByValue
      ? Number(supportsByValue[paramValue.value] || 0) / 10 ** decimals +
      Number(amount.value || 0) +
      (balance - Number(supportParamsByAddress.support / 10 ** decimals) || 0)
      : Number(amount.value || 0) + (balance || 0);

  return (
    <Modal
      title={`Change ${param || "param"}`}
      visible={visible}
      onCancel={onCancel}
      footer={
        <Space>
          <Button key="Cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            key="submit"
            type="primary"
            href={link}
            disabled={
              paramValue.value === undefined || paramValue.value === "" || !paramValue.valid || isMyVote
                ? Number(amount.value) === 0 || !amount.valid
                : finalSupport === 0 || !paramValue.valid
            }
            onClick={() =>
              setTimeout(() => {
                onCancel();
              }, 100)
            }
          >
            {isMyVote ? "Add support" : "Vote"}
          </Button>
        </Space>
      }
    >
      <div style={{ marginBottom: 10 }}>
        <Text type="secondary">{param && validateParams[param].rule}</Text>
      </div>

      <Form size="large" layout="vertical">
        {"value" in supportParamsByAddress &&
          "support" in supportParamsByAddress && (
            <p>
              <Text type="secondary">
                <b>
                  Your support in favor of{" "}
                  {param === "interest_rate"
                    ? supportParamsByAddress.value * 100 + "%"
                    : supportParamsByAddress.value}
                  :
                </b>{" "}
                {supportParamsByAddress.support / 10 ** decimals}{" "}
                {symbol || "tokens1"}
              </Text>
            </p>
          )}
        <Text type="secondary">Parameter value:</Text>
        <Form.Item
          hasFeedback
          validateStatus={((!paramValue.valid && paramValue.value !== undefined) || validateStatus === false) ? "error" : undefined}
          help={((!paramValue.valid && paramValue.value !== undefined) || validateStatus === false) ? validateParams[param].rule : undefined}
        >
          <Input
            placeholder={param}
            autoComplete="off"
            autoFocus={!isMyVote}
            disabled={isMyVote}
            suffix={param === "interest_rate" ? "%" : undefined}
            ref={valueInput}
            onChange={handleChangeParamValue}
            value={paramValue.value}
            onKeyPress={handleKeyPress}
          />
        </Form.Item>
        <p>
          <Text type="secondary">
            <b>Your current balance on the governance AA: </b>
            {balance} {symbol || "tokens1"}
          </Text>
        </p>
        {balance !== 0 && <Text type="secondary">Add more (optional):</Text>}
        <Form.Item>
          <Input
            placeholder={`Count of tokens1 (${symbol || asset})`}
            autoComplete="off"
            onChange={handleChangeAmount}
            suffix={symbol || "tokens1"}
            autoFocus={isMyVote}
            value={amount.value}
            ref={supportInput}
            onKeyPress={handleKeyPress}
          />
        </Form.Item>
      </Form>
      {
        validateStatus && totalSupport ? (
          <p>
            <Text type="secondary">
              <b>
                Total support for {Math.trunc(paramValue.value * 10 ** decimals) / 10 ** decimals || 0}
                {param === "interest_rate" ? "%" : ""}:{" "}
              </b>
              {totalSupport} {symbol || "tokens1"}
            </Text>
          </p>
        ) : null
      }
      {
        validateStatus && totalSupport ? (
          <p>
            <Text type="secondary">
              <b>
                Your support for {Math.trunc(paramValue.value * 10 ** decimals) / 10 ** decimals || 0}
                {param === "interest_rate" ? "%" : ""}:{" "}
              </b>
              {Number(amount.value || 0) + (balance || 0)} {symbol || "tokens1"}
            </Text>
          </p>
        ) : null
      }
    </Modal >
  );
};
