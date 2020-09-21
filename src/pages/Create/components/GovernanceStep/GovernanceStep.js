import React, { useState } from "react";
import { Form, Input, Row, Col, Select, Button } from "antd";

import { Label } from "components/Label/Label";
import { validator } from "utils/validators";
import { getStatusVaild } from "utils/getStatusVaild";

import styles from "../../CreatePage.module.css";

const { useForm } = Form;
const initialValues = {
  regular_challenging_period: 3 * 24 * 3600,
  important_challenging_period: 30 * 24 * 3600,
  freeze_period: 30 * 24 * 3600,
  proposal_min_support: 0.5,
};

export const GovernanceStep = ({ setCurrent, setData }) => {
  const [form] = useForm();

  const [validFields, setValidFields] = useState({
    regular_challenging_period: true,
    important_challenging_period: true,
    freeze_period: true,
    proposal_min_support: true,
    allow_grants: undefined,
    allow_oracle_change: undefined,
  });

  const nextIsActive =
    validFields.regular_challenging_period &&
    validFields.important_challenging_period &&
    validFields.freeze_period &&
    validFields.proposal_min_support &&
    validFields.allow_grants &&
    validFields.allow_oracle_change;

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
      //   fields={fields}
      onFieldsChange={(changedFields, allFields) => {
        if (
          changedFields &&
          changedFields[0] &&
          changedFields[0].name !== undefined &&
          changedFields[0].name[0] === "regular_challenging_period"
        ) {
          const important_challenging_period = allFields.find(
            (f) => f.name[0] === "important_challenging_period"
          );
          if (
            Number(changedFields[0].value) >= important_challenging_period.value
          ) {
            form.setFieldsValue({ important_challenging_period: "" });
            setValidFields((v) => ({
              ...v,
              important_challenging_period: false,
            }));
          }
        }
      }}
      className={styles.form}
    >
      <Row>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.allow_grants)}
            name="allow_grants"
            label={
              <Label
                required
                label="Allow grants"
                descr="Whether to allow paying grants to teams that promise to promote the use of the stablecoin. Grants are voted on by Token1 holders, and if approved, they dilute Token1 holders."
              />
            }
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "allow_grants",
                    value,
                    type: "number",
                    isInteger: true,
                  }),
              },
            ]}
          >
            <Select placeholder="Allow grants" style={{ width: "100%" }}>
              <Select.Option value={1}>Yes</Select.Option>
              <Select.Option value={0}>No</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
          <Form.Item
            hasFeedback
            name="allow_oracle_change"
            validateStatus={getStatusVaild(validFields.allow_oracle_change)}
            label={
              <Label
                required
                label="Allow oracle change"
                descr="Whether to allow updating the oracles by Token1 holders vote after the stablecoin AA is created."
              />
            }
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "allow_oracle_change",
                    value,
                    type: "number",
                    isInteger: true,
                  }),
              },
            ]}
          >
            <Select placeholder="Allow oracle change" style={{ width: "100%" }}>
              <Select.Option value={1}>Yes</Select.Option>
              <Select.Option value={0}>No</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col ssm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(
              validFields.regular_challenging_period
            )}
            name="regular_challenging_period"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "regular_challenging_period",
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
                label="Regular challenging period"
                descr="Challenging period (in seconds) for votes by Token1 holders on regular issues."
              />
            }
          >
            <Input
              placeholder="Regular challenging period"
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
            validateStatus={getStatusVaild(
              validFields.important_challenging_period
            )}
            name="important_challenging_period"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "important_challenging_period",
                    value,
                    type: "number",
                    isInteger: true,
                    minValue: form.getFieldsValue().regular_challenging_period,
                  }),
              },
            ]}
            label={
              <Label
                required
                label="Important challenging period"
                descr="Challenging period (in seconds) for votes by Token1 holders on important issues such as changing an oracle."
              />
            }
          >
            <Input
              placeholder="Important challenging period"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.freeze_period)}
            name="freeze_period"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "freeze_period",
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
                label="Freeze period"
                descr="How long (in seconds) the voting tokens of the supporters of the winning option are frozen after the decision is made."
              />
            }
          >
            <Input
              placeholder="Freeze period"
              style={{ width: "100%" }}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
          <Form.Item
            hasFeedback
            validateStatus={getStatusVaild(validFields.proposal_min_support)}
            name="proposal_min_support"
            rules={[
              {
                validator: (rule, value) =>
                  validateValue({
                    name: "proposal_min_support",
                    value,
                    type: "number",
                    isInteger: false,
                    minValue: 0,
                    maxValue: 1,
                  }),
              },
            ]}
            label={
              <Label
                required
                label="Proposal min support"
                descr="What share of the total Token1 supply should vote for a grant proposal for the proposal to be eligible to win."
              />
            }
          >
            <Input
              placeholder="Proposal min support"
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
        Next
      </Button>
    </Form>
  );
};
