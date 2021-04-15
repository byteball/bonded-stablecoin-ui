import React, { useState } from "react";
import { Form, Input, Row, Col, Button } from "antd";
import { useTranslation } from 'react-i18next';

import { validator } from "utils/validators";
import { getStatusValid } from "utils/getStatusValid";
import { Label } from "components/Label/Label";

import styles from "../../CreatePage.module.css";
import { paramsDescription } from "pages/Create/paramsDescription";

const { useForm } = Form;
const initialValues = {
  below_peg_threshold: 0.001,
  below_peg_timeout: 12 * 3600,
  min_reserve_delta: 100000
};

export const DecisionStep = ({ setCurrent, setData }) => {
  const [form] = useForm();
  const { t } = useTranslation();

  const [validFields, setValidFields] = useState({
    below_peg_threshold: true,
    below_peg_timeout: true,
    min_reserve_delta: true
  });

  const nextIsActive =
    validFields.below_peg_threshold &&
    validFields.below_peg_timeout &&
    validFields.min_reserve_delta;

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

  return <div>
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
            validateStatus={getStatusValid(validFields.below_peg_threshold)}
            name="below_peg_threshold"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "below_peg_threshold",
                    value,
                    type: "number",
                    minValue: 0,
                  }),
              },
            ]}
            label={
              <Label
                required
                label={paramsDescription().below_peg_threshold.name}
                descr={paramsDescription().below_peg_threshold.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().below_peg_threshold.name}
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusValid(validFields.below_peg_timeout)}
            name="below_peg_timeout"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "below_peg_timeout",
                    value,
                    type: "number",
                    isInteger: true
                    // minValue: 0,
                  }),
              },
            ]}
            label={
              <Label
                required
                label={paramsDescription().below_peg_timeout.name}
                descr={paramsDescription().below_peg_timeout.desc}
              />
            }
          >
            <Input placeholder={paramsDescription().below_peg_timeout.name} autoComplete="off" />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusValid(validFields.min_reserve_delta)}
            name="min_reserve_delta"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "min_reserve_delta",
                    value,
                    type: "number",
                    minValue: 0,
                    isInteger: true
                  }),
              },
            ]}
            label={
              <Label
                required
                label={paramsDescription().min_reserve_delta.name}
                descr={paramsDescription().min_reserve_delta.desc}
              />
            }
          >
            <Input
              placeholder={paramsDescription().min_reserve_delta.name}
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
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
  </div>
}