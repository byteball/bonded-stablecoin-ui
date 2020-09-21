import React, { useState } from "react";
import { Select, Form, Table, Card, List } from "antd";

import { ShowDecimalsValue } from "components/ShowDecimalsValue/ShowDecimalsValue";

const { Option } = Select;
export const SupportParams = ({ supportParamsByAddress, decimals, width }) => {
  const [selectParam, setSelectParam] = useState(undefined);

  let source = [];

  if (selectParam !== undefined) {
    const supportsParam = supportParamsByAddress[selectParam];
    for (const address in supportsParam) {
      source.push({
        address,
        value: supportsParam[address].value,
        support: supportsParam[address].support,
      });
    }
  }

  const columns = [
    { title: "Address", dataIndex: "address", key: "address", width: "30%" },
    { title: "Value", dataIndex: "value", key: "value" },
    {
      title: "Support",
      dataIndex: "support",
      key: "support",
      render: (value) => {
        return <ShowDecimalsValue decimals={decimals} value={value} />;
      },
    },
  ];

  return (
    <>
      <Form>
        <Form.Item>
          <Select
            size="large"
            placeholder="Select param"
            onChange={(v) => setSelectParam(v)}
            value={selectParam}
          >
            <Option key="fee_multiplier">Fee multiplier</Option>
            <Option key="moved_capacity_share">Moved capacity share</Option>
            <Option key="threshold_distance">Threshold distance</Option>
            <Option key="move_capacity_timeout">Move capacity timeout</Option>
            <Option key="slow_capacity_share">Slow capacity share</Option>
            <Option key="interest_rate">Interest rate</Option>
          </Select>
        </Form.Item>

        {selectParam && width > 990 ? (
          <Table
            dataSource={source.sort((a, b) => b.support - a.support)}
            columns={columns}
            locale={{
              emptyText: "No votes",
            }}
            pagination={{ pageSize: 20, hideOnSinglePage: true }}
          />
        ) : (
          <>
            {selectParam && (
              <List
                dataSource={source.sort((a, b) => b.support - a.support)}
                renderItem={(item) => {
                  return (
                    <Card size="small">
                      <div>
                        <b>Address: </b> {item.address}
                      </div>
                      <div>
                        <b>Value: </b> {item.value}
                      </div>
                      <div>
                        <b>Support: </b>{" "}
                        <ShowDecimalsValue
                          decimals={decimals}
                          value={item.support}
                        />
                      </div>
                    </Card>
                  );
                }}
              />
            )}
          </>
        )}
      </Form>
    </>
  );
};
