import React from "react";
import { Col, Row } from "antd";

export const CurrentOracles = ({ param, oracles }) => {
  const OracleList = [];
  if (oracles) {
    oracles.forEach((o, i) => {
      OracleList.push(
        <Col flex={1} style={{ marginBottom: 5 }} key={o.oracle + i}>
          <div>
            <b>Oracle {i + 1}: </b>
            {o.oracle}
          </div>
          <div>
            <b>Operation {i + 1}: </b>
            {o.op}
          </div>
          <div>
            <b>Feed name {i + 1}: </b> {o.feed_name}
          </div>
        </Col>
      );
    });
  } else {
    if (param.oracle1) {
      OracleList.push(
        <Col
          flex={1}
          style={{ marginBottom: 5 }}
          key={param.oracle1 + param.op1 + param.feed_name + 1}
        >
          <div>
            <b>Oracle 1: </b>
            {param.oracle1}
          </div>
          <div>
            <b>Operation 1: </b>
            {param.op1}
          </div>
          <div>
            <b>Feed name 1: </b> {param.feed_name1}
          </div>
        </Col>
      );
    }

    if (param.oracle2) {
      OracleList.push(
        <Col
          flex={1}
          style={{ marginBottom: 5 }}
          key={param.oracle1 + param.op1 + param.feed_name + 2}
        >
          <div>
            <b>Oracle 2: </b>
            {param.oracle2}
          </div>
          <div>
            <b>Operation 2: </b>
            {param.op2}
          </div>
          <div>
            <b>Feed name 2: </b> {param.feed_name2}
          </div>
        </Col>
      );
    }
    if (param.oracle3) {
      OracleList.push(
        <Col
          flex={1}
          style={{ marginBottom: 5 }}
          key={param.oracle1 + param.op1 + param.feed_name + 3}
        >
          <div>
            <b>Oracle 3: </b>
            {param.oracle3}
          </div>
          <div>
            <b>Operation 3: </b>
            {param.op3}
          </div>
          <div>
            <b>Feed name 3: </b> {param.feed_name3}
          </div>
        </Col>
      );
    }
  }

  return <Row gutter={20}>{OracleList}</Row>;
};
