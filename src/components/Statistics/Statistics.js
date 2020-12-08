import React, { useState, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import { useSelector } from "react-redux";
import { useTranslation, Trans } from 'react-i18next';
import { Label } from "components/Label/Label";
import { ShowDecimalsValue } from "components/ShowDecimalsValue/ShowDecimalsValue";

import { $get_target_p2 } from "helpers/bonded";
import { getParams } from "helpers/getParams";

import config from "config";
import styles from "./Statistics.module.css";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const Statistics = ({ windowWidth }) => {
  const {
    address,
    stable_state,
    params,
    oraclePrice,
    deposit_state,
    symbol1,
    symbol2,
    symbol3,
    reserve_asset_symbol
  } = useSelector((state) => state.active);
  const actualParams = getParams(params, stable_state);
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [showBlock, setShowBlock] = useState(false);
  const { t } = useTranslation();
  const { supply1, supply2 } = stable_state;
  const { decimals1, decimals2, reserve_asset } = actualParams;
  const { supply } = deposit_state;
  const s1 = supply1 / 10 ** decimals1;
  const s2 = supply2 / 10 ** decimals2;
  const p1 =
    params.m *
    s1 ** (params.m - 1) *
    s2 ** params.n *
    stable_state.dilution_factor;

  const target_p2 =
    oraclePrice &&
    $get_target_p2(
      oraclePrice,
      actualParams.leverage,
      actualParams.interest_rate,
      timestamp,
      stable_state.rate_update_ts,
      stable_state.growth_factor
    );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [address]);

  if (!address) return null;
  let currentPrice = 0;
  let targetPrice = 0;

  if ("p2" in stable_state) {
    if ("oracles" in actualParams) {
      if (actualParams.oracles[0].op === "*" && !actualParams.leverage) {
        currentPrice = 1 / stable_state.p2;
      } else {
        currentPrice = stable_state.p2;
      }
    } else {
      if (actualParams.op1 === "*" && !actualParams.leverage) {
        currentPrice = 1 / stable_state.p2;
      } else {
        currentPrice = stable_state.p2;
      }
    }
  }

  let bPriceInversed = false;
  if ("oracles" in actualParams) {
    if (actualParams.oracles[0].op === "*" && !actualParams.leverage) {
      bPriceInversed = true;
      targetPrice = 1 / target_p2;
    } else {
      targetPrice = target_p2;
    }
  } else {
    if (actualParams.op1 === "*" && !actualParams.leverage) {
      bPriceInversed = true;
      targetPrice = 1 / target_p2;
    } else {
      targetPrice = target_p2;
    }
  }

  const displayOraclePrice = (bPriceInversed || actualParams.leverage) ? oraclePrice : 1 / oraclePrice;
  const reserve_symbol = reserve_asset in config.reserves ? config.reserves[reserve_asset].name : reserve_asset_symbol || "";
  const p2UnitsText = bPriceInversed 
  ? t("trade.statistic.p2UnitsText.inversed", `The shown price is the price of the reserve asset ${reserve_symbol || ''} in terms of Token2 (${symbol2 || stable_state.asset2}).`, {reserveSymbolOrAsset: reserve_symbol || '', symbol2orAsset: symbol2 || stable_state.asset2}) 
  : t("trade.statistic.p2UnitsText.inversed",`The shown price is the price of Token2 (${symbol2 || stable_state.asset2}) in terms of the reserve asset ${reserve_symbol || ''}.`, {symbol2OrAsset: symbol2 || stable_state.asset2, reserveSymbol: reserve_symbol || ''});
  const p2Unit = bPriceInversed ? symbol2 : reserve_symbol;

  const currentPriceDifference = stable_state.p2
    ? (currentPrice - targetPrice) / targetPrice
    : 0;

  const statisticsData = [
    {
      title: t("trade.statistic.token1_supply.name", "Tokens1 supply"),
      currency: symbol1,
      descr: t("trade.statistic.token1_supply.desc", "Total supply of Token1 (growth tokens)"),
      value: supply1 || 0,
      decimals: decimals1,
    },
    {
      title: t("trade.statistic.token2_supply.name", "Tokens2 supply"),
      currency: symbol2,
      descr: t("trade.statistic.token1_supply.desc", "Total supply of Token2 (interest tokens)"),
      value: supply2 || 0,
      decimals: decimals2,
    },
    {
      title: t("trade.statistic.token_stable_supply.name", "Stable tokens supply"),
      currency: symbol3,
      descr: t("trade.statistic.token_stable_supply.desc", "Total supply of the stable tokens"),
      value: supply || 0,
      decimals: decimals2,
    },
    {
      title: t("trade.statistic.reserve.name", "Reserve"),
      descr: t("trade.statistic.reserve.desc", "Total amount of reserve locked to back the issuance of T1 and T2 tokens"),
      value: "reserve" in stable_state ? stable_state.reserve : 0,
      decimals: actualParams.reserve_asset_decimals,
      currency:
        reserve_asset in config.reserves ? config.reserves[reserve_asset].name : reserve_asset_symbol || '',
    },
    {
      title: t("trade.statistic.token1_price.name", `${symbol1 || 'T1'} price`, {symbol1: symbol1 || "T1"}),
      descr: t("trade.statistic.token1_price.desc", "The current price of Token1 according to the bonding curve. It depends on the supplies of Token1 and Token2. The price is shown in terms of the reserve currency."),
      value: p1 || 0,
      precision: 6,
      currency: reserve_asset in config.reserves ? config.reserves[reserve_asset].name : reserve_asset_symbol || "",
    },
    {
      title: t("trade.statistic.current_price.name", "Current price"),
      descr: t("trade.statistic.current_price.desc", "The current price according to the bonding curve. It depends on the supplies of Token1 and Token2. ") + " " + p2UnitsText,
      value: currentPrice,
      precision: 9,
      percent: currentPriceDifference,
    },
    {
      title: t("trade.statistic.target_price.name", "Target price"),
      descr: t("trade.statistic.target_price.desc", "The price Token2 is pegged to. It is the oracle price plus interest. ") + " " + p2UnitsText,
      value: targetPrice,
      precision: 9,
      currency: p2Unit,
    },
    {
      title: t("trade.statistic.oracle_price.name", "Oracle price"),
      descr: t("trade.statistic.oracle_price.desc", "Latest price reported by the oracle"),
      value: displayOraclePrice,
      precision: 9,
    },
  ];

  const rowStyle = !showBlock && windowWidth <= 640 ? {
    height: 40,
    opacity: 0.3,
    overflow: "hidden",
    paddingBottom: 0
  } : {  marginBottom: -15 }

  return (
    <div
      style={{
        marginBottom: 20,
        background: "#fff",
        padding: 20,
        display: "block",
        boxSizing: "border-box",
        paddingBottom: !showBlock && windowWidth <= 640 ? 0 : 20
      }}
    >
      <Row justify="start" style={rowStyle}>
        {statisticsData.map((s, i) => (
          <Col
            xs={{ span: 20 }}
            sm={{ span: 12 }}
            lg={{ span: 6, offset: 0 }}
            style={{ marginBottom: 15 }}
            key={"stat-" + i}
          >
            <div className={styles.statisticsItem}>
              <Text type="secondary">
                <Label label={s.title} descr={s.descr} />
              </Text>
              <div style={{ marginTop: 3 }}>
                <span style={{ fontSize: 18 }}>
                  {s.decimals ? (
                    <ShowDecimalsValue
                      value={Number(s.value)}
                      decimals={s.decimals}
                    />
                  ) : (
                      s.precision ? Number(s.value).toPrecision(s.precision) : Number(s.value).toFixed(9)
                    )}{" "}
                  <span style={{ fontSize: 12, fontWeight: "normal" }}>
                    {s.currency}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: "normal",
                    }}
                  >
                    {"percent" in s &&
                      "(" +
                      (s.percent > 0 ? "+" : "") +
                      (s.percent * 100).toFixed(4) +
                      "%)"}
                  </span>
                </span>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      {windowWidth <= 640 && !showBlock && <div 
        onClick={()=>setShowBlock(true)}
        style={{paddingTop: 10, paddingBottom: 10, textAlign: "center", cursor: "pointer"}}
        >
          <Trans defaults="Show info" i18nKey="trade.statistic.show" /> <DownOutlined/>
        </div>}
      {windowWidth <= 640 && showBlock && <div 
        onClick={()=>setShowBlock(false)}
        style={{paddingTop: 10, textAlign: "center", cursor: "pointer"}}
        >
          <Trans defaults="Hide info" i18nKey="trade.statistic.hide" /> <UpOutlined/>
      </div>}
    </div>
  );
};
