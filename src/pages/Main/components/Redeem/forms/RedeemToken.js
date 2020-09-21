import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Typography } from "antd";
import ReactGA from "react-ga";

import { validator } from "utils/validators";
import { generateLink } from "utils/generateLink";
import { $get_exchange_result } from "helpers/bonded";
import config from "config";

const { useForm } = Form;
const { Text } = Typography;

export const RedeemToken = ({
  address,
  activeWallet,
  stable_state,
  reservePrice,
  symbol,
  type,
  actualParams,
  p2,
  oraclePrice,
}) => {
  const asset = stable_state && stable_state["asset" + type];
  const decimals = actualParams && actualParams["decimals" + type];
  const reserve_asset_decimals =
    actualParams && actualParams.reserve_asset_decimals;
  const reserve_asset = actualParams && actualParams.reserve_asset;
  const [valid, setValid] = useState(undefined);
  const [exchange, setExchange] = useState(undefined);
  const buttonRef = useRef(null);
  const [tokens, setTokens] = useState(undefined);
  const [form] = useForm();
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
      actualParams &&
      $get_exchange_result({
        tokens1: type === 1 ? -(tokens * 10 ** decimals) : 0,
        tokens2: type === 2 ? -(tokens * 10 ** decimals) : 0,
        params: actualParams,
        vars: stable_state,
        oracle_price: oraclePrice,
        timestamp: Math.floor(Date.now() / 1000),
        reservePrice,
      });

    setExchange(get_exchange_result);
  }, [getFieldsValue, tokens, activeWallet, address, asset, decimals, valid]);

  const link = generateLink(
    Number(tokens).toFixed(decimals) * 10 ** decimals,
    {},
    activeWallet,
    address,
    encodeURIComponent(asset)
  );

  let extra;
  if (
    exchange !== undefined &&
    exchange !== null &&
    valid &&
    tokens !== "" &&
    exchange.payout > 0
  ) {
    extra = `You will get ${(
      exchange.payout /
      10 ** reserve_asset_decimals
    ).toFixed(reserve_asset_decimals)} ${
      config.reserves[reserve_asset] ? config.reserves[reserve_asset].name : ""
    } `;
  } else if (exchange && exchange.payout < 0) {
    extra =
      "The transaction would change the price too much, please try a smaller amount";
  } else {
    extra = undefined;
  }
  const priceChange =
    exchange && "p2" in exchange ? 1 / exchange.p2 - 1 / p2 : 0;

  const priceChangePercent =
    exchange && "p2" in exchange
      ? ((1 / exchange.p2 - 1 / p2) / (1 / p2)) * 100
      : 0;
  const changeFinalPriceProcent =
    exchange && exchange !== undefined && "p2" in exchange
      ? ((1 / exchange.p2 - 1 / exchange.target_p2) /
          (1 / exchange.target_p2)) *
        100
      : 0;

  return (
    <Form
      form={form}
      onValuesChange={(store) => {
        setTokens(store["r_tokens" + type]);
      }}
      size="large"
    >
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
                minValue: 0,
                maxDecimals: decimals,
              }),
          },
        ]}
      >
        <Input.Search
          placeholder={`Amount of tokens${type} (${symbol || asset})`}
          autoComplete="off"
          style={{ marginBottom: 0 }}
          onKeyPress={(ev) => {
            if (ev.key === "Enter") {
              if (valid && exchange !== null) {
                buttonRef.current.click();
              }
            }
          }}
          onSearch={() => {
            ReactGA.event({
              category: "Stablecoin",
              action: "Redeem token" + type,
            });
            setTimeout(() => {
              resetFields();
              setExchange(null);
            }, 100);
          }}
          enterButton={
            <Button
              type="primary"
              ref={buttonRef}
              disabled={
                !valid || exchange === null || (exchange && exchange.payout < 0)
              }
              href={link}
            >
              Redeem
            </Button>
          }
        />
      </Form.Item>
      {exchange !== undefined &&
      exchange !== null &&
      valid &&
      tokens !== "" &&
      priceChange &&
      exchange.payout > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <Text type="secondary" style={{ display: "block" }}>
            <b>Fee: </b>
            {"fee_percent" in exchange
              ? exchange.fee_percent.toFixed(4) + "%"
              : "0%"}
          </Text>
          <Text type="secondary" style={{ display: "block" }}>
            <b>Reward: </b>
            {"reward_percent" in exchange
              ? exchange.reward_percent.toFixed(4) + "%"
              : "0%"}
          </Text>
          {exchange && "p2" in exchange && (
            <Text type="secondary" style={{ display: "block" }}>
              <b>Price change: </b>
              {priceChange > 0 ? "+" : ""}
              {priceChange.toFixed(reserve_asset_decimals) || "0"} (
              {priceChangePercent > 0 ? "+" : ""}
              {priceChangePercent.toFixed(2)}%)
            </Text>
          )}

          <Text type="secondary" style={{ display: "block" }}>
            <b>Final price: </b>
            {(1 / exchange.p2).toFixed(reserve_asset_decimals) || "0"} (
            {Math.abs(changeFinalPriceProcent).toFixed(2)}%{" "}
            {changeFinalPriceProcent > 0 ? "above" : "below"} the target)
          </Text>
        </div>
      ) : (
        <div />
      )}
    </Form>
  );
};
