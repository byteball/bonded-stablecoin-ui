import React from "react";
import { Card, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { addExchangePending } from "store/actions/settings/addExchangePending";

export const ExchangeItem = ({ parametrs, status }) => {
  const {
    address,
    currency_from,
    address_from,
    id,
    amount_currency,
    amount_token,
    symbol,
    asset,
  } = parametrs;

  const dispatch = useDispatch();
  return (
    <Card
      bodyStyle={{ padding: 0 }}
      style={{ marginBottom: 20, cursor: "pointer" }}
      onClick={() => dispatch(addExchangePending(id))}
    >
      <Row
        gutter="10"
        style={{
          paddingTop: 24,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <Col
          lg={{ span: 11 }}
          md={{ span: 12 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
          style={{ paddingBottom: 24, wordBreak: "break-all" }}
        >
          <div style={{ fontSize: 12, fontWeight: 600 }}>Sending</div>
          <div>
            {amount_currency} {currency_from.toUpperCase()} to {address_from}
          </div>
        </Col>

        <Col
          lg={{ span: 10 }}
          md={{ span: 12 }}
          style={{ paddingBottom: 24, wordBreak: "break-all" }}
        >
          <div style={{ fontSize: 12, fontWeight: 600 }}>Receiving</div>
          <div>
            ≈ {amount_token} {symbol || asset.slice(0, 5) + "..."} to {address}
          </div>
        </Col>

        <Col
          lg={{ span: 3 }}
          md={{ span: 12 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
          style={{ paddingBottom: 24 }}
        >
          <div style={{ fontSize: 12, fontWeight: 600 }}>Status</div>
          <div style={{ textTransform: "uppercase" }}>{status}</div>
        </Col>
      </Row>
    </Card>
  );
};
