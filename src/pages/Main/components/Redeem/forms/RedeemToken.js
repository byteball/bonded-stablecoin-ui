import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Typography, Col, Row } from "antd";
import ReactGA from "react-ga";
import { useTranslation } from 'react-i18next';

import { validator } from "utils/validators";
import { generateLink } from "utils/generateLink";
import { $get_exchange_result } from "helpers/bonded";
import config from "config";
import styles from "./RedeemToken.module.css";
import { QRButton } from "components/QRButton/QRButton";

const { useForm } = Form;
const { Text } = Typography;

export const RedeemToken = ({
  address,
  activeWallet,
  bonded_state,
  reserve_asset_symbol,
  reservePrice,
  symbol1,
  symbol2,
  symbol,
  type,
  actualParams,
  p2,
  oraclePrice,
  supply
}) => {
  const asset = bonded_state && bonded_state["asset" + type];
  const decimals = actualParams && actualParams["decimals" + type];
  const reserve_asset_decimals =
    actualParams && actualParams.reserve_asset_decimals;
  const reserve_asset = actualParams && actualParams.reserve_asset;
  const [valid, setValid] = useState(undefined);
  const [exchange, setExchange] = useState(undefined);
  const buttonRef = useRef(null);
  const [tokens, setTokens] = useState(undefined);
  const [form] = useForm();
  const { t } = useTranslation();
  const { getFieldsValue, resetFields } = form;

  const validateValue = (params) => {
    return validator({
      ...params,
      onSuccess: () => setValid(true),
      onError: () => setValid(false),
    });
  };

  useEffect(() => {
    resetFields();
    setValid(undefined);
  }, [address, resetFields]);

  useEffect(() => {
    const get_exchange_result =
      actualParams && Number(tokens) &&
      $get_exchange_result({
        tokens1: type === 1 && tokens ? -(tokens * 10 ** decimals) : 0,
        tokens2: type === 2 && tokens ? -(tokens * 10 ** decimals) : 0,
        params: actualParams,
        vars: bonded_state,
        oracle_price: oraclePrice,
        timestamp: Math.floor(Date.now() / 1000),
        reservePrice,
      });

    setExchange(get_exchange_result);
  }, [getFieldsValue, tokens, activeWallet, address, asset, decimals, valid, bonded_state]);

  const link = generateLink(
    Math.trunc(Number(tokens).toFixed(decimals) * 10 ** decimals),
    { max_fee_percent: exchange && exchange.fee_percent + 1 },
    activeWallet,
    address,
    asset
  );

  let extra;
  if (
    exchange !== undefined &&
    exchange !== null &&
    valid &&
    tokens !== "" &&
    exchange.payout > 0
  ) {
    extra = t("trade.tabs.buy_redeem.redeem_will_receive", "You will get {{amount}} {{symbol}}", { amount: (exchange.payout / 10 ** reserve_asset_decimals).toFixed(reserve_asset_decimals), symbol: config.reserves[reserve_asset] ? config.reserves[reserve_asset].name : reserve_asset_symbol || '' });
  } else if (exchange && exchange.payout < 0) {
    extra = t("trade.tabs.buy_redeem.big_change", "The transaction would change the price too much, please try a smaller amount");
  } else {
    extra = undefined;
  }

  let bPriceInversed = false;
  if ("oracles" in actualParams) {
    if (actualParams.oracles[0].op === "*" && !actualParams.leverage)
      bPriceInversed = true;
  } else {
    if (actualParams.op1 === "*" && !actualParams.leverage)
      bPriceInversed = true;
  }

  const new_p2 = exchange ? (bPriceInversed ? 1 / exchange.p2 : exchange.p2) : undefined;
  const old_p2 = bPriceInversed ? 1 / p2 : p2;
  const t_p2 = exchange && exchange.target_p2 ? (bPriceInversed ? 1 / exchange.target_p2 : exchange.target_p2) : undefined;

  const priceChange =
    exchange && "p2" in exchange ? new_p2 - old_p2 : 0;

  const priceChangePercent =
    exchange && "p2" in exchange
      ? ((new_p2 - old_p2) / old_p2) * 100
      : 0;
  const changeFinalPricePercent =
    exchange && t_p2 && "p2" in exchange
      ? ((new_p2 - t_p2) /
        t_p2) *
      100
      : 0;

  const p2Pair = (!bPriceInversed ? (symbol2 || "T2") + "/" + (reserve_asset_symbol || "RESERVE") : (reserve_asset_symbol || "RESERVE") + "/" + (symbol2 || "T2"));
  const p1Pair = ((symbol1 || "T1") + "/" + (reserve_asset_symbol || "RESERVE"));

  const priceChangeP1 = exchange !== undefined && exchange.p1 - exchange.old_p1;
  const priceChangePercentP1 = exchange !== undefined && ((priceChangeP1 / exchange.old_p1 || 0) * 100);

  return (
    <Form
      form={form}
      onValuesChange={(store) => {
        setTokens(store["r_tokens" + type]);
      }}
      size="large"
    >
      <Form.Item>
        <Row gutter={10} wrap={false}>
          <Col flex="auto">
            <Form.Item
              name={`r_tokens${type}`}
              extra={extra}
              rules={[
                {
                  validator: (rule, value) =>
                    validateValue({
                      value,
                      name: "r_tokens",
                      type: "number",
                      minValue: Number(1 / 10 ** decimals).toFixed(decimals),
                      maxDecimals: decimals,
                      maxValue: supply
                    }),
                },
              ]}
            >
              <Input
                placeholder={t(`trade.tabs.buy_redeem.amount${type}_placeholder`, `Amount of tokens${type} ({{symbolOrAsset}} — ${type === 1 ? "growth" : "interest"} tokens)`, { symbolOrAsset: symbol || asset })}
                autoComplete="off"
                style={{ marginBottom: 0 }}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    if (valid && exchange !== null) {
                      buttonRef.current.click();
                    }
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col>
            <QRButton
              type="primary"
              ref={buttonRef}
              disabled={
                !valid || exchange === null || (exchange && exchange.payout < 0) || tokens > supply
              }
              href={link}
              onClick={() => {
                ReactGA.event({
                  category: "Stablecoin",
                  action: "Redeem token" + type,
                });
              }}
            >
              {t("trade.tabs.buy_redeem.redeem", "Redeem")}
            </QRButton>
          </Col>
        </Row>
      </Form.Item>

      {exchange !== undefined &&
        exchange !== null &&
        valid &&
        tokens !== "" &&
        exchange.payout > 0 ? (
          <div style={{ marginBottom: 20 }}>
            <Text type="secondary" style={{ display: "block" }}>
              <b>{t("trade.tabs.buy_redeem.fee", "Fee")}: </b>
              {"fee_percent" in exchange
                ? <span style={(exchange.fee_percent > 1) ? ((exchange.fee_percent > 3) ? { color: "red" } : { color: "orange" }) : { color: "inherit" }}>
                  {exchange.fee_percent.toFixed(4) + "%"}
                </span>
                : "0%"}
            </Text>
            <Text type="secondary" style={{ display: "block" }}>
              <b>{t("trade.tabs.buy_redeem.reward", "Reward")}: </b>
              {"reward_percent" in exchange
                ? <span style={exchange && exchange.reward_percent > 0 ? { color: "green" } : { color: "inherit" }}>{exchange.reward_percent.toFixed(4) + "%"}</span>
                : "0%"}
            </Text>

            {exchange && "p2" in exchange && (
              <Text type="secondary" className={styles.label}>
                <b>{t("trade.tabs.buy_redeem.price_change", "{{pair}} price change", { pair: p2Pair })}: </b>
                {priceChange > 0 ? "+" : ""}
                {priceChange.toFixed(reserve_asset_decimals) || "0"} (
                {priceChangePercent > 0 ? "+" : ""}
                {priceChangePercent.toFixed(2)}%)
              </Text>
            )}

            <Text type="secondary" style={{ display: "block" }}>
              <b>{t("trade.tabs.buy_redeem.final_price", "Final {{pair}} price", { pair: p2Pair })}: </b>
              {new_p2.toFixed(reserve_asset_decimals) || "0"} {t_p2 && <span>(
            {Math.abs(changeFinalPricePercent).toFixed(2)}%{" "}
                {changeFinalPricePercent > 0 ? t("trade.tabs.buy_redeem.above_target", "above the target") : t("trade.tabs.buy_redeem.below_target", "below the target")})</span>}
            </Text>

            {exchange && "p1" in exchange && (
              <Text type="secondary" className={styles.label}>
                <b>{t("trade.tabs.buy_redeem.price_change", "{{pair}} price change", { pair: p1Pair })}: </b>
                {priceChangeP1 > 0 ? "+" : ""}
                {priceChangeP1.toFixed(reserve_asset_decimals) || "0"} (
                {priceChangePercentP1 > 0 ? "+" : ""}
                {priceChangePercentP1.toFixed(2)}%)
              </Text>
            )}

          </div>
        ) : (
          <div />
        )}
    </Form>
  );
};
