import React, { useState, useEffect } from "react";
import { Form, Input, Row, Col, Button, Select, message } from "antd";

import { validator } from "utils/validators";
import { getStatusVaild } from "utils/getStatusVaild";
import { Label } from "components/Label/Label";

import styles from "../../CreatePage.module.css";
import client from "services/socket";
import config from "config";

const { useForm } = Form;

const initialValues = {
  m: 2,
  n: 0.5,
  leverage: 0,
  op1: "*",
  interest_rate: 0,
  oracle1: process.env.REACT_APP_INITIAL_ORACLE,
  feed_name1: process.env.REACT_APP_INITIAL_FEED_NAME,
  reserve_asset: "base",
  reserve_asset_decimals: 9,
};

export const CurverStep = ({ setCurrent, setData }) => {
  const [form] = useForm();
  const { getFieldsValue, setFieldsValue } = form;
  const [checkOracle, setCheckOracle] = useState(null);
  const [oraclePrice, setOraclePrice] = useState({});
  const [validFields, setValidFields] = useState({
    m: true,
    n: true,
    leverage: true,
    interest_rate: true,
    oracle1: true,
    feed_name1: true,
    reserve_asset: true,
    op1: true,
    decimals1: undefined,
    decimals2: undefined,
    reserve_asset_decimals: true,
  });

  const nextIsActive =
    validFields.m &&
    validFields.n &&
    validFields.reserve_asset &&
    validFields.reserve_asset_decimals &&
    validFields.decimals1 &&
    validFields.decimals2 &&
    validFields.leverage &&
    validFields.interest_rate;

  const validateValue = ({
    name,
    value,
    type,
    maxValue,
    minValue,
    isInteger,
  }) =>
    validator({
      value,
      type,
      maxValue,
      minValue,
      isInteger,
      onSuccess: () => setValidFields((v) => ({ ...v, [name]: true })),
      onError: () => setValidFields((v) => ({ ...v, [name]: false })),
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
      } = getFieldsValue();

      if (oracle1 && feed_name1 && op1) {
        try {
          const data_feed = await client.api.getDataFeed({
            oracles: [oracle1],
            feed_name: feed_name1,
            ifnone: "none",
          });
          if (data_feed !== "none") {
            setCheckOracle(true);
            setOraclePrice((d) => ({ ...d, data_feed_1: data_feed }));
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
              setOraclePrice((d) => ({ ...d, data_feed_2: data_feed }));
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
              setOraclePrice((d) => ({ ...d, data_feed_3: data_feed }));
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
  }, [checkOracle, getFieldsValue, setFieldsValue, setOraclePrice]);
  return (
    <Form
      size="large"
      layout="vertical"
      form={form}
      initialValues={initialValues}
      className={styles.form}
    >
      <Row>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 11 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.oracle1)}
            name="oracle1"
            label={
              <Label
                label="Oracle 1"
                required
                className="label"
                descr="Address of the oracle that reports the price for the stable token"
              />
            }
          >
            <Input
              placeholder="Oracle 1"
              autoComplete="off"
              disabled={checkOracle === true}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.feed_name1)}
            name="feed_name1"
            label={
              <Label
                required
                label="Feed name 1"
                descr="Name of the oracle’s data feed"
              />
            }
          >
            <Input
              placeholder="Feed name 1"
              autoComplete="off"
              disabled={checkOracle === true}
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 4, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.op1)}
            name="op1"
            label={
              <Label
                required
                label="Operation 1"
                descr="How the oracle’s price is interpreted: use ‘*’ if the oracle reports the price of the reserve currency in terms of the stable currency (this is the default). Use ‘/’ if it is the reverse, i.e. the price of the stable token in terms of the reserve asset."
              />
            }
          >
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
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.oracle)}
            name="oracle2"
            label={
              <Label
                label="Oracle 2"
                className="label"
                descr="Optional second oracle. Use it if you want to multiply or delete prices of different assets. E.g. to create a stablecoin pegged to TSLA, you need to divide two price feeds: GBYTE/USD and TSLA/USD."
              />
            }
          >
            <Input
              placeholder="Oracle 2"
              autoComplete="off"
              disabled={checkOracle === true}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.feed_name)}
            name="feed_name2"
            label={
              <Label
                label="Feed name 2"
                descr="Name of the 2nd oracle’s data feed."
              />
            }
          >
            <Input
              placeholder="Feed name 2"
              autoComplete="off"
              disabled={checkOracle === true}
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 4, offset: 1 }}>
          <Form.Item
            hasFeedback
            // validateStatus={getStatusVaild(validFields.feed_name)}
            name="op2"
            label={
              <Label
                label="Operation 2"
                descr="What to do with the 2nd price: multiply or delete."
              />
            }
          >
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
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.oracle)}
            name="oracle3"
            label={
              <Label
                label="Oracle 3"
                className="label"
                descr="Optional 3rd oracle, like the 2nd one."
              />
            }
          >
            <Input
              placeholder="Oracle 3"
              autoComplete="off"
              disabled={checkOracle === true}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.feed_name)}
            name="feed_name3"
            label={
              <Label
                label="Feed name 3"
                descr="Name of the 3rd oracle’s data feed"
              />
            }
          >
            <Input
              placeholder="Feed name 3"
              autoComplete="off"
              disabled={checkOracle === true}
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 4, offset: 1 }}>
          <Form.Item
            hasFeedback
            // validateStatus={getStatusVaild(validFields.feed_name)}
            name="op3"
            label={
              <Label
                label="Operation 3"
                descr="What to do with the 3rd price: multiply or delete."
              />
            }
          >
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
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 16 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.reserve_asset)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    value,
                    type: "asset",
                    name: "reserve_asset",
                  }),
              },
            ]}
            name="reserve_asset"
            label={
              <Label
                required
                label="Reserve asset"
                descr="Asset used as reserve to back the issuance of Token1 and Token2. GBYTE is the default."
              />
            }
          >
            <Select
              placeholder="Reserve asset"
              style={{ width: "100%" }}
              onChange={(value) => {
                setFieldsValue({
                  reserve_asset_decimals: config.reserves[value].decimals,
                });
              }}
            >
              {Object.keys(config.reserves).map((asset) => (
                <Select.Option key={asset} value={asset}>
                  {config.reserves[asset].name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.reserve_asset_decimals)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    value,
                    name: "reserve_asset_decimals",
                    type: "decimals",
                  }),
              },
            ]}
            name="reserve_asset_decimals"
            label={
              <Label
                required
                label="Reserve decimals"
                descr="Decimals of the reserve asset units. 9 for GBYTE."
              />
            }
          >
            <Input
              placeholder="Reserve decimals"
              autoComplete="off"
              disabled={true}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.decimals1)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({ value, name: "decimals1", type: "decimals" }),
              },
            ]}
            name="decimals1"
            label={
              <Label
                required
                label="Decimals 1"
                descr="Decimals of Token1 (growth token)"
              />
            }
          >
            <Input
              placeholder="Decimals 1"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.decimals2)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({ value, name: "decimals2", type: "decimals" }),
              },
            ]}
            name="decimals2"
            label={
              <Label
                required
                label="Decimals 2"
                descr="Decimals of Token2 (interest token, or stable token if interest is 0)"
              />
            }
          >
            <Input placeholder="Decimals 2" autoComplete="off" />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            validateStatus={getStatusVaild(validFields.leverage)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({ value, name: "leverage", type: "number" }),
              },
            ]}
            hasFeedback
            name="leverage"
            label={
              <Label
                required
                label="Leverage"
                descr="Leverage applied to the stable token. Use 0 (the default) to track the oracle price. Use positive values to create an asset that represents leveraged long positions in the reserve asset, negative values for leveraged short positions."
              />
            }
          >
            <Input
              placeholder="Leverage"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.m)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({ value, name: "m", type: "number" }),
              },
            ]}
            name="m"
            label={
              <Label
                required
                label="m"
                descr={
                  <span>
                    Power m in the bonding curve r=s<sub>1</sub>
                    <sup>m</sup> s<sub>2</sub>
                    <sup>n</sup>
                  </span>
                }
              />
            }
          >
            <Input
              placeholder="m"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
          <Form.Item
            validateStatus={getStatusVaild(validFields.n)}
            hasFeedback
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({ value, name: "n", type: "number" }),
              },
            ]}
            name="n"
            label={
              <Label
                required
                label="n"
                descr={
                  <span>
                    Power n in the bonding curve r=s<sub>1</sub>
                    <sup>m</sup> s<sub>2</sub>
                    <sup>n</sup>
                  </span>
                }
              />
            }
          >
            <Input placeholder="n" autoComplete="off" />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.interest_rate)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    value,
                    name: "interest_rate",
                    type: "number",
                  }),
              },
            ]}
            name="interest_rate"
            label={
              <Label
                required
                label="Interest rate"
                descr="Interest rate that Token2 earns on top of the stable token"
              />
            }
          >
            <Input
              placeholder="Interest rate"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
      </Row>
      {checkOracle === true && oraclePrice !== {} && (
        <div>
          {oraclePrice.data_feed_1 && (
            <div style={{ color: "green", paddingTop: 5, paddingBottom: 5 }}>
              <b>Last posted price by Oracle 1: </b>
              {oraclePrice.data_feed_1}
            </div>
          )}
          {oraclePrice.data_feed_2 && (
            <div style={{ color: "green", paddingTop: 5, paddingBottom: 5 }}>
              <b>Last posted price by Oracle 2: </b>
              {oraclePrice.data_feed_2}
            </div>
          )}
          {oraclePrice.data_feed_3 && (
            <div style={{ color: "green", paddingTop: 5, paddingBottom: 5 }}>
              <b>Last posted price by Oracle 3: </b>
              {oraclePrice.data_feed_3}
            </div>
          )}
        </div>
      )}
      {(checkOracle === null || checkOracle === false) && (
        <Button
          loading={checkOracle === false}
          onClick={() => setCheckOracle(false)}
        >
          Check oracles
        </Button>
      )}
      {checkOracle === true && (
        <Button
          disabled={!nextIsActive}
          onClick={() => {
            setData((d) => ({ ...d, ...form.getFieldsValue() }));
            setCurrent((c) => c + 1);
          }}
        >
          Next
        </Button>
      )}
    </Form>
  );
};
