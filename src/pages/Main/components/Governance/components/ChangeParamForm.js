import React, { useState } from "react";
import { Row, Col, Button, Select, Form, Input } from "antd";
import { generateLink } from "utils/generateLink";

const { Option } = Select;

export const ChangeParamForm = ({
  asset,
  decimals,
  governance_aa,
  supportedParams,
}) => {
  const [param, setParam] = useState(undefined);
  const [value, setValue] = useState(undefined);
  const [amount, setAmount] = useState(undefined);

  const isValidValue = value !== undefined && value !== "";
  const isValidAmount = amount !== undefined && Number(amount) !== 0;

  const handleChangeAmount = (ev) => {
    const value = ev.target.value;
    const reg = /^[0-9.]+$/;
    if (reg.test(String(value)) || value === "") {
      setAmount(String(value));
    }
  };

  const link = generateLink(
    amount * 10 ** decimals,
    { name: param, value },
    undefined,
    governance_aa,
    encodeURIComponent(asset)
  );

  return (
    <Form size="large">
      <Row>
        <Col span={11}>
          <Form.Item>
            <Select
              placeholder="Select params"
              onChange={(v) => setParam(v)}
              value={param}
            >
              <Option
                key="fee_multiplier"
                disabled={"fee_multiplier" in supportedParams}
              >
                Fee multiplier
              </Option>
              <Option
                key="moved_capacity_share"
                disabled={"moved_capacity_share" in supportedParams}
              >
                Moved capacity share
              </Option>
              <Option
                key="threshold_distance"
                disabled={"threshold_distance" in supportedParams}
              >
                Threshold distance
              </Option>
              <Option
                key="move_capacity_timeout"
                disabled={"move_capacity_timeout" in supportedParams}
              >
                Move capacity timeout
              </Option>
              <Option
                key="slow_capacity_share"
                disabled={"slow_capacity_share" in supportedParams}
              >
                Slow capacity share
              </Option>
              <Option
                key="interest_rate"
                disabled={"interest_rate" in supportedParams}
              >
                Interest rate
              </Option>
              <Option
                key="oracle-feed"
                disabled={"oracle-feed" in supportedParams}
              >
                Oracle feed
              </Option>
              <Option key="proposal" disabled={"proposal" in supportedParams}>
                Proposal
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={11} offset={2}>
          <Input
            placeholder="Value"
            onChange={(ev) => setValue(ev.target.value)}
            disabled={!param}
            value={value}
          />
        </Col>
      </Row>

      <Row>
        <Col span={11}>
          <Form.Item>
            <Input
              placeholder="Amount tokens1"
              suffix={asset.slice(0, 4)}
              disabled={!param}
              value={amount}
              onChange={handleChangeAmount}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button
          href={link}
          type="primary"
          onClick={() =>
            setTimeout(() => {
              setAmount(undefined);
              setParam(undefined);
              setValue(undefined);
            }, 100)
          }
          disabled={!isValidValue || !isValidAmount}
        >
          Change
        </Button>
      </Form.Item>
      {/* <Text type="secondary">
        <b>Parameter description: </b>Change of parameters Change of parameters
        Change of p arameter sarameters Change of parameters
      </Text> */}
    </Form>
  );
};
