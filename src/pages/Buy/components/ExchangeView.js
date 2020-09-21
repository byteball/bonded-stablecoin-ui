import { Row, Typography, Button, Col } from "antd";
import { LoadingOutlined, CheckCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styles from "./ExchangeView.module.css";
import { useDispatch } from "react-redux";
import { removeExchangePending } from "store/actions/settings/removeExchangePending";
import axios from "axios";
import config from "config";

const { Text, Paragraph } = Typography;

export const ExchangeView = ({ current }) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(undefined);

  const {
    address,
    address_from,
    amount_token,
    symbol,
    asset,
    amount_currency,
    currency_from,
  } = current;
  const updateFn = async (id) => {
    axios
      .get(
        `https://api.simpleswap.io/v1/get_exchange?api_key=${config.SIMPLESWAP_API_KEY}&id=${id}`
      )
      .then((obj) => {
        const { data } = obj;
        setStatus(data.status);
      });
  };
  useEffect(() => {
    updateFn(current.id);
    const update = setInterval(() => updateFn(current.id), 1000 * 60 * 5);
    return () => clearInterval(update);
  }, [current]);

  return (
    <div className={styles.view}>
      <Row justify="center">
        {status === "finished" ? (
          <CheckCircleOutlined />
        ) : (
          <LoadingOutlined className={styles.icon} />
        )}
      </Row>
      <Row justify="center" className={styles.auto}>
        <Text>This page will be updated automatically</Text>
      </Row>
      <Row justify="center">
        <div>
          <b>Status:</b>{" "}
          {status ? (
            <span>{status}</span>
          ) : (
            <Text type="secondary">loading status...</Text>
          )}
        </div>
      </Row>
      <Row justify="center">
        <Col xs={{ span: 24 }} md={{ span: 12 }}>
          <div className={styles.currency}>
            <b>You send:</b>{" "}
            <span style={{ textTransform: "uppercase" }}>
              {amount_currency}{" "}
              <span style={{ textTransform: "uppercase" }}>
                {currency_from}
              </span>
            </span>
          </div>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }}>
          <div className={styles.currency}>
            <b>You get:</b>{" "}
            <span>
              {amount_token} {symbol || asset.slice(0, 4) + "..."}
            </span>
          </div>
        </Col>
      </Row>
      <Row justify="center">
        <div className={styles.addressWrap}>
          <b>
            Send{" "}
            <span style={{ textTransform: "uppercase" }}>{currency_from}</span>{" "}
            to address:{" "}
          </b>
          <span>
            <Paragraph copyable className={styles.address}>
              {address_from}
            </Paragraph>
          </span>
        </div>
      </Row>
      <Row justify="center">
        <div className={styles.addressWrap}>
          <b>Recipient address: </b>
          <span>
            <Paragraph copyable className={styles.address}>
              {address}
            </Paragraph>
          </span>
        </div>
      </Row>
      <Row justify="center" style={{ padding: 10 }}>
        <Button onClick={() => dispatch(removeExchangePending())}>
          Go back to the form
        </Button>
      </Row>
    </div>
  );
};
