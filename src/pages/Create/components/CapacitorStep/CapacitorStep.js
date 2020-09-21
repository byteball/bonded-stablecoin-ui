import React, { useState } from "react";
import { Form, Input, Row, Col, Button } from "antd";

import { validator } from "utils/validators";
import { getStatusVaild } from "utils/getStatusVaild";
import { Label } from "components/Label/Label";

import styles from "../../CreatePage.module.css";

const { useForm } = Form;
const initialValues = {
  fee_multiplier: 5,
  moved_capacity_share: 0.1,
  threshold_distance: 0.1,
  move_capacity_timeout: 2 * 3600,
  slow_capacity_share: 0.5,
};

export const CapacitorStep = ({ setCurrent, setData }) => {
  const [form] = useForm();
  const [validFields, setValidFields] = useState({
    fee_multiplier: true,
    moved_capacity_share: true,
    threshold_distance: true,
    move_capacity_timeout: true,
    slow_capacity_share: true,
  });
  const nextIsActive =
    validFields.fee_multiplier &&
    validFields.moved_capacity_share &&
    validFields.threshold_distance &&
    validFields.move_capacity_timeout &&
    validFields.slow_capacity_share;

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
            validateStatus={getStatusVaild(validFields.fee_multiplier)}
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
                label="Fee multiplier"
                descr="Multiplier used to calculate fees charged for moving the price away from the peg. The larger the multiplier, the larger the fees paid by users for moving the price off-peg."
              />
            }
          >
            <Input
              placeholder="Fee multiplier"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.moved_capacity_share)}
            name="moved_capacity_share"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "moved_capacity_share",
                    value,
                    type: "number",
                    minValue: 0,
                  }),
              },
            ]}
            label={
              <Label
                required
                label="Moved capacity share"
                descr="Part of the slow capacitor that is moved into the fast capacitor after a timeout."
              />
            }
          >
            <Input placeholder="Moved capacity share" autoComplete="off" />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.threshold_distance)}
            name="threshold_distance"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "threshold_distance",
                    value,
                    type: "number",
                    minValue: 0,
                  }),
              },
            ]}
            label={
              <Label
                required
                label="Threshold distance"
                descr="Threshold distance from the target price that triggers the countdown before moving funds from the slow to the fast capacitor."
              />
            }
          >
            <Input
              placeholder="Threshold distance"
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
            validateStatus={getStatusVaild(validFields.move_capacity_timeout)}
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
                label="Move capacity timeout"
                descr="How long we wait (in seconds) before moving part of the slow capacity into the fast one."
              />
            }
          >
            <Input
              placeholder="Move capacity timeout"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.slow_capacity_share)}
            name="slow_capacity_share"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "slow_capacity_share",
                    value,
                    type: "number",
                  }),
              },
            ]}
            label={
              <Label
                required
                label="Slow capacity share"
                descr="Share of fees that goes into the slow capacitor. The rest goes into the fast one."
              />
            }
          >
            <Input placeholder="Slow capacity share" autoComplete="off" />
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
        Next
      </Button>
    </Form>
  );
};
