import React, { useState, useEffect } from "react";
import { Form, Input, Row, Col, Button } from "antd";
import { useTranslation } from 'react-i18next';

import { validator } from "utils/validators";
import { getStatusValid } from "utils/getStatusValid";
import { Label } from "components/Label/Label";

import styles from "../../CreatePage.module.css";
import { paramsDescription } from "pages/Create/paramsDescription";

const { useForm } = Form;

export const CapacitorStep = ({ setCurrent, setData, type }) => {
  const [form] = useForm();
  const { setFieldsValue } = form;
  const { t } = useTranslation();

  const initialValues = {
    fee_multiplier: 0.1,
    moved_capacity_share: 0.1,
    threshold_distance: 0.02,
    move_capacity_timeout: 2 * 3600,
    slow_capacity_share: 0.5,
    sf_capacity_share: type === 2 ? 0 : undefined
};

  const [validFields, setValidFields] = useState({
    fee_multiplier: true,
    moved_capacity_share: true,
    threshold_distance: true,
    move_capacity_timeout: true,
    slow_capacity_share: true,
    sf_capacity_share: true
  });
  const nextIsActive =
    validFields.fee_multiplier &&
    validFields.moved_capacity_share &&
    validFields.threshold_distance &&
    validFields.move_capacity_timeout &&
    validFields.slow_capacity_share &&
    (validFields.sf_capacity_share || type === 1)

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

    useEffect(()=>{
      setFieldsValue({ fee_multiplier: type === 2 ? 0.1 : 2 });
    }, [type]);

  return (
    <Form
      size="large"
      layout="vertical"
      form={form}
      initialValues={initialValues}
      className={styles.form}
    >
      <Row>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusValid(validFields.fee_multiplier)}
            name="fee_multiplier"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "fee_multiplier",
                    value,
                    type: "number",
                    minValue: 0,
                  }),
              },
            ]}
            label={
              <Label
                required
                label={paramsDescription().fee_multiplier.name}
                descr={paramsDescription().fee_multiplier.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().fee_multiplier.name}
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusValid(validFields.moved_capacity_share)}
            name="moved_capacity_share"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "moved_capacity_share",
                    value,
                    type: "number",
                    minValue: 0,
                    maxValue: 1
                  }),
              },
            ]}
            label={
              <Label
                required
                label={paramsDescription().moved_capacity_share.name}
                descr={paramsDescription().moved_capacity_share.desc}
              />
            }
          >
            <Input placeholder={paramsDescription().moved_capacity_share.name} autoComplete="off" />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusValid(validFields.threshold_distance)}
            name="threshold_distance"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "threshold_distance",
                    value,
                    type: "number",
                    minValue: 0,
                    maxValue: 0.2
                  }),
              },
            ]}
            label={
              <Label
                required
                label={paramsDescription().threshold_distance.name}
                descr={paramsDescription().threshold_distance.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().threshold_distance.name}
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col ssm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusValid(validFields.move_capacity_timeout)}
            name="move_capacity_timeout"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "move_capacity_timeout",
                    value,
                    type: "number",
                    isInteger: true,
                    minValue: 0,
                  }),
              },
            ]}
            label={
              <Label
                required
                label={paramsDescription().move_capacity_timeout.name}
                descr={paramsDescription().move_capacity_timeout.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().move_capacity_timeout.name}
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusValid(validFields.slow_capacity_share)}
            name="slow_capacity_share"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "slow_capacity_share",
                    value,
                    type: "number",
                    maxValue: 1
                  }),
              },
            ]}
            label={
              <Label
                required
                label={paramsDescription().slow_capacity_share.name}
                descr={paramsDescription().slow_capacity_share.desc}
              />
            }
          >
            <Input placeholder={paramsDescription().slow_capacity_share.name} autoComplete="off" />
          </Form.Item>
        </Col>
        {type === 2 && <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusValid(validFields.sf_capacity_share)}
            name="sf_capacity_share"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "sf_capacity_share",
                    value,
                    type: "number",
                    maxValue: 1
                  }),
              },
            ]}
            label={
              <Label
                required
                label={paramsDescription().sf_capacity_share.name}
                descr={paramsDescription().sf_capacity_share.desc}
              />
            }
          >
            <Input placeholder={paramsDescription().sf_capacity_share.name} autoComplete="off" />
          </Form.Item>
        </Col>}
      </Row>
      <Button
        disabled={!nextIsActive}
        onClick={() => {
          setData((d) => ({ ...d, ...form.getFieldsValue() }));
          setCurrent((c) => c + 1);
        }}
      >
        {t("create.next", "Next")}
      </Button>
    </Form>
  );
};
