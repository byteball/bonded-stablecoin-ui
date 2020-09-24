import React, { useState, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import { useSelector } from "react-redux";
import { Label } from "components/Label/Label";
import { ShowDecimalsValue } from "components/ShowDecimalsValue/ShowDecimalsValue";

import { $get_target_p2 } from "helpers/bonded";
import { getParams } from "helpers/getParams";

import config from "config";
import styles from "./Statistics.module.css";

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
  } = useSelector((state) => state.active);
  const actualParams = getParams(params, stable_state);
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
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
      if (actualParams.oracles[0].op === "*") {
        currentPrice = 1 / stable_state.p2;
      } else {
        currentPrice = stable_state.p2;
      }
    } else {
      if (actualParams.op1 === "*") {
        currentPrice = 1 / stable_state.p2;
      } else {
        currentPrice = stable_state.p2;
      }
    }
  }

  let bPriceInversed = false;
  if ("oracles" in actualParams) {
    if (actualParams.oracles[0].op === "*") {
      bPriceInversed = true;
      targetPrice = 1 / target_p2;
    } else {
      targetPrice = target_p2;
    }
  } else {
    if (actualParams.op1 === "*") {
      bPriceInversed = true;
      targetPrice = 1 / target_p2;
    } else {
      targetPrice = target_p2;
    }
  }

  const reserve_symbol = reserve_asset in config.reserves && config.reserves[reserve_asset].name;
  const p2UnitsText = bPriceInversed ? `The shown price is the price of the reserve asset ${reserve_symbol || ''} in terms of Token2 (${symbol2 || stable_state.asset2}).` : `The shown price is the price of Token2 (${symbol2 || stable_state.asset2}) in terms of the reserve asset ${reserve_symbol || ''}.`;

  const currentPriceDifference = stable_state.p2
    ? (currentPrice - targetPrice) / targetPrice
    : 0;

  const statisticsData = [
    {
      title: "Tokens1 supply",
      currency: symbol1,
      descr: "Total supply of Token1 (growth tokens)",
      value: supply1 || 0,
      decimals: decimals1,
    },
    {
      title: "Tokens2 supply",
      currency: symbol2,
      descr: "Total supply of Token2 (interest tokens)",
      value: supply2 || 0,
      decimals: decimals2,
    },
    {
      title: "Stable tokens supply",
      currency: symbol3,
      descr: "Total supply of the stable tokens",
      value: supply || 0,
      decimals: decimals2,
    },
    {
      title: "Reserve",
      descr:
        "Total amount of reserve locked to back the issuance of T1 and t2 tokens",
      value: "reserve" in stable_state ? stable_state.reserve : 0,
      decimals: actualParams.reserve_asset_decimals,
      currency:
        reserve_asset in config.reserves && config.reserves[reserve_asset].name,
    },
    {
      title: "T1 price",
      descr:
        "The current price of Token1 according to the bonding curve. It depends on the supplies of Token1 and Token2. The price is shown in terms of the reserve currency.",
      value: p1 || 0,
      precision: 6,
      currency: reserve_asset in config.reserves && config.reserves[reserve_asset].name,
    },
    {
      title: "Current price",
      descr:
        "The current price according to the bonding curve. It depends on the supplies of Token1 and Token2. " + p2UnitsText,
      value: currentPrice,
      precision: 9,
      percent: currentPriceDifference,
    },
    {
      title: "Target price",
      descr: "The price Token2 is pegged to. It is the oracle price plus interest. " + p2UnitsText,
      value: targetPrice,
      precision: 9,
      currency: symbol2
    },
    {
      title: "Oracle price",
      descr: "Latest price reported by the oracle",
      value: oraclePrice,
      precision: 9,
    },
  ];

  return (
    <div
      style={{
        marginBottom: 20,
        background: "#fff",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <Row justify="start" style={{ marginBottom: -15 }}>
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
    </div>
  );
};
