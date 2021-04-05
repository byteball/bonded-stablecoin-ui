import React, { useState, useEffect } from "react";
import { Form, Input, Typography, Checkbox, Row, Space } from "antd";
import { useSelector } from "react-redux";
import ReactGA from "react-ga";
import { useTranslation } from 'react-i18next';

import { validator } from "utils/validators";
import { $get_exchange_result } from "helpers/bonded";
import { generateLink } from "utils/generateLink";
import { getParams } from "helpers/getParams";
import config from "config";
import styles from "./Issue.module.css";
import { QRButton } from "components/QRButton/QRButton";
import { useWindowSize } from "hooks/useWindowSize";

const { Title, Text } = Typography;
const { useForm } = Form;

export const Issue = () => {
  const {
    address,
    params,
    bonded_state,
    deposit_aa,
    symbol1,
    symbol2,
    symbol3,
    reservePrice,
    oraclePrice,
    reserve_asset_symbol
  } = useSelector((state) => state.active);

  const [validFields, setValidFields] = useState({
    tokens1: undefined,
    tokens2: undefined,
  });
  const { activeWallet, referrer } = useSelector((state) => state.settings);
  const [form] = useForm();
  const [tokens1, setTokens1] = useState(undefined);
  const [tokens2, setTokens2] = useState(undefined);
  const [convert, setConvert] = useState(false);
  const [enableHelp, setEnableHelp] = useState(false);
  const { t } = useTranslation();
  const reserve = bonded_state.reserve;
  const [amount, setAmount] = useState(undefined);
  const [width] = useWindowSize();
  let isActiveIssue = false;

  if (reserve) {
    if (Number(tokens1) && tokens1 && Number(tokens2) && tokens2) {
      isActiveIssue = validFields.tokens1 && validFields.tokens2;
    } else if (tokens1 && Number(tokens1)) {
      isActiveIssue = validFields.tokens1;
    } else if (tokens2 && Number(tokens2)) {
      isActiveIssue = validFields.tokens2;
    }
  } else {
    isActiveIssue =
      Number(tokens1) &&
      validFields.tokens1 &&
      Number(tokens2) &&
      validFields.tokens2;
  }

  const validateValue = (params) =>
    validator({
      ...params,
      onSuccess: () => setValidFields((v) => ({ ...v, [params.name]: true })),
      onError: () => setValidFields((v) => ({ ...v, [params.name]: false })),
    });

  const { setFieldsValue, resetFields } = form;
  const actualParams = getParams(params, bonded_state);

  useEffect(() => {
    const get_exchange_result = $get_exchange_result({
      tokens1: tokens1 * 10 ** actualParams.decimals1 || 0,
      tokens2: tokens2 * 10 ** actualParams.decimals2 || 0,
      params: actualParams,
      vars: bonded_state,
      oracle_price: oraclePrice,
      timestamp: Math.floor(Date.now() / 1000),
      reservePrice,
    });

    if (enableHelp || !reserve) {
      if (tokens2 !== 0 && tokens2 !== undefined) {
        setFieldsValue({
          tokens1: Number(get_exchange_result.s1init).toFixed(
            actualParams.decimals1
          ),
        });

        setTokens1(
          Number(get_exchange_result.s1init).toFixed(actualParams.decimals1)
        );
        setValidFields((v) => ({ ...v, tokens1: true }));
      }
    }

    setAmount(get_exchange_result);
  }, [
    tokens1,
    tokens2,
    reserve,
    isActiveIssue,
    setFieldsValue,
    oraclePrice,
    params,
    bonded_state,
    reservePrice,
  ]);

  let link = "";
  try {
    link =
      amount !== undefined && amount.reserve_needed !== undefined
        ? generateLink(
          Math.ceil(amount.reserve_needed * 1.01 + 1000),
          {
            tokens1: Math.round(tokens1 * 10 ** params.decimals1) || undefined,
            tokens2: Math.round(tokens2 * 10 ** params.decimals2) || undefined,
            tokens2_to: convert ? deposit_aa : undefined,
            ref: referrer
          },
          activeWallet,
          address,
          actualParams.reserve_asset,
          convert ? true : false
        )
        : "";
  } catch { }

  useEffect(() => {
    resetFields();
    setValidFields((v) => ({ ...v, tokens1: false }));
    setValidFields((v) => ({ ...v, tokens2: false }));
    setEnableHelp(false);
    setAmount(undefined);
    setTokens1(undefined);
    setTokens2(undefined);
  }, [address, resetFields]);

  let bPriceInversed = false;
  if ("oracles" in actualParams) {
    if (actualParams.oracles[0].op === "*" && !actualParams.leverage)
      bPriceInversed = true;
  } else {
    if (actualParams.op1 === "*" && !actualParams.leverage)
      bPriceInversed = true;
  }

  const new_p2 = amount !== undefined ? (bPriceInversed ? 1 / amount.p2 : amount.p2) : undefined;
  const old_p2 = bPriceInversed ? 1 / bonded_state.p2 : bonded_state.p2;
  const t_p2 = amount !== undefined ? (bPriceInversed ? 1 / amount.target_p2 : amount.target_p2) : undefined;

  const priceChange =
    amount !== undefined && new_p2 - (old_p2 || 0);
  const changePricePercent = (priceChange / old_p2 || 0) * 100;
  const changeFinalPricePercent =
    amount !== undefined && amount.target_p2
      ? ((new_p2 - t_p2) / t_p2) * 100
      : 0;

  const f = (x) => (~(x + "").indexOf(".") ? (x + "").split(".")[1].length : 0);

  const p2Pair = (!bPriceInversed ? (symbol2 || "T2") + "/" + (reserve_asset_symbol || "RESERVE") : (reserve_asset_symbol || "RESERVE") + "/" + (symbol2 || "T2"));
  const p1Pair = ((symbol1 || "T1") + "/" + (reserve_asset_symbol || "RESERVE"));

  const priceChangeP1 = amount !== undefined && amount.p1 - amount.old_p1;
  const priceChangePercentP1 = amount !== undefined && ((priceChangeP1 / amount.old_p1 || 0) * 100);

  return (
    <>
      <Row justify="space-between" align="middle">
        <Title level={3}>{t("trade.tabs.buy_redeem.title_buy", "Buy tokens")}</Title>
      </Row>
      {!reserve && (
        <p>
          <Text type="secondary">
            {t("trade.tabs.buy_redeem.first", "You are the first to buy tokens of this stablecoin, so you should buy token 1 and token 2 at the same time.")}
          </Text>
        </p>
      )}
      <p>
        <Text type="secondary">
          {t("trade.tabs.buy_redeem.subtitle_buy", "How many tokens of each type you want to buy")}
        </Text>
      </p>
      <Form
        form={form}
        onValuesChange={(value, store) => {
          if ("tokens1" in value) {
            if (f(value.tokens1) <= actualParams.decimals1) {
              setTokens1(value.tokens1);
            }
          } else if ("tokens2" in value) {
            if (f(value.tokens2) <= actualParams.decimals2) {
              setTokens2(value.tokens2);
            }
          }
        }}
        size="large"
        style={{ marginBottom: 20 }}
      >
        <Form.Item
          name="tokens1"
          extra={reserve && (
            <Checkbox
              checked={enableHelp}
              onChange={(e) => {
                setEnableHelp(e.target.checked);
                if (!enableHelp && amount) {
                  setTokens1(
                    Number(amount.s1init).toFixed(actualParams.decimals1)
                  );
                  setFieldsValue({
                    tokens1: Number(amount.s1init).toFixed(
                      actualParams.decimals1
                    ),
                  });
                }
              }}
            >
              {t("trade.tabs.buy_redeem.minimize", "Set token1 amount to minimize fees")}
            </Checkbox>
          )}
          rules={[
            {
              validator: (rule, value) =>
                validateValue({
                  value,
                  name: "tokens1",
                  type: "number",
                  minValue: reserve === undefined ? 0 : undefined,
                  maxDecimals: actualParams.decimals1,
                }),
            },
          ]}
        >
          <Input
            placeholder={t("trade.tabs.buy_redeem.amount1_placeholder", "Amount of tokens1 ({{symbolOrAsset}} — growth tokens)", { symbolOrAsset: symbol1 || bonded_state.asset1 })}
            autoComplete="off"
            suffix={
              <span style={{ color: "#ccc" }}>
                {amount !== undefined &&
                  "≈ " +
                  amount.amountTokens1InCurrency.toFixed(2) +
                  " " +
                  (config.reserves[actualParams.reserve_asset]
                    ? (reservePrice
                      ? config.reserves[actualParams.reserve_asset].feedCurrency
                      : config.reserves[actualParams.reserve_asset].name)
                    : reserve_asset_symbol || "")}
              </span>
            }
            disabled={enableHelp || !reserve}
          />
        </Form.Item>
        <Form.Item
          name="tokens2"
          extra={params.interest_rate !== 0 && (
            <Checkbox
              checked={convert}
              onChange={(e) => setConvert(e.target.checked)}
            > {t("trade.tabs.buy_redeem.convert", "Immediately convert {{symbol2}} to stable token {{symbol3}}", { symbol2: symbol2 || "T2", symbol3: symbol3 || "T3" })}
              {Number(tokens2) && amount ? <span> ({t("trade.tabs.buy_redeem.issue_will_receive", "will send the {{symbol2}} to a deposit and receive {{amount}} {{symbol}}", { amount: Number(tokens2 * amount.growth_factor).toFixed(params.decimals2), symbol: symbol3 || "stable tokens", symbol2: symbol2 || "T2" })})</span> : <span> {t("trade.tabs.buy_redeem.issue_will_open_deposit", "(will open a deposit)")}</span>}
            </Checkbox>
          )}
          rules={[
            {
              validator: (rule, value) =>
                validateValue({
                  value,
                  name: "tokens2",
                  type: "number",
                  maxDecimals: actualParams.decimals2,
                }),
            },
          ]}
        >
          <Input
            suffix={
              <span style={{ color: "#ccc" }}>
                {amount !== undefined &&
                  "≈ " +
                  amount.amountTokens2InCurrency.toFixed(2) +
                  " " +
                  (config.reserves[actualParams.reserve_asset]
                    ? (reservePrice
                      ? config.reserves[actualParams.reserve_asset].feedCurrency
                      : config.reserves[actualParams.reserve_asset].name)
                    : reserve_asset_symbol || "")}
              </span>
            }
            placeholder={t("trade.tabs.buy_redeem.amount2_placeholder", "Amount of tokens2 ({{symbolOrAsset}} — interest tokens)", { symbolOrAsset: symbol2 || bonded_state.asset2 })}
            autoComplete="off"
          />
        </Form.Item>
        <>
          <Text type="secondary" style={{ display: "block" }}>
            <b>{t("trade.tabs.buy_redeem.fee", "Fee")}:</b>{" "}
            {(amount &&
              amount !== undefined &&
              amount.fee !== 0 &&
              amount.fee_percent !== Infinity &&
              (tokens1 || tokens2)) ?
              <>
                <span style={(amount.fee_percent > 1) ? ((amount.fee_percent > 3) ? { color: "red" } : { color: "orange" }) : { color: "inherit" }}>
                  {Number(amount.fee_percent).toFixed(2) || 0}%
                </span>
              </> : "0%"}
          </Text>
          <Text type="secondary" style={{ display: "block" }}>
            <b>{t("trade.tabs.buy_redeem.reward", "Reward")}:</b>{" "}
            <span style={amount && amount.reward_percent > 0 ? { color: "green" } : { color: "inherit" }}>
              {(amount &&
                amount !== undefined &&
                amount.reward !== 0 &&
                (tokens1 || tokens2) &&
                !isNaN(amount.reward_percent) &&
                Number(amount.reward_percent).toFixed(2)) ||
                0}
            %
            </span>
          </Text>

          <Text
            type="secondary"
            className={styles.label}
            style={{ marginBottom: reserve ? 0 : 20 }}
          >
            <b>{"p2" in bonded_state ? t("trade.tabs.buy_redeem.price_change", "{{pair}} price change", { pair: p2Pair }) + ": " : t("trade.tabs.buy_redeem.price", "{{pair}} price", { pair: p2Pair }) + ": "}</b>
            {isActiveIssue && amount !== undefined ? (
              <>
                {priceChange > 0 ? "+" : ""}
                {priceChange.toFixed(4)}
                {"p2" in bonded_state &&
                  " (" +
                  (changePricePercent > 0 ? "+" : "") +
                  changePricePercent.toFixed(2) +
                  "%)"}
              </>
            ) : (
                " - "
              )}
          </Text>

          {reserve && (
            <Text type="secondary">
              <b>{t("trade.tabs.buy_redeem.final_price", "Final {{pair}} price", { pair: p2Pair })}:</b>{" "}
              {(amount &&
                amount !== undefined &&
                (Number(tokens1) || Number(tokens2)) &&
                Number(new_p2).toFixed(
                  actualParams.reserve_asset_decimals
                ) + (changeFinalPricePercent ?
                  ` (${Math.abs(changeFinalPricePercent).toFixed(2)}% ${changeFinalPricePercent > 0 ? t("trade.tabs.buy_redeem.above_target", "above the target") : t("trade.tabs.buy_redeem.below_target", "below the target")})` : "")) || "-"}
            </Text>
          )}
        </>

        {"p2" in bonded_state && <Text
          type="secondary"
          className={styles.label}
          style={{ marginBottom: 20 }}
        >
          <b>{t("trade.tabs.buy_redeem.price_change", "{{pair}} price change", { pair: p1Pair }) + ": "}</b>
          {isActiveIssue && amount !== undefined ? (
            <>
              {priceChangeP1 > 0 ? "+" : ""}
              {priceChangeP1.toFixed(4)}
              {"p2" in bonded_state &&
                " (" +
                (priceChangePercentP1 > 0 ? "+" : "") +
                priceChangePercentP1.toFixed(2) +
                "%)"}
            </>
          ) : (
              " - "
            )}
        </Text>}
        
        {(isActiveIssue === undefined || !isActiveIssue) && (
          <QRButton disabled={true}>{t("trade.tabs.buy_redeem.send", "Send")}</QRButton>
        )}
        {amount && isActiveIssue !== undefined && isActiveIssue ? (
          <>
            <Space direction={width < 420 ? "vertical" : "horizontal"}>
              <QRButton
                type="primary"
                href={link}
                onClick={() => {
                  ReactGA.event({
                    category: "Stablecoin",
                    action: "Issue",
                  });
                }}
                disabled={
                  ((Number(tokens1) === 0 || tokens1 === undefined) &&
                    (Number(tokens2) === 0 || tokens2 === undefined)) ||
                  !isActiveIssue
                }
              >
                {t("trade.tabs.buy_redeem.send", "Send")}{" "}
                {Number(
                  (amount.reserve_needed * 1.01) /
                  10 ** params.reserve_asset_decimals
                ).toFixed(params.reserve_asset_decimals)}{" "}
                {params.reserve_asset === "base"
                  ? " GB"
                  : config.reserves[actualParams.reserve_asset]
                    ? config.reserves[actualParams.reserve_asset].name
                    : reserve_asset_symbol || ""}
              </QRButton>
              {isActiveIssue && (
                <div>
                  ≈ {amount.reserve_needed_in_сurrency.toFixed(2)}{" "}
                  {config.reserves[actualParams.reserve_asset]
                    ? (reservePrice
                      ? config.reserves[actualParams.reserve_asset].feedCurrency
                      : config.reserves[actualParams.reserve_asset].name)
                    : reserve_asset_symbol || ""}
                </div>
              )}
            </Space>
            <div>
              <Text type="secondary" style={{ fontSize: 10 }}>
                {t("trade.tabs.buy_redeem.protect", "1% was added to protect against price volatility, you'll get this amount back if the prices don't change.")}
              </Text>
            </div>
          </>
        ) : null}
      </Form>
    </>
  );
};
