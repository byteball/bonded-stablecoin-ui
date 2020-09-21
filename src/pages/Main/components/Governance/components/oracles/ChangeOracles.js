import React, { useEffect, useState } from "react";
import { Form, Col, Row, Select, Input, message, Button, Space } from "antd";
import moment from "moment";

import client from "services/socket";
import { generateLink } from "utils/generateLink";

export const ChangeOracles = ({
  activeWallet,
  governance_aa,
  asset,
  decimals,
  width,
  important_challenging_period,
  challenging_period_start_ts,
  choice,
  choiceIsEqualLeader,
  freeze_period,
  balance,
  symbol,
}) => {
  const [form] = Form.useForm();
  const now = moment().unix();
  const { getFieldsValue, setFieldsValue, resetFields } = form;
  const [checkOracle, setCheckOracle] = useState(null);
  const [amount, setAmount] = useState(undefined);
  const [data, setData] = useState({});
  const valuesData = [
    data.oracle1 + data.op1 + data.feed_name1,
    data.oracle2 ? data.oracle2 + data.op2 + data.feed_name2 : "",
    data.oracle3 ? data.oracle3 + data.op3 + data.feed_name3 : "",
  ];
  const link = generateLink(
    amount ? Number(amount) * 10 ** decimals : 1e4,
    { name: "oracles", value: valuesData.join(" ").trim() },
    activeWallet,
    governance_aa,
    amount ? encodeURIComponent(asset) : undefined
  );
  useEffect(() => {
    resetFields();
    setAmount(undefined);
    setData({});
    setCheckOracle(null);
  }, [governance_aa, resetFields]);
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
      } = getFieldsValue();

      if (oracle1 && feed_name1 && op1) {
        try {
          const data_feed = await client.api.getDataFeed({
            oracles: [oracle1],
            feed_name: feed_name1,
            ifnone: "none",
          });
          if (data_feed !== "none") {
            setData((v) => ({ ...v, oracle1, feed_name1, op1 }));
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
              setData((v) => ({ ...v, oracle2, feed_name2, op2 }));
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
              setData((v) => ({ ...v, oracle3, feed_name3, op3 }));
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
      if (!oracle2 && !feed_name2) {
        setFieldsValue({ op2: undefined });
      }

      if (!oracle3 && !feed_name3) {
        setFieldsValue({ op3: undefined });
      }
    };

    if (checkOracle === false) {
      getStatusOracle();
    }
  }, [checkOracle, getFieldsValue, setFieldsValue]);
  return (
    <Form form={form} size="large">
      <Row>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 11 }}>
          <Form.Item name="oracle1">
            <Input
              placeholder="Oracle 1"
              autoComplete="off"
              disabled={checkOracle === true}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item name="feed_name1">
            <Input
              placeholder="Feed name 1"
              autoComplete="off"
              disabled={checkOracle === true}
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 4, offset: 1 }}>
          <Form.Item name="op1">
            <Select
              placeholder="Operation 1"
              disabled={checkOracle === true}
              style={{ width: "100%" }}
            >
              <Select.Option value={"*"}>*</Select.Option>
              <Select.Option value={"/"}>/</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 11 }}>
          <Form.Item name="oracle2">
            <Input
              placeholder="Oracle 2"
              autoComplete="off"
              disabled={checkOracle === true}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item name="feed_name2">
            <Input
              placeholder="Feed name 2"
              autoComplete="off"
              disabled={checkOracle === true}
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 4, offset: 1 }}>
          <Form.Item name="op2">
            <Select
              placeholder="Operation 2"
              disabled={checkOracle === true}
              style={{ width: "100%" }}
            >
              <Select.Option value={"*"}>*</Select.Option>
              <Select.Option value={"/"}>/</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 11 }}>
          <Form.Item name="oracle3">
            <Input
              placeholder="Oracle 3"
              autoComplete="off"
              disabled={checkOracle === true}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item name="feed_name3">
            <Input
              placeholder="Feed name 3"
              autoComplete="off"
              disabled={checkOracle === true}
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 4, offset: 1 }}>
          <Form.Item name="op3">
            <Select
              placeholder="Operation 3"
              disabled={checkOracle === true}
              style={{ width: "100%" }}
            >
              <Select.Option value={"*"}>*</Select.Option>
              <Select.Option value={"/"}>/</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Form.Item>
          <Input
            placeholder="Amount support"
            suffix={symbol || "Tokens1"}
            autoComplete="off"
            value={amount}
            onChange={(ev) => {
              const value = ev.target.value;
              if (
                (~(value + "").indexOf(".")
                  ? (value + "").split(".")[1].length
                  : 0) <= decimals
              ) {
                setAmount(value);
              }
            }}
          />
          {balance !== 0 && (
            <span style={{ fontSize: 10 }}>
              Leave this field blank if you do not want to add support
            </span>
          )}
        </Form.Item>
      </Row>
      <Space direction={width > 400 ? "horizontal" : "vertical"}>
        {(checkOracle === null || checkOracle === false) && (
          <Button
            loading={checkOracle === false}
            onClick={() => setCheckOracle(false)}
          >
            Check oracles
          </Button>
        )}
        {checkOracle === true && (
          <Button disabled={balance === 0 && !amount} href={link}>
            Vote
          </Button>
        )}
        <Button
          type="primary"
          danger={true}
          disabled={
            !choice ||
            (choice &&
              choiceIsEqualLeader &&
              challenging_period_start_ts +
                important_challenging_period +
                freeze_period >
                now)
          }
          href={generateLink(
            1e4,
            { name: "oracles" },
            activeWallet,
            governance_aa
          )}
        >
          Remove support
        </Button>
      </Space>
    </Form>
  );
};
