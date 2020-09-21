import React from "react";
import { Typography, Row, Col, Spin } from "antd";
import { ExchangeItem } from "./ExchangeItem";
import { useSelector } from "react-redux";
import { useGetStatusExchanges } from "../hooks/useGetStatusExchanges";

const { Title } = Typography;

export const ExchangeList = () => {
  const { exchanges } = useSelector((state) => state.settings);
  const statusList = useGetStatusExchanges(exchanges);

  if (exchanges === undefined || exchanges === null || exchanges.length < 0)
    return null;

  return (
    <div>
      {exchanges.length > 0 && (
        <Title style={{ marginTop: 50, marginBottom: 20 }} level={2}>
          List of exchanges
        </Title>
      )}

      {Object.keys(statusList).length > 0 ? (
        <Row>
          <Col span="24">
            {exchanges.map((e) => (
              <ExchangeItem
                parametrs={e}
                key={e.id}
                status={statusList[e.id]}
              />
            ))}
          </Col>
        </Row>
      ) : (
        <Row justify="center">
          {exchanges.length > 0 && (
            <Spin size="large" style={{ padding: 10 }} />
          )}
        </Row>
      )}
    </div>
  );
};
