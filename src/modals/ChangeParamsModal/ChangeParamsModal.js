import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, Button, Space, Typography, Select, Row, Col, message } from "antd";
import obyte from "obyte";
import { useTranslation } from 'react-i18next';

import { generateLink } from "utils/generateLink";
import { redirect } from "utils/redirect";
import client from "services/socket";
import { viewParameter } from "pages/Main/components/Governance/viewParameter";
import { percentageParams } from "pages/Main/components/Governance/components/percentageParams";
import { paramsDescription } from "pages/Create/paramsDescription";

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
  const { t } = useTranslation();
  const validateParams = {
    fee_multiplier: {
      validator: (value) => base_governance === "Y4VBXMROK5BWBKSYYAMUW7QUEZFXYBCF" ? value >= 1 : value >= 0,
      rule: t("modals.change_param.valid.fee_multiplier", "The value of the fee_multiplier parameter must be greater than {{value}}", {value: base_governance === "FCFYMFIOGS363RLDLEWIDBIIBU7M7BHP" ? 1 : 0}),
    },
    moved_capacity_share: {
      validator: (value) => value > 0 && value <= 100,
      rule: t("modals.change_param.valid.moved_capacity_share", "The value of the moved_capacity_share (as a percentage) parameter must be in the range from 0 to 100")
    },
    threshold_distance: {
      validator: (value) => value > 0 && value <= 0.2,
      rule: t("modals.change_param.valid.threshold_distance", "The value of the threshold_distance parameter must be in the range from 0 to 0.2")
    },
    move_capacity_timeout: {
      validator: (value) => value > 0 && Number.isInteger(Number(value)),
      rule: t("modals.change_param.valid.move_capacity_timeout", "The value of the move_capacity_timeout parameter must be an integer greater than 0"),
    },
    slow_capacity_share: {
      validator: (value) => value >= 0 && value <= 100,
      rule: t("modals.change_param.valid.slow_capacity_share", "The value of the slow_capacity_share (as a percentage) parameter must be in the range from 0 to 100")
    },
    interest_rate: {
      validator: (value) => value >= 0,
      rule: t("modals.change_param.valid.interest_rate", "The value of the interest_rate (as a percentage) parameter must be greater than or equal to 0")
    },
    oracles: {
      validator: (value) => !!value,
    },
    "deposits.min_deposit_term": {
      validator: (value) => value >= 0 && Number.isInteger(Number(value)),
      rule: t("modals.change_param.valid.min_deposit_term", "The value of the min_deposit_term parameter must be an integer greater than or equal to 0")
    },
    "deposits.challenging_period": {
      validator: (value) => value >= 0 && Number.isInteger(Number(value)),
      rule: t("modals.change_param.valid.challenging_period", "The value of the challenging_period parameter must be an integer greater than or equal to 0")
    },
    "deposits.challenge_immunity_period": {
      validator: (value) => value >= 0 && Number.isInteger(Number(value)),
      rule: t("modals.change_param.valid.challenge_immunity_period", "The value of the challenge_immunity_period parameter must be an integer greater than or equal to 0")
    },
    "deposits.reporter_share": {
      validator: (value) => value >= 0 && value <= 100,
      rule: t("modals.change_param.valid.reporter_share", "The value of the reporter_share (as a percentage) parameter must be in the range from 0 to 100")
    }
  };

  const [checkedOracle, setCheckedOracle] = useState(undefined);
  const [oracles, setOracles] = useState({});

  const [amount, setAmount] = useState({
    value: undefined,
    valid: false,
  });

  const [paramValue, setParamValue] = useState({
    value: undefined,
    valid: false,
  });

  useEffect(() => {
    const getStatusOracle = async () => {
      const {
        oracle1,
        feed_name1,
        op1,
        oracle2,
        feed_name2,
        op2,
        oracle3,
        feed_name3,
        op3,
      } = oracles;

      if (oracle1 && feed_name1 && op1) {
        try {
          const data_feed = await client.api.getDataFeed({
            oracles: [oracle1],
            feed_name: feed_name1,
            ifnone: "none",
          });
          if (data_feed !== "none") {
            setCheckedOracle(true);
          } else {
            message.error("Oracle 1 is not active!");
            setCheckedOracle(null);
          }
        } catch (e) {
          setCheckedOracle(null);
          message.error("Oracle 1 is not found!");
          console.log("error", e);
        }
      } else {
        message.error("Not all data for oracle 1 is specified!");
        setCheckedOracle(null);
      }

      if (oracle2 || feed_name2) {
        if (op2) {
          try {
            const data_feed = await client.api.getDataFeed({
              oracles: [oracle2],
              feed_name: feed_name2,
              ifnone: "none",
            });
            if (data_feed !== "none") {
              setCheckedOracle(true);
            } else {
              message.error("Oracle 2 is not active!");
              setCheckedOracle(null);
            }
          } catch (e) {
            setCheckedOracle(null);
            message.error("Oracle 2 is not found!");
            console.log("error", e);
          }
        } else {
          message.error("Not all data for oracle 2 is specified!");
          setCheckedOracle(null);
        }
      }

      if (oracle3 || feed_name3) {
        if (op3) {
          try {
            const data_feed = await client.api.getDataFeed({
              oracles: [oracle3],
              feed_name: feed_name3,
              ifnone: "none",
            });
            if (data_feed !== "none") {
              setCheckedOracle(true);
            } else {
              message.error("Oracle 3 is not active!");
              setCheckedOracle(null);
            }
          } catch (e) {
            setCheckedOracle(null);
            message.error("Oracle is not found!");
            console.log("error", e);
          }
        } else {
          message.error("Not all data for oracle 3 is specified!");
          setCheckedOracle(null);
        }
      }
    };

    if (checkedOracle === false) {
      getStatusOracle();
    }
  }, [checkedOracle]);

  useEffect(() => {
    setParamValue({
      value: value !== "undefined" && (!isNaN(value) || param === "oracles") ? value : undefined,
      valid: value !== "undefined",
    });
    setAmount({
      value: undefined,
      valid: false,
    });

    setOracles({});
    setCheckedOracle(undefined);
  }, [visible]); // eslint-disable-line

  const handleChangeOracles = (name, value) => {
    setOracles((o) => ({ ...o, [name]: value }))
  }

  useEffect(() => {
    if (param === "oracles" && oracles) {
      const oraclesArray = [];
      const { feed_name1, feed_name2, feed_name3, oracle1, oracle2, oracle3, op1, op2, op3 } = oracles;
      if (oracle1 && feed_name1 && op1 && obyte.utils.isValidAddress(oracle1)) {
        oraclesArray.push(oracle1 + op1 + feed_name1);
      }
      if (oracle2 && feed_name2 && op2 && obyte.utils.isValidAddress(oracle2)) {
        oraclesArray.push(oracle2 + op2 + feed_name2);
      }
      if (oracle3 && feed_name3 && op3 && obyte.utils.isValidAddress(oracle3)) {
        oraclesArray.push(oracle3 + op3 + feed_name3);
      }
      if (oraclesArray.length > 0) {
        setParamValue({
          value: oraclesArray.join(" "),
          valid: true
        });
      } else if(!value) {
        setParamValue({
          value: undefined,
          valid: false
        });
      }

    };
  }, [param, oracles]);

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
      value: percentageParams.includes(param) ? paramValue.value / 100 : paramValue.value,
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

  const validationStatus = param && (paramValue.value || Number(paramValue.value) === 0) ? validateParams[param].validator(paramValue.value) : undefined;
  const supportsValue = percentageParams.includes(param) ? paramValue.value / 100 : paramValue.value;
  const totalSupport = supportsValue in supportsByValue
      ? Number(supportsByValue[supportsValue] || 0) / 10 ** decimals +
      Number(amount.value || 0) + (balance -  (isMyVote ? Number(supportParamsByAddress.support / 10 ** decimals) : 0) || 0) 
      : Number(amount.value || 0) + (balance || 0);
      
  return (
    <Modal
      title={t("modals.change_param.title", "Change {{param}}", {param: param.replace("deposits.", '').replace("_", ' ') || "param"})}
      visible={visible}
      onCancel={onCancel}
      width={700}
      footer={
        <Space>
          <Button key="Cancel" onClick={onCancel}>
            {t("modals.common.close", "Close")}
          </Button>
          {param === "oracles" && !checkedOracle && !value ? <Button
            key="check"
            type="primary"
            onClick={() => setCheckedOracle(false)}
          >
            {t("modals.common.check", "Check")}
              </Button> : <Button
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
              {isMyVote ? t("modals.change_param.add_support", "Add support") : t("modals.change_param.vote", "Vote")}
            </Button>}
        </Space>
      }
    >
      <div style={{ marginBottom: 10 }}>
        <Text type="secondary">{param && validateParams[param] && validateParams[param].rule}</Text>
      </div>

      <Form size="large" layout="vertical">
        {"value" in supportParamsByAddress &&
          "support" in supportParamsByAddress && (
            <p>
              <Text type="secondary">
                <b>
                  {t("modals.change_param.your_support_value", "Your support in favor of")}{" "}
                  {viewParameter(supportParamsByAddress.value, param, true)}{param === "oracles" ? <span> &mdash; </span> : ":"}
                </b>{" "}
                {supportParamsByAddress.support / 10 ** decimals}{" "}
                {symbol || "T1"}
              </Text>
            </p>
          )}
        <Text type="secondary">{t("modals.change_param.param_value", "Parameter value")}:</Text>
        {param !== "oracles" && <Form.Item
          hasFeedback
          validateStatus={((!paramValue.valid && paramValue.value !== undefined) || validationStatus === false) ? "error" : undefined}
          help={((!paramValue.valid && paramValue.value !== undefined) || validationStatus === false) ? validateParams[param].rule : undefined}
        >
          <Input
            placeholder={param.replace("deposits.", '').replace("_", ' ')}
            autoComplete="off"
            autoFocus={!isMyVote}
            disabled={isMyVote || param === "oracles"}
            suffix={percentageParams.includes(param) ? "%" : undefined}
            ref={valueInput}
            onChange={handleChangeParamValue}
            value={paramValue.value}
            onKeyPress={handleKeyPress}
          />
        </Form.Item>}
        {param === "oracles" && value && <p>
          <Text type="secondary">
            <b>
              {viewParameter(value, param, true)}
            </b>
          </Text>
        </p>}
        {param === "oracles" && !value && <div>
          <Row>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 11 }}>
              <Form.Item>
                <Input
                  placeholder={paramsDescription().oracle2.name}
                  autoComplete="off"
                  disabled={checkedOracle === true}
                  style={{ width: "100%" }}
                  value={oracles.oracle1}
                  onChange={(ev) => handleChangeOracles("oracle1", ev.target.value)}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
              <Form.Item>
                <Input
                  placeholder={paramsDescription().feed_name1.name}
                  autoComplete="off"
                  disabled={checkedOracle === true}
                  value={oracles.feed_name1}
                  onChange={(ev) => handleChangeOracles("feed_name1", ev.target.value)}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 4, offset: 1 }}>
              <Form.Item>
                <Select
                  placeholder={paramsDescription().op1.name}
                  disabled={checkedOracle === true}
                  style={{ width: "100%" }}
                  value={oracles.op1}
                  onChange={(value) => handleChangeOracles("op1", value)}
                >
                  <Select.Option value={"*"}>*</Select.Option>
                  <Select.Option value={"/"}>/</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 11 }}>
              <Form.Item>
                <Input
                  placeholder={paramsDescription().oracle2.name}
                  autoComplete="off"
                  disabled={checkedOracle === true}
                  style={{ width: "100%" }}
                  value={oracles.oracle2}
                  onChange={(ev) => handleChangeOracles("oracle2", ev.target.value)}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
              <Form.Item>
                <Input
                  placeholder={paramsDescription().feed_name2.name}
                  autoComplete="off"
                  disabled={checkedOracle === true}
                  value={oracles.feed_name2}
                  onChange={(ev) => handleChangeOracles("feed_name2", ev.target.value)}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 4, offset: 1 }}>
              <Form.Item>
                <Select
                  placeholder={paramsDescription().op2.name}
                  disabled={checkedOracle === true}
                  style={{ width: "100%" }}
                  value={oracles.op2}
                  onChange={(value) => handleChangeOracles("op2", value)}
                >
                  <Select.Option value={"*"}>*</Select.Option>
                  <Select.Option value={"/"}>/</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 11 }}>
              <Form.Item>
                <Input
                  placeholder={paramsDescription().oracle3.name}
                  autoComplete="off"
                  disabled={checkedOracle === true}
                  style={{ width: "100%" }}
                  value={oracles.oracle3}
                  onChange={(ev) => handleChangeOracles("oracle3", ev.target.value)}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
              <Form.Item>
                <Input
                  placeholder={paramsDescription().feed_name3.name}
                  autoComplete="off"
                  disabled={checkedOracle === true}
                  value={oracles.feed_name3}
                  onChange={(ev) => handleChangeOracles("feed_name3", ev.target.value)}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 4, offset: 1 }}>
              <Form.Item>
                <Select
                  placeholder={paramsDescription().op3.name}
                  disabled={checkedOracle === true}
                  style={{ width: "100%" }}
                  value={oracles.op3}
                  onChange={(value) => handleChangeOracles("op3", value)}
                >
                  <Select.Option value={"*"}>*</Select.Option>
                  <Select.Option value={"/"}>/</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>}
        <p>
          <Text type="secondary">
            <b>{t("modals.change_param.your_balance", "Your current balance on the governance AA")}: </b>
            {balance} {symbol || "tokens1"}
          </Text>
        </p>
        {balance !== 0 && <Text type="secondary">{t("modals.change_param.add_more", "Add more (optional)")}:</Text>}
        <Form.Item>
          <Input
            placeholder={t("modals.change_param.count_tokens", "Count of tokens1 ({{symbol}})", {symbol: symbol || asset})}
            autoComplete="off"
            onChange={handleChangeAmount}
            suffix={symbol || "T1"}
            autoFocus={isMyVote}
            value={amount.value}
            ref={supportInput}
            onKeyPress={handleKeyPress}
          />
        </Form.Item>
      </Form>

      {
        !value && validationStatus && totalSupport ? (
          <Text type="secondary">
            <p>
              <b>
                {t("modals.change_param.your_supported_value", "Your supported value is")} {Math.trunc(paramValue.value * 10 ** decimals) / 10 ** decimals || viewParameter(paramValue.value, param, true)}{percentageParams.includes(param) ? "%" : ""}
              </b>
            </p>
          </Text>
        ) : null
      }

      {
        validationStatus && totalSupport ? (
          <p>
            <Text type="secondary">
              <b>
                {t("modals.change_param.total_support", "Total support for this value")}: {" "}
              </b>
              {totalSupport} {symbol || "tokens1"}
            </Text>
          </p>
        ) : null
      }
      {
        validationStatus && totalSupport ? (
          <p>
            <Text type="secondary">
              <b>
                {t("modals.change_param.your_support", "Your support for this value")}: {" "}
              </b>
              {Number(amount.value || 0) + (balance || 0)} {symbol || "tokens1"}
            </Text>
          </p>
        ) : null
      }
    </Modal >
  );
};
