import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, Button, Space, Typography, Select, Row, Col, message } from "antd";
import obyte from "obyte";

import { generateLink } from "utils/generateLink";
import { redirect } from "utils/redirect";
import client from "services/socket";

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
    oracles: {
      validator: (value) => !!value,
    },
    "deposits.min_deposit_term": {
      validator: (value) => value >= 0 && Number.isInteger(Number(value)),
      rule: "The value of the min_deposit_term parameter must be an integer greater than or equal to 0"
    },
    "deposits.challenging_period": {
      validator: (value) => value >= 0 && Number.isInteger(Number(value)),
      rule: "The value of the challenging_period parameter must be an integer greater than or equal to 0"
    },
    "deposits.challenge_immunity_period": {
      validator: (value) => value >= 0 && Number.isInteger(Number(value)),
      rule: "The value of the challenge_immunity_period parameter must be an integer greater than or equal to 0"
    },
    "deposits.reporter_share": {
      validator: (value) => value >= 0 && value <= 100,
      rule: "The value of the reporter_share (as a percentage) parameter must be in the range from 0 to 100"
    }
  };

  const [checkOracle, setCheckOracle] = useState(undefined);
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
            setCheckOracle(true);
          } else {
            message.error("Oracle 1 is not active!");
            setCheckOracle(null);
          }
        } catch (e) {
          setCheckOracle(null);
          message.error("Oracle 1 is not found!");
          console.log("error", e);
        }
      } else {
        message.error("Not all data for oracle 1 is specified!");
        setCheckOracle(null);
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
              setCheckOracle(true);
            } else {
              message.error("Oracle 2 is not active!");
              setCheckOracle(null);
            }
          } catch (e) {
            setCheckOracle(null);
            message.error("Oracle 2 is not found!");
            console.log("error", e);
          }
        } else {
          message.error("Not all data for oracle 2 is specified!");
          setCheckOracle(null);
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
              setCheckOracle(true);
            } else {
              message.error("Oracle 3 is not active!");
              setCheckOracle(null);
            }
          } catch (e) {
            setCheckOracle(null);
            message.error("Oracle is not found!");
            console.log("error", e);
          }
        } else {
          message.error("Not all data for oracle 3 is specified!");
          setCheckOracle(null);
        }
      }
    };

    if (checkOracle === false) {
      getStatusOracle();
    }
  }, [checkOracle]);

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
    setCheckOracle(undefined);
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
      value:
        param === "interest_rate" || param === "deposits.reporter_share" ? paramValue.value / 100 : paramValue.value,
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
  const supportsValue = param === "interest_rate" || param === "deposits.reporter_share" ? paramValue.value / 100 : paramValue.value;
  const totalSupport = supportsValue in supportsByValue
      ? Number(supportsByValue[supportsValue] || 0) / 10 ** decimals +
      Number(amount.value || 0) + (balance || 0) //- Number(supportParamsByAddress.support / 10 ** decimals) 
      : Number(amount.value || 0) + (balance || 0);
      
  return (
    <Modal
      title={`Change ${param.replace("deposits.", '').replace("_", ' ') || "param"}`}
      visible={visible}
      onCancel={onCancel}
      width={700}
      footer={
        <Space>
          <Button key="Cancel" onClick={onCancel}>
            Cancel
          </Button>
          {param === "oracles" && !checkOracle && !value ? <Button
            key="check"
            type="primary"
            onClick={() => setCheckOracle(false)}
          >
            Check
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
              {isMyVote ? "Add support" : "Vote"}
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
                  Your support in favor of{" "}
                  {view(supportParamsByAddress.value, param)}{param === "oracles" ? <span> &mdash; </span> : ":"}
                </b>{" "}
                {supportParamsByAddress.support / 10 ** decimals}{" "}
                {symbol || "tokens1"}
              </Text>
            </p>
          )}
        <Text type="secondary">Parameter value:</Text>
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
            suffix={param === "interest_rate" || param === "deposits.reporter_share" ? "%" : undefined}
            ref={valueInput}
            onChange={handleChangeParamValue}
            value={paramValue.value}
            onKeyPress={handleKeyPress}
          />
        </Form.Item>}
        {param === "oracles" && value && <p>
          <Text type="secondary">
            <b>
              {view(value, param)}
            </b>
          </Text>
        </p>}
        {param === "oracles" && !value && <div>
          <Row>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 11 }}>
              <Form.Item>
                <Input
                  placeholder="Oracle 1"
                  autoComplete="off"
                  disabled={checkOracle === true}
                  style={{ width: "100%" }}
                  value={oracles.oracle1}
                  onChange={(ev) => handleChangeOracles("oracle1", ev.target.value)}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
              <Form.Item>
                <Input
                  placeholder="Feed name 1"
                  autoComplete="off"
                  disabled={checkOracle === true}
                  value={oracles.feed_name1}
                  onChange={(ev) => handleChangeOracles("feed_name1", ev.target.value)}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 4, offset: 1 }}>
              <Form.Item>
                <Select
                  placeholder="Operation 1"
                  disabled={checkOracle === true}
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
                  placeholder="Oracle 2"
                  autoComplete="off"
                  disabled={checkOracle === true}
                  style={{ width: "100%" }}
                  value={oracles.oracle2}
                  onChange={(ev) => handleChangeOracles("oracle2", ev.target.value)}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
              <Form.Item>
                <Input
                  placeholder="Feed name 2"
                  autoComplete="off"
                  disabled={checkOracle === true}
                  value={oracles.feed_name2}
                  onChange={(ev) => handleChangeOracles("feed_name2", ev.target.value)}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 4, offset: 1 }}>
              <Form.Item>
                <Select
                  placeholder="Operation 2"
                  disabled={checkOracle === true}
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
                  placeholder="Oracle 3"
                  autoComplete="off"
                  disabled={checkOracle === true}
                  style={{ width: "100%" }}
                  value={oracles.oracle3}
                  onChange={(ev) => handleChangeOracles("oracle3", ev.target.value)}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
              <Form.Item>
                <Input
                  placeholder="Feed name 3"
                  autoComplete="off"
                  disabled={checkOracle === true}
                  value={oracles.feed_name3}
                  onChange={(ev) => handleChangeOracles("feed_name3", ev.target.value)}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 4, offset: 1 }}>
              <Form.Item>
                <Select
                  placeholder="Operation 3"
                  disabled={checkOracle === true}
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
        !value && validationStatus && totalSupport ? (
          <Text type="secondary">
            <p>
              <b>
                Your supported value is {Math.trunc(paramValue.value * 10 ** decimals) / 10 ** decimals || view(paramValue.value, param)}{param === "interest_rate" || param === "deposits.reporter_share" ? "%" : ""}
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
                Total support for this value: {" "}
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
                Your support for this value: {" "}
              </b>
              {Number(amount.value || 0) + (balance || 0)} {symbol || "tokens1"}
            </Text>
          </p>
        ) : null
      }
    </Modal >
  );
};

export const view = (value, name) => {
  if (value) {
    if (name === "oracles") {
      const oracles = parseOracle(value.trim());
      return oracles.map((oracle, i) => {
        return <span key={name + '-' + oracle + "-" + i} style={{ display: "block" }}>{oracle.address + " " + oracle.feed_name + " \"" + oracle.op + "\""}</span>;
      })
    } else if (name === "interest_rate" || name === "deposits.reporter_share") {
      return value * 100 + "%"
    } else {
      return value;
    }
  }
}

export const parseOracle = (oracles) => oracles.split(" ").map((info) => ({
  address: info.slice(0, 32),
  op: info.slice(32, 33),
  feed_name: info.slice(33, info.length)
}));