import React from "react";
import { List, Card } from "antd";

export const VotedForOracle = ({ supports }) => {
  const source = [];
  for (const address in supports) {
    const oracles = supports[address].value.split(" ");
    const value = {};

    oracles.forEach((oracle, i) => {
      value["oracle" + (i + 1)] = oracle.substring(0, 32);
      value["op" + (i + 1)] = oracle.substring(32, 33);
      value["feed_name" + (i + 1)] = oracle.substring(33);
    });

    source.push({
      address,
      support: supports[address].support,
      value,
    });
  }
  return (
    <List
      dataSource={source}
      renderItem={OracleItem}
      locale={{
        emptyText: "No votes",
      }}
    />
  );
};

const OracleItem = ({ address, support, value }) => {
  const Values = [];
  for (const param in value) {
    Values.push(
      <div>
        <b>{param}: </b>
        {value[param]}
      </div>
    );
  }
  return (
    <Card size="small" style={{ marginBottom: 10 }}>
      <div>
        <b>Address:</b> {address}
      </div>
      <div>
        <b>Support:</b> {support / 1e9} GBYTE
      </div>
      <div>{Values}</div>
    </Card>
  );
};
