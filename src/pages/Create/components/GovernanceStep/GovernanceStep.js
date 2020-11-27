import React, { useState } from "react";
import { Form, Input, Row, Col, Select, Button } from "antd";

import { Label } from "components/Label/Label";
import { validator } from "utils/validators";
import { getStatusValid } from "utils/getStatusValid";

import styles from "../../CreatePage.module.css";
import { paramsDescription } from "pages/Create/paramsDescription";

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
            validateStatus={getStatusValid(validFields.allow_grants)}
            name="allow_grants"
            label={
              <Label
                required
                label="Allow grants"
                descr={paramsDescription.allow_grants}
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
            validateStatus={getStatusValid(validFields.allow_oracle_change)}
            label={
              <Label
                required
                label="Allow oracle change"
                descr={paramsDescription.allow_oracle_change}
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
            validateStatus={getStatusValid(
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
                descr={paramsDescription.regular_challenging_period}
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
            validateStatus={getStatusValid(
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
                descr={paramsDescription.important_challenging_period}
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
            validateStatus={getStatusValid(validFields.freeze_period)}
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
                descr={paramsDescription.freeze_period}
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
            validateStatus={getStatusValid(validFields.proposal_min_support)}
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
                descr={paramsDescription.proposal_min_support}
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
