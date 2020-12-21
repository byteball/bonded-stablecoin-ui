import { Row, Typography, Button, Col } from "antd";
import { LoadingOutlined, CheckCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useTranslation, Trans } from 'react-i18next';
import axios from "axios";

import styles from "./ExchangeView.module.css";
import { useDispatch } from "react-redux";
import { removeExchangePending } from "store/actions/settings/removeExchangePending";
import config from "config";

const { Text, Paragraph } = Typography;

export const ExchangeView = ({ current }) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(undefined);
  const { t } = useTranslation();
  const {
    address,
    address_from,
    amount_token,
    symbol,
    asset,
    amount_currency,
    currency_from,
    provider,
  } = current;
  const statusPageUrl = provider === "oswapcc" ? "https://www.oswap.cc/#/contact" : "https://simpleswap.io/exchange?id=" + current.id;
  const updateFn = async (id) => {
    axios
      .get(
        provider === "oswapcc"
          ? `${config.oswapccRoot}/get_status/${id}`
          : `https://api.simpleswap.io/v1/get_exchange?api_key=${config.SIMPLESWAP_API_KEY}&id=${id}`
      )
      .then((obj) => {
        const { data } = obj;
        setStatus(provider === "oswapcc" ? data.data.status : data.status);
      });
  };
  useEffect(() => {
    updateFn(current.id);
    const update = setInterval(() => updateFn(current.id), 1000 * 60 * 5);
    return () => clearInterval(update);
  }, [current]);

  const isFinished = () => {
    if (provider === 'simpleswap' || !provider)
      return (status === 'finished' || status === 'sending');
    if (provider === 'oswapcc')
      return (status === 'sent');
    throw Error(`unknown provider ` + provider);
  };

  return (
    <div className={styles.view}>
      <Row justify="center">
        {isFinished() ? (
          <CheckCircleOutlined />
        ) : (
          <LoadingOutlined className={styles.icon} />
        )}
      </Row>
      <Row justify="center" className={styles.auto}>
        <Text>{t("buy.updated", "This page will be updated automatically")}</Text>
      </Row>
      <Row justify="center">
        <div>
          <b>{t("buy.status", "Status")}:</b>{" "}
          {status ? (
            <span>{status}</span>
          ) : (
            <Text type="secondary">{t("buy.status_loading", "loading status...")}</Text>
          )}
        </div>
      </Row>
      <Row justify="center">
        <Col xs={{ span: 24 }} md={{ span: 12 }}>
          <div className={styles.currency}>
          <Trans i18nKey="buy.you_send">You <b>send</b></Trans>{": "}
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
            <Trans i18nKey="buy.you_get">You <b>get</b></Trans>{": "}
            <span>
              {amount_token} {symbol || asset.slice(0, 4) + "..."}
            </span>
          </div>
        </Col>
      </Row>
      <Row justify="center">
        <div className={styles.addressWrap}>
          <b>
            <Trans i18nKey="buy.send_to_address" currency_from={currency_from}>
              Send <span style={{ textTransform: "uppercase" }}>{{currency_from}}</span> to address: 
            </Trans>
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
          <b>{t("buy.recipient_address", "Recipient address")}: </b>
          <span>
            <Paragraph copyable className={styles.address}>
              {address}
            </Paragraph>
          </span>
        </div>
      </Row>
      {!isFinished() && (<Row justify="center">
        <div className={styles.providerStatus}>
          <Text type="secondary">
            <Trans i18nKey="buy.currently_converting" currency_from={currency_from}>
              Currently converting <span style={{ textTransform: "uppercase" }}>
                {{currency_from}}
              </span> to GBYTE, this step is performed by {{providerName: provider === "oswapcc" ? "oswap.cc" : "simpleswap.io"}}. For support issues, please contact them on their <a href={statusPageUrl} target="_blank" rel="noopener">support page</a>.
            </Trans>
          </Text>
        </div>
      </Row>)}
      <Row justify="center" style={{ padding: 10 }}>
        <Button onClick={() => dispatch(removeExchangePending())}>
          {t("buy.go_back", "Go back to the form")}
        </Button>
      </Row>
    </div>
  );
};
