import React, { useState, useEffect } from "react";
import { Form, Input, Row, Col, Button, Select, message } from "antd";

import { validator } from "utils/validators";
import { getStatusValid } from "utils/getStatusValid";
import { Label } from "components/Label/Label";

import styles from "../../CreatePage.module.css";
import client from "services/socket";
import config from "config";
import { paramsDescription } from "pages/Create/paramsDescription";

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
    canBeNegative,
  }) =>
    validator({
      value,
      type,
      maxValue,
      minValue,
      isInteger,
      canBeNegative,
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
      }

      if (oracle2 && feed_name2) {
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

      if (oracle3 && feed_name3) {
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

      if (!oracle1 || !feed_name1) {
        setFieldsValue({ oracle1: undefined, op1: undefined, feed_name1: undefined });
      }

      if (!oracle2 || !feed_name2) {
        setFieldsValue({ oracle2: undefined, op2: undefined, feed_name2: undefined  });
      }

      if (!oracle3 || !feed_name3) {
        setFieldsValue({ oracle3: undefined, op3: undefined, feed_name3: undefined  });
      }

      if(!oracle1 && !oracle2 && !oracle3){
        setCheckOracle(true);
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
            validateStatus={getStatusValid(validFields.oracle1)}
            name="oracle1"
            label={
              <Label
                label="Oracle 1"
                required
                className="label"
                descr={paramsDescription.oracle1}
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
            validateStatus={getStatusValid(validFields.feed_name1)}
            name="feed_name1"
            label={
              <Label
                required
                label="Feed name 1"
                descr={paramsDescription.feed_name1}
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
            validateStatus={getStatusValid(validFields.op1)}
            name="op1"
            label={
              <Label
                required
                label="Operation 1"
                descr={paramsDescription.op1}
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
            validateStatus={getStatusValid(validFields.oracle)}
            name="oracle2"
            label={
              <Label
                label="Oracle 2"
                className="label"
                descr={paramsDescription.oracle2}
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
            validateStatus={getStatusValid(validFields.feed_name)}
            name="feed_name2"
            label={
              <Label
                label="Feed name 2"
                descr={paramsDescription.feed_name2}
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
            name="op2"
            label={
              <Label
                label="Operation 2"
                descr={paramsDescription.op2}
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
            validateStatus={getStatusValid(validFields.oracle)}
            name="oracle3"
            label={
              <Label
                label="Oracle 3"
                className="label"
                descr={paramsDescription.oracle3}
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
            validateStatus={getStatusValid(validFields.feed_name)}
            name="feed_name3"
            label={
              <Label
                label="Feed name 3"
                descr={paramsDescription.feed_name3}
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
            name="op3"
            label={
              <Label
                label="Operation 3"
                descr={paramsDescription.op3}
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
            validateStatus={getStatusValid(validFields.reserve_asset)}
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
            validateStatus={getStatusValid(validFields.reserve_asset_decimals)}
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
                descr="Decimals of the reserve asset units."
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
            validateStatus={getStatusValid(validFields.decimals1)}
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
            validateStatus={getStatusValid(validFields.decimals2)}
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
            validateStatus={getStatusValid(validFields.leverage)}
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    value,
                    name: "leverage",
                    canBeNegative: true,
                    type: "number",
                  }),
              },
            ]}
            hasFeedback
            name="leverage"
            label={
              <Label
                required
                label="Leverage"
                descr={paramsDescription.leverage}
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
            validateStatus={getStatusValid(validFields.m)}
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
                descr={paramsDescription.m}
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
            validateStatus={getStatusValid(validFields.n)}
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
                descr={paramsDescription.n}
              />
            }
          >
            <Input placeholder="n" autoComplete="off" />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusValid(validFields.interest_rate)}
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
                descr={paramsDescription.interest_rate}
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
          <a onClick={() => setCheckOracle(null)}>edit oracles</a>
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
