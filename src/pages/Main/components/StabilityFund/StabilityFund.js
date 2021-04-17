import { Space, Typography, Statistic, Row, Col, Input } from "antd";
import { QRButton } from "components/QRButton/QRButton";
import { getParams } from "helpers/getParams";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { generateLink } from "utils/generateLink";
import moment from "moment";
import { $get_exchange_result } from "helpers/bonded";
import { useWindowSize } from "hooks/useWindowSize";
import { Suspense, useEffect } from "react";

const Pie = React.lazy(() => import('@ant-design/charts').then(module => ({ default: module.Pie })))

const { Title, Paragraph } = Typography;
const { Countdown } = Statistic;

const f = (x) => (~(x + "").indexOf(".") ? (x + "").split(".")[1].length : 0);

export const StabilityFund = () => {
  const { t } = useTranslation();
  const [inputBuy, setInputBuy] = useState(undefined);
  const [inputRedeem, setInputRedeem] = useState(undefined);

  const buyRef = useRef(null);
  const redeemRef = useRef(null);

  const { activeWallet } = useSelector((state) => state.settings);
  const { symbol1, symbol2, reservePrice, oraclePrice, symbol4, fund_balance, fund_state, params, bonded_state, reserve_asset_symbol, fund_aa, de_state } = useSelector((state) => state.active);
  const actualParams = getParams(params, bonded_state);
  const { decimals1, decimals2, reserve_asset, reserve_asset_decimals, m, n, below_peg_timeout } = actualParams;
  const { asset1 } = bonded_state;

  const shares_supply = fund_state.shares_supply || 0;
  const s1 = bonded_state.supply1 / 10 ** decimals1;
  const s2 = bonded_state.supply2 / 10 ** decimals2;
  const p1 = m * s1 ** (m - 1) * s2 ** n;

  const t1Balance = fund_balance?.[asset1] || 0;
  const reserveBalance = fund_balance?.[reserve_asset] || 0;
  const balance = reserveBalance + p1 * 10 ** (reserve_asset_decimals - decimals1) * (t1Balance);

  const reserveBalancePercent = reserveBalance ? +Number((reserveBalance / balance) * 100).toFixed(2) : 0;
  const t1BalancePercent = t1Balance ? +Number((p1 * 10 ** (reserve_asset_decimals - decimals1) * t1Balance / balance) * 100).toFixed(2) : 0;

  const share_price = shares_supply ? balance / shares_supply : 1;

  const now = Math.floor(Date.now() / 1000);
  const timeToNextMovement = "below_peg_ts" in de_state ? de_state.below_peg_ts + below_peg_timeout : now;
  const [isExpired, setIsExpired] = useState(timeToNextMovement <= now);

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    setIsExpired(timeToNextMovement <= now);
  }, [timeToNextMovement]);

  const handleChangeBuy = (ev) => {
    const value = ev.target.value;
    if (value === "") {
      setInputBuy(undefined);
    } else if (f(value) <= decimals1) {
      setInputBuy(value);
    }
  }

  const handleChangeRedeem = (ev) => {
    const value = ev.target.value;
    if (value === "") {
      setInputRedeem(undefined);
    } else if (f(value) <= decimals1) {
      setInputRedeem(value);
    }
  }
  const amountByteForBuy = Math.ceil((inputBuy * share_price) * 10 ** reserve_asset_decimals + 10000);

  const link = inputBuy && generateLink(
    amountByteForBuy,
    {},
    activeWallet,
    bonded_state.decision_engine_aa,
    reserve_asset,
  );

  const link2 = inputRedeem && generateLink(
    Math.ceil((inputRedeem) * 10 ** reserve_asset_decimals),
    {},
    activeWallet,
    bonded_state.decision_engine_aa,
    fund_state.shares_asset,
  );

  const my_share = inputRedeem * 10 ** reserve_asset_decimals / fund_state.shares_supply;
  const reserve_amount = Math.floor(my_share * fund_balance?.[reserve_asset]);
  const t1_amount = Math.floor(my_share * t1Balance);

  const linkFixedPrice = generateLink(
    1e4,
    { act: 1 },
    activeWallet,
    bonded_state.decision_engine_aa,
  );

  const handleEnterBuy = (ev) => {
    if (ev.key === "Enter") {
      if (Number(inputBuy)) {
        buyRef.current.click();
      }
    }
  };

  const handleEnterRedeem = (ev) => {
    if (ev.key === "Enter") {
      if (Number(inputRedeem)
        && isValidRedeem
      ) {
        redeemRef.current.click();
      }
    }
  };

  const obj = {
    tokens1: - t1_amount,
    tokens2: 0,
    params: actualParams,
    vars: bonded_state,
    oracle_price: oraclePrice,
    timestamp: Math.floor(Date.now() / 1000),
    reservePrice,
    isV2: !!fund_aa
  };

  const exchange = t1_amount && $get_exchange_result(obj);
  const you_get_in_smallest_units = (reserve_amount - exchange.reserve_needed - (reserve_asset === "base" ? 4000 : 0));
  const you_get = +Number(you_get_in_smallest_units / 10 ** reserve_asset_decimals);
  const fee_percent = (exchange.fee / you_get_in_smallest_units) * 100;
  const isValidRedeem = !!exchange?.payout && Number(exchange.payout) > 0 && you_get > 0 && Number(inputRedeem) < shares_supply / 10 ** reserve_asset_decimals;
  const [width] = useWindowSize();
  let bPriceInversed = false;
  if ("oracles" in actualParams) {
    if (actualParams.oracles[0].op === "*" && !actualParams.leverage)
      bPriceInversed = true;
  } else {
    if (actualParams.op1 === "*" && !actualParams.leverage)
      bPriceInversed = true;
  }

  const new_p2 = exchange ? (bPriceInversed ? 1 / exchange.p2 : exchange.p2) : undefined;
  const old_p2 = bPriceInversed ? 1 / bonded_state.p2 : bonded_state.p2;
  const t_p2 = exchange ? (bPriceInversed ? 1 / exchange.target_p2 : exchange.target_p2) : undefined;

  const priceChange = exchange && new_p2 - (old_p2 || 0);
  const changePricePercent = (priceChange / old_p2 || 0) * 100;
  const changeFinalPricePercent = exchange && exchange.target_p2
    ? ((new_p2 - t_p2) / t_p2) * 100
    : 0;

  const p2Pair = (!bPriceInversed ? (symbol2 || "T2") + "/" + (reserve_asset_symbol || "RESERVE") : (reserve_asset_symbol || "RESERVE") + "/" + (symbol2 || "T2"));

  return <div>
    <Title style={{ marginBottom: 0 }} level={3}>{t("trade.tabs.stability_fund.title", "Stability fund")}</Title>
    <Paragraph type="secondary">{t("trade.tabs.stability_fund.desc", "In v2 stablecoins, the fund is used to automatically keep the price near the peg.")}</Paragraph>


    <Title level={4}>{t("trade.tabs.stability_fund.info_title", "Fund information")}</Title>
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ marginBottom: 25, marginRight: 25, width: width > 400 ? 300 : "100%" }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Pie
            autoFit={true}
            // autoEllipsis={false}
            animation={false}
            label={
              {
                type: "inner",
                autoRotate: false,
                offset: '-50%',
                content: function content(_ref) {
                  const { value, symbol } = _ref;
                  const percent = balance ? Number(((value || 0) / ((balance) / 10 ** reserve_asset_decimals)) * 100).toFixed(2) : 0;
                  return `${symbol} ${Number(percent).toFixed(2)}%`
                }, style: {
                  fontSize: 13,
                  textAlign: 'center',
                  fontWeight: "bold"
                },
              }
            }
            meta={{
              value: {
                formatter: v => {
                  return `${Number(v).toFixed(reserve_asset_decimals)} ${reserve_asset_symbol}`;
                }
              }
            }}
            renderer="svg"
            legend={false}
            data={
              [
                { symbol: reserve_asset_symbol || "RESERVE", type: reserve_asset_symbol || "RESERVE", value: reserveBalance / 10 ** reserve_asset_decimals },
                { symbol: symbol1 || "T1", type: t1Balance / 10 ** decimals1 + " " + (symbol1 || "T1"), value: (p1 * 10 ** (reserve_asset_decimals - decimals1) * t1Balance) / 10 ** reserve_asset_decimals }
              ]
            } angleField="value" colorField="type" />
        </Suspense>
      </div>
      <div style={{ marginBottom: 25 }}>
        <Space wrap={true} size={25}>
          <Statistic title={`${symbol4 || "T_FUND"} price`} precision={decimals1} suffix={reserve_asset_symbol} value={Number(share_price).toFixed(reserve_asset_decimals)} />
          <Statistic title={`${symbol1 || "T1"} price`} precision={decimals1} suffix={reserve_asset_symbol} value={Number(p1 || 0).toFixed(decimals1)} />
        </Space>
        <Statistic style={{ marginTop: 25 }} title={t("trade.tabs.stability_fund.total_asset", "Total asset value")} valueRender={() => <span>{`${Number(reserveBalance / 10 ** reserve_asset_decimals).toFixed(decimals1)} ${reserve_asset_symbol || "RESERVE"} (${reserveBalancePercent}%)`} <br /> + {`${Number(t1Balance / 10 ** decimals1).toFixed(decimals1)} ${symbol1 || "T1"} (${t1BalancePercent}%)`} <br /> = {`${Number(balance / 10 ** reserve_asset_decimals).toFixed(reserve_asset_decimals)} ${reserve_asset_symbol}`}</span>} />
      </div>
    </div>


    <Row style={{ marginBottom: 25 }}>
      <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} style={{ marginBottom: 25 }}>
        <Title level={4}>{t("trade.tabs.stability_fund.buy_title", "Buy")}</Title>
        <Paragraph type="secondary">
          {t("trade.tabs.stability_fund.buy_desc", "The GBYTE you invest will be added to the fund's reserves and you'll get its shares in exchange.")}
        </Paragraph>
        <Space wrap={true}>
          <Input onKeyPress={handleEnterBuy} style={{ width: "100%" }} placeholder={t("trade.tabs.stability_fund.amount", "Amount of shares")} value={inputBuy} onChange={handleChangeBuy} size="large" />
          <QRButton ref={buyRef} href={link} size="large" disabled={!Number(inputBuy)} type="primary">{t("trade.tabs.stability_fund.send", "Send {{count}}", { count: Number(inputBuy) ? +Number(amountByteForBuy / 10 ** reserve_asset_decimals).toFixed(reserve_asset_decimals) : "" })} {reserve_asset_symbol || "RESERVE"}</QRButton>
        </Space>
        {Number(inputBuy) ? <Paragraph type="secondary">
          <div><b>{t("trade.tabs.buy_redeem.fee", "Fee")}:</b> 0</div>
          <div><b>{t("trade.tabs.buy_redeem.reward", "Reward")}:</b> 0</div>
          <div>
            <b>{"p2" in bonded_state ? t("trade.tabs.buy_redeem.price_change", "{{pair}} price change", { pair: p2Pair }) + ": " : t("trade.tabs.buy_redeem.price", "{{pair}} price", { pair: p2Pair }) + ": "}</b>
            0 (0%)
          </div>
          <div>
            <b>{t("trade.tabs.buy_redeem.final_price", "Final {{pair}} price", { pair: p2Pair })}:</b>{" "}
            {Number(old_p2).toFixed(actualParams.reserve_asset_decimals)}
          </div>
        </Paragraph> : null}
      </Col>

      <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
        <Title level={4}>{t("trade.tabs.stability_fund.redeem_title", "Redeem")}</Title>
        <Paragraph type="secondary">
          {t("trade.tabs.stability_fund.redeem_desc", "When you redeem, you get your share of the fund's assets in reserve currency {{reserve_asset_symbol}}, plus your share of {{symbol}} is redeemed (potentially affecting the price and paying fees) and the proceeds in {{reserve_asset_symbol}} are also sent to you.", { reserve_asset_symbol, symbol: symbol1 || "T1" })}
        </Paragraph>
        <Space wrap={true} align="end">
          <Input onKeyPress={handleEnterRedeem} placeholder={t("trade.tabs.stability_fund.amount", "Amount of shares")} value={inputRedeem} onChange={handleChangeRedeem} size="large" />
          <QRButton ref={redeemRef} href={link2} size="large" disabled={!isValidRedeem} type="primary">{t("trade.tabs.stability_fund.send", "Send {{count}}", { count: Number(inputRedeem) ? +Number(inputRedeem).toFixed(reserve_asset_decimals) : "" })} {symbol4 || "T_FUND"}</QRButton>
        </Space>
        {Number(inputRedeem) && isValidRedeem ? <Paragraph type="secondary">
          <div>{t("trade.tabs.buy_redeem.redeem_will_receive", "You will get {{amount}} {{symbol}}", { amount: (you_get).toFixed(reserve_asset_decimals), symbol: reserve_asset_symbol || "RESERVE" })}</div>
          <div><b>{t("trade.tabs.buy_redeem.fee", "Fee")}:</b> <span style={(fee_percent > 1) ? ((fee_percent > 3) ? { color: "red" } : { color: "orange" }) : { color: "inherit" }}>{+Number(fee_percent).toFixed(2)}%</span></div>
          <div><b>{t("trade.tabs.buy_redeem.reward", "Reward")}:</b> <span style={exchange && exchange.reward_percent > 0 ? { color: "green" } : { color: "inherit" }}>{+Number(exchange.reward_percent).toFixed(2)}%</span></div>
          <div>
            <b>{"p2" in bonded_state ? t("trade.tabs.buy_redeem.price_change", "{{pair}} price change", { pair: p2Pair }) + ": " : t("trade.tabs.buy_redeem.price", "{{pair}} price", { pair: p2Pair }) + ": "}</b>
            {priceChange > 0 ? "+" : ""}
            {priceChange.toFixed(4)}
            {"p2" in bonded_state &&
              " (" +
              (changePricePercent > 0 ? "+" : "") +
              changePricePercent.toFixed(2) +
              "%)"}
          </div>
          <div>
            <b>{t("trade.tabs.buy_redeem.final_price", "Final {{pair}} price", { pair: p2Pair })}:</b>{" "}
            {(Number(new_p2).toFixed(
              actualParams.reserve_asset_decimals
            ) + (changeFinalPricePercent ?
              ` (${Math.abs(changeFinalPricePercent).toFixed(2)}% ${changeFinalPricePercent > 0 ? t("trade.tabs.buy_redeem.above_target", "above the target") : t("trade.tabs.buy_redeem.below_target", "below the target")})` : "")) || "-"}
          </div>
        </Paragraph> : (Number(inputRedeem) && !isValidRedeem ? <div style={{ color: "#e74c3c" }}>{t("trade.tabs.buy_redeem.big_change", "The transaction would change the price too much, please try a smaller amount")}</div> : null)}
      </Col>
    </Row>

    <div style={{ marginBottom: 25 }}>
      <Title level={4}>{t("trade.tabs.stability_fund.fix_title", "Fix {{symbol}} price", { symbol: symbol2 })}</Title>
      <Space wrap={true} align="center" size={25}>
        {!isExpired ? <Countdown
          title={t("trade.tabs.stability_fund.next_fix", "Time until the next fix")}
          value={moment.unix(timeToNextMovement)}
          onFinish={() => setIsExpired(true)}
        /> : <Statistic
          title={t("trade.tabs.stability_fund.next_fix", "Time until the next fix")}
          value={t("trade.tabs.stability_fund.expired", "Expired")} />}
        <QRButton type="primary" disabled={!isExpired} href={linkFixedPrice}>{t("trade.tabs.stability_fund.fix_btn", "Send fix request")}</QRButton>
      </Space>
    </div>
  </div>
}