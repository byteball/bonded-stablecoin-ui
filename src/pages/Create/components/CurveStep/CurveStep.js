import React, { useState, useEffect } from "react";
import { Form, Input, Row, Col, Button, Select, message } from "antd";
import { useTranslation } from 'react-i18next';

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
  n: 2,
  leverage: 0,
  op1: "*",
  interest_rate: 0,
  oracle1: process.env.REACT_APP_INITIAL_ORACLE,
  feed_name1: process.env.REACT_APP_INITIAL_FEED_NAME,
  reserve_asset: "base",
  reserve_asset_decimals: 9,
};

export const CurverStep = ({ setCurrent, setData, type }) => {
  const [form] = useForm();
  const { getFieldsValue, setFieldsValue } = form;
  const { t } = useTranslation();
  const [checkOracle, setCheckOracle] = useState(null);
  const [oraclePrice, setOraclePrice] = useState({price: 1});
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

  useEffect(()=>{
    setFieldsValue({ n: type === 2 ? 2 : 0.5 });
  }, [type]);

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
            setOraclePrice((d) => ({ ...d, data_feed_1: data_feed, price: d.price*(op1 === "/" ? 1 / data_feed : data_feed) }));
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
              setOraclePrice((d) => ({ ...d, data_feed_2: data_feed, price: d.price*(op2 === "/" ? 1 / data_feed : data_feed) }));
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
              setOraclePrice((d) => ({ ...d, data_feed_3: data_feed, price: d.price*(op3 === "/" ? 1 / data_feed : data_feed) }));
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
                label={paramsDescription().oracle1.name}
                required
                className="label"
                descr={paramsDescription().oracle1.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().oracle1.name}
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
                label={paramsDescription().feed_name1.name}
                descr={paramsDescription().feed_name1.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().feed_name1.name}
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
                label={paramsDescription().op1.name}
                descr={paramsDescription().op1.desc}
              />
            }
          >
            <Select
              placeholder={paramsDescription().op1.name}
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
                label={paramsDescription().oracle2.name}
                className="label"
                descr={paramsDescription().oracle2.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().oracle2.name}
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
                label={paramsDescription().feed_name2.name}
                descr={paramsDescription().feed_name2.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().feed_name2.name}
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
                label={paramsDescription().op2.name}
                descr={paramsDescription().op2.desc}
              />
            }
          >
            <Select
              placeholder={paramsDescription().op2.name}
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
                label={paramsDescription().oracle3.name}
                className="label"
                descr={paramsDescription().oracle3.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().oracle3.name}
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
                label={paramsDescription().feed_name3.name}
                descr={paramsDescription().feed_name3.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().feed_name3.name}
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
                label={paramsDescription().op3.name}
                descr={paramsDescription().op3.desc}
              />
            }
          >
            <Select
              placeholder={paramsDescription().op3.name}
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
                label={paramsDescription().reserve_asset.name}
                descr={paramsDescription().reserve_asset.desc}
              />
            }
          >
            <Select
              placeholder={paramsDescription().reserve_asset.name}
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
                label={paramsDescription().reserve_decimals.name}
                descr={paramsDescription().reserve_decimals.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().reserve_decimals.name}
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
                label={paramsDescription().decimals1.name}
                descr={paramsDescription().decimals1.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().decimals1.name}
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
                label={paramsDescription().decimals2.name}
                descr={paramsDescription().decimals2.desc}
              />
            }
          >
            <Input placeholder={paramsDescription().decimals2.name} autoComplete="off" />
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
                label={paramsDescription().leverage.name}
                descr={paramsDescription().leverage.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().leverage.name}
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
                label={paramsDescription().m.name}
                descr={paramsDescription().m.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().m.name}
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
                label={paramsDescription().n.name}
                descr={paramsDescription().n.desc}
              />
            }
          >
            <Input placeholder={paramsDescription().n.name} autoComplete="off" />
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
                label={paramsDescription().interest_rate.name}
                descr={paramsDescription().interest_rate.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().interest_rate.name}
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
      </Row>
      {checkOracle === true && oraclePrice !== {} && (
        <div>
          <a
            onClick={() => {
              setCheckOracle(null);
              setOraclePrice({price: 1});
            }}
          >
            {t("create.edit_oracles", "edit oracles")}
          </a>
          {oraclePrice.data_feed_1 && (
            <div style={{ color: "green", paddingTop: 5, paddingBottom: 5 }}>
              <b>{t("create.last_posted", "Last posted price by Oracle ")}1: </b>
              {oraclePrice.data_feed_1}
            </div>
          )}
          {oraclePrice.data_feed_2 && (
            <div style={{ color: "green", paddingTop: 5, paddingBottom: 5 }}>
              <b>{t("create.last_posted", "Last posted price by Oracle ")}2: </b>
              {oraclePrice.data_feed_2}
            </div>
          )}
          {oraclePrice.data_feed_3 && (
            <div style={{ color: "green", paddingTop: 5, paddingBottom: 5 }}>
              <b>{t("create.last_posted", "Last posted price by Oracle ")}3: </b>
              {oraclePrice.data_feed_3}
            </div>
          )}
          {oraclePrice.price && (
            <div style={{ color: "green", paddingTop: 5, paddingBottom: 5 }}>
              <b>{t("create.target_price", "Target price")}: </b>
              {oraclePrice.price}
            </div>
          )}
        </div>
      )}
      {(checkOracle === null || checkOracle === false) && (
        <Button
          loading={checkOracle === false}
          onClick={() => setCheckOracle(false)}
        >
          {t("create.check", "Check oracles")}
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
          {t("create.next", "Next")}
        </Button>
      )}
    </Form>
  );
};
