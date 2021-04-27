import { Col, Input, Row, Form, Select, Typography } from "antd";
import { QRButton } from "components/QRButton/QRButton";
import { $get_exchange_result } from "helpers/bonded";
import { getParams } from "helpers/getParams";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { generateLink } from "utils/generateLink";

const { Title, Text } = Typography;

const f = (x) => (~(x + "").indexOf(".") ? (x + "").split(".")[1].length : 0);

export const IssueAndRedeem = () => {
  const { t } = useTranslation();
  const [input1, setInput1] = useState(undefined);
  const [input2, setInput2] = useState(undefined);
  const btnRef = useRef(null);
  const [meta, setMeta] = useState(undefined);
  const [error, setError] = useState(null);
  const [currentPairs, setCurrentPairs] = useState([]);
  const { address, oraclePrice, params, reserve_asset_symbol, fund_balance, symbol1, symbol2, symbol3, symbol4, stable_state, bonded_state, fund_state, reservePrice, stable_aa, fund_aa } = useSelector((state) => state.active);
  const { activeWallet, referrer } = useSelector((state) => state.settings);
  const actualParams = getParams(params, bonded_state);
  const { reserve_asset, reserve_asset_decimals, decimals1, decimals2, m, n } = actualParams;
  const { asset } = stable_state;
  const { asset1, asset2, reserve } = bonded_state;
  const { shares_asset, shares_supply } = fund_state;

  const pairs = reserve ? {
    [reserve_asset]: [
      { symbol: symbol2, asset: asset2 },
      { symbol: symbol4, asset: shares_asset },
      { symbol: symbol3, asset: asset },
    ],
    [asset2]: [
      { symbol: symbol3, asset },
      { symbol: reserve_asset_symbol, asset: reserve_asset }
    ],
    [shares_asset]: [
      { symbol: reserve_asset_symbol, asset: reserve_asset },
    ],
    [asset]: [
      { symbol: symbol2, asset: asset2 },
      { symbol: reserve_asset_symbol, asset: reserve_asset }
    ]
  } : {
    [reserve_asset]: [
      { symbol: symbol4, asset: shares_asset },
    ]
  }


  const [toAsset, setToAsset] = useState(reserve ? asset2 : shares_asset);
  const [fromAsset, setFromAsset] = useState(reserve_asset);

  let fromDecimals;
  let toDecimals;
  let currentAddress;
  let sendAmount;
  let sendPayload = {};

  if (fromAsset === reserve_asset || fromAsset === shares_asset) {
    fromDecimals = reserve_asset_decimals;
  } else if (fromAsset === asset2 || fromAsset === asset) {
    fromDecimals = decimals2;
  }

  if (toAsset === reserve_asset || toAsset === shares_asset) {
    toDecimals = reserve_asset_decimals;
  } else if (toAsset === asset2 || toAsset === asset) {
    toDecimals = decimals2;
  }

  useEffect(()=>{
    setCurrentPairs(pairs[fromAsset]);
  }, [address, fromAsset])

  if (fromAsset === reserve_asset) {
    if (toAsset === shares_asset) {
      currentAddress = bonded_state.decision_engine_aa;
      sendPayload = { ref: referrer }
      sendAmount = Math.round(input1 * 10 ** reserve_asset_decimals);
    } else if (toAsset === asset2) {
      currentAddress = address;
      sendPayload = { tokens2: Math.trunc(input2 * 10 ** decimals2), ref: referrer };
      sendAmount = Math.ceil(input1 * 10 ** reserve_asset_decimals);
    } else if (toAsset === asset) {
      sendPayload = { tokens2: Math.trunc(input2 * 10 ** decimals2), tokens2_to: toAsset === asset ? stable_aa : undefined }
      currentAddress = address;
      sendAmount = Math.ceil(input1 * 10 ** reserve_asset_decimals);
    }

  } else if (fromAsset === asset2) {
    if (toAsset === asset) {
      currentAddress = stable_aa
    } else if (toAsset === reserve_asset) {
      currentAddress = address;
    }
    sendAmount = Math.round(input1 * 10 ** decimals2);
  } else if (fromAsset === shares_asset) {
    currentAddress = bonded_state.decision_engine_aa;
    sendAmount = Math.round(input1 * 10 ** reserve_asset_decimals);
  } else if (fromAsset === asset) {
    currentAddress = stable_aa
    sendAmount = Math.round(input1 * 10 ** decimals2);
    if (toAsset === reserve_asset) {
      sendPayload = { to: address }
    }
  }

  useEffect(() => {
    setFromAsset(reserve_asset);
  }, [address, reserve_asset])

  useEffect(() => {
    if (currentPairs?.[0]) {
      setToAsset(currentPairs[0].asset)
    }
  }, [currentPairs]);

  useEffect(() => {
    if (input1) {
      setInput1(+Number(input1).toFixed(fromDecimals))
    }
  }, [fromDecimals])

  useEffect(() => {
    if (input2) {
      setInput2(+Number(input2).toFixed(toDecimals))
    }
  }, [toDecimals])

  const commonData = {
    params: actualParams,
    vars: bonded_state,
    oracle_price: oraclePrice,
    timestamp: Math.floor(Date.now() / 1000),
    reservePrice,
    isV2: !!fund_aa
  };

  let bPriceInversed = false;
  if ("oracles" in actualParams) {
    if (actualParams.oracles[0].op === "*" && !actualParams.leverage)
      bPriceInversed = true;
  } else {
    if (actualParams.op1 === "*" && !actualParams.leverage)
      bPriceInversed = true;
  }

  const p2Pair = (!bPriceInversed ? (symbol2 || "T2") + "/" + (reserve_asset_symbol || "RESERVE") : (reserve_asset_symbol || "RESERVE") + "/" + (symbol2 || "T2"));
  const p1Pair = ((symbol1 || "T1") + "/" + (reserve_asset_symbol || "RESERVE"));

  const old_p2 = bPriceInversed ? 1 / bonded_state.p2 : bonded_state.p2;

  useEffect(() => {
    let meta;
    let error;
    if (fromAsset === reserve_asset) {
      if (toAsset === asset) {
        if (input1) {
          const exchange = $get_exchange_result({
            tokens1: 0,
            tokens2: 0,
            addReserve: input1 * 10 ** reserve_asset_decimals * 0.99,
            ...commonData
          });

          if (exchange) {
            meta = exchange;
            const expect = Math.abs(Math.trunc(exchange.expectNewT2));
            setInput2(+Number((expect / 10 ** decimals2) * exchange.growth_factor).toFixed(decimals2));
          }
        } else {
          setInput2(undefined)
        }

      } else if (toAsset === shares_asset) {
        if (Number(input1)) {
          const shares_supply = fund_state.shares_supply || 0;
          const s1 = bonded_state.supply1 / 10 ** decimals1;
          const s2 = bonded_state.supply2 / 10 ** decimals2;
          const p1_in_full_units = m * s1 ** (m - 1) * s2 ** n;
          const p1 = p1_in_full_units * 10 ** (reserve_asset_decimals - decimals1);

          const balance = (fund_balance?.[reserve_asset] || 0) + p1 * (fund_balance?.[asset1] || 0);

          const share_price = shares_supply ? balance / shares_supply : 1;
          setInput2(+Number(input1 / share_price).toFixed(toDecimals));
        } else {
          setInput2(undefined)
        }

      } else if (toAsset === asset2) {
        const exchange = $get_exchange_result({
          tokens1: 0,
          tokens2: 0,
          tokens_stable: 0,
          addReserve: input1 * 10 ** reserve_asset_decimals * 0.99,
          ...commonData
        });
        const expect = Math.abs(Math.trunc(exchange.expectNewT2));
        if (expect) {
          setInput2(+Number(expect / 10 ** decimals2).toFixed(decimals2));
          meta = exchange;
        } else {
          setInput2(undefined)
        }
      }

    } else if (fromAsset === asset2) {
      if (Number(input1)) {
        const exchange = $get_exchange_result({
          tokens1: 0,
          tokens2: toAsset === reserve_asset ? -(input1 * 10 ** actualParams.decimals2) : 0,
          tokens_stable: 0,
          ...commonData
        });
        if (toAsset === reserve_asset) {
          if (!exchange?.payout || exchange.payout <= 0) {
            error = "big_change";
            setInput2(undefined);
          } else {
            meta = exchange;
            setInput2(+Number(exchange.payout / 10 ** reserve_asset_decimals).toFixed(reserve_asset_decimals))
          }
        } else if (toAsset === asset) {
          setInput2(+Number(input1 * exchange?.growth_factor).toFixed(toDecimals));
        }
      } else {
        setInput2(undefined)
      }

    } else if (fromAsset === asset) {
      if (toAsset === reserve_asset) {
        const exchange = $get_exchange_result({
          tokens1: 0,
          tokens2: 0,
          tokens_stable: -input1 * 10 ** decimals2,
          ...commonData
        });
        if (!exchange?.payout || exchange.payout <= 0) {
          setInput2(undefined);
        } else {
          meta = exchange;
          setInput2(+Number(exchange.payout / 10 ** reserve_asset_decimals).toFixed(reserve_asset_decimals))
        }
      } else if (toAsset === asset2) {
        const exchange = $get_exchange_result({
          tokens1: 0,
          tokens2: 0,
          tokens_stable: 0,
          ...commonData
        });
        if (input1 && Number(input1) > 0) {
          setInput2(+Number(input1 / exchange?.growth_factor).toFixed(toDecimals))
        } else {
          setInput2(undefined)
        }
      }

    } else if (fromAsset === shares_asset) {
      const p1Balance = fund_balance?.[asset1] || 0;
      const my_share = input1 * 10 ** reserve_asset_decimals / fund_state.shares_supply;
      const reserve_amount = Math.floor(my_share * fund_balance?.[reserve_asset]);
      const t1_amount = Math.floor(my_share * p1Balance);

      const exchange = $get_exchange_result({
        tokens1: -t1_amount,
        tokens2: 0,
        tokens_stable: 0,
        ...commonData
      });

      const you_get_in_full_units = (reserve_amount - exchange.reserve_needed - (reserve_asset === "base" ? 4000 : 0));

      const you_get = +Number(you_get_in_full_units / 10 ** reserve_asset_decimals).toFixed(reserve_asset_decimals);
      const fee_percent = (exchange.fee / you_get_in_full_units) * 100;

      if (you_get && you_get > 0 && Number(exchange.payout) > 0 && Number(input1) < shares_supply / 10 ** reserve_asset_decimals) {
        meta = { ...exchange, fee_percent };
        setInput2(you_get);
      } else {
        setInput2(undefined);
        if (Number(input1) > 0) {
          error = "big_change";
        }
      }
    }

    if (meta && Number(input1) > 0) {
      let bPriceInversed = false;
      if ("oracles" in actualParams) {
        if (actualParams.oracles[0].op === "*" && !actualParams.leverage)
          bPriceInversed = true;
      } else {
        if (actualParams.op1 === "*" && !actualParams.leverage)
          bPriceInversed = true;
      }

      const new_p2 = (bPriceInversed ? 1 / meta.p2 : meta.p2);

      const t_p2 = (bPriceInversed ? 1 / meta.target_p2 : meta.target_p2);

      const priceChange = new_p2 - (old_p2 || 0);
      const changePricePercent = (priceChange / old_p2 || 0) * 100;
      const changeFinalPricePercent = ((new_p2 - t_p2) / t_p2) * 100;

      const priceChangeP1 = meta.p1 - meta.old_p1;
      const priceChangePercentP1 = ((priceChangeP1 / meta.old_p1 || 0) * 100);

      meta.p2Pair = p2Pair;
      meta.p1Pair = p1Pair;
      meta.priceChange = priceChange;
      meta.new_p2 = new_p2;
      meta.changePricePercent = changePricePercent;
      meta.changeFinalPricePercent = changeFinalPricePercent;
      meta.priceChangePercentP1 = priceChangePercentP1;
      setMeta(meta);
    } else {
      setMeta(undefined)
    }
    if (error) {
      setError(error)
    } else {
      setError(undefined)
    }
  }, [address, toAsset, fromAsset, toDecimals, fromDecimals, input2, input1]);

  let link = "";
  try {
    link = generateLink(
      Math.round(sendAmount),
      sendPayload,
      activeWallet,
      currentAddress,
      fromAsset,
      true
    );
  } catch { }

  const handleInput1 = (ev) => {
    const value = ev.target.value;
    if (value === "") {
      setInput1(undefined);
    } else {
      if (f(value) <= fromDecimals) {
        setInput1(value);
      }
    }
  }

  const handleInput2 = (ev) => {
    const value = ev.target.value;
    if (value === "") {
      setInput2(undefined);
    } else {
      if (f(value) <= toDecimals) {
        setInput2(value);
      }
    }
  }

  const isDisabled = input1 === undefined || input2 === undefined || Number(input1) <= 0 || Number(input2) <= 0;

  const onEnter = (ev) => {
    if (ev.key === "Enter") {
      if (!isDisabled) {
        btnRef?.current.click();
      }
    }
  }

  const addProtect = fromAsset === reserve_asset && (toAsset === asset || toAsset === asset2);
  
  return <div>
    <Title level={3}>Buy and redeem</Title>
    <Form
      size="large">
      <Row style={{ marginBottom: 50 }}>
        <Col lg={{ span: 11 }} sm={{ span: 24 }} xs={{ span: 24 }}>
          <Text type="secondary">You send:</Text>
          <Input.Group compact size="large">
            <Form.Item style={{ width: "50%", marginBottom: 0 }}>
              <Input
                onChange={handleInput1}
                value={input1} placeholder="Amount"
                style={{ width: "100%" }}
                onKeyPress={onEnter}
              />
            </Form.Item>
            <Form.Item style={{ width: "50%", marginBottom: 0 }}>
              <Select size="large" placeholder="Select token" value={fromAsset} onChange={(v) => setFromAsset(v)} style={{ width: "100%" }} >
                {reserve ? (
                  <>
                    <Select.Option value={reserve_asset}>{reserve_asset_symbol}</Select.Option>
                    <Select.Option value={asset2}>{symbol2 || "T2"}</Select.Option>
                    <Select.Option value={shares_asset}>{symbol4 || "T_SF"}</Select.Option>
                    <Select.Option value={asset}>{symbol3 || "T_STABLE"}</Select.Option>
                  </>
                ) : <Select.Option value={reserve_asset}>{reserve_asset_symbol}</Select.Option>}
              </Select>
            </Form.Item>
          </Input.Group>
          {addProtect ? <Text type="secondary" style={{ fontSize: 10, lineHeight: "auto" }}>{t("trade.tabs.buy_redeem.protect_v2", "1% of this amount will be added to protect against price volatility, you will receive this amount back if prices do not change.")}</Text> : null}
        </Col>
        <Col lg={{ span: 11, offset: 2 }} sm={{ span: 24, offset: 0 }} xs={{ span: 24, offset: 0 }}>
          <Text type="secondary">You get:</Text>
          <Input.Group compact size="large">
            <Form.Item style={{ width: "50%", marginBottom: 0 }}>
              <Input onKeyPress={onEnter} disabled={fromAsset !== reserve_asset || toAsset === shares_asset || toAsset === asset2 || toAsset === asset} autoFocus={true} placeholder="Amount" onChange={handleInput2} value={input2} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item style={{ width: "50%", marginBottom: 0 }}>
              <Select size="large" placeholder="Select token" value={toAsset} onChange={(v) => setToAsset(v)} style={{ width: "100%" }}>
                {currentPairs?.map((p, i) => {
                  return <Select.Option key={"option" + i} value={p.asset}>{p.symbol || p.asset}</Select.Option>
                })}
              </Select>
            </Form.Item>
            <span style={{ color: "#e74c3c" }}>{(error && (error === "big_change" ? t("trade.tabs.buy_redeem.big_change", "The transaction would change the price too much, please try a smaller amount") : null)) || null}</span>
          </Input.Group>
        </Col>
        <Col span="24" >
          <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
            <div>
              <div style={{ marginBottom: 25 }}>
                <div>
                  <Text type="secondary" style={{ display: "block" }}>
                    <b>{t("trade.tabs.buy_redeem.fee", "Fee")}: </b>
                    {meta ? <span style={(meta.fee_percent > 1) ? ((meta.fee_percent > 3) ? { color: "red" } : { color: "orange" }) : { color: "inherit" }}>
                      {Number(meta.fee_percent).toFixed(2) || 0}%
                    </span> : 0}
                  </Text>
                </div>
                <div>
                  <Text type="secondary" style={{ display: "block" }}>
                    <b>{t("trade.tabs.buy_redeem.reward", "Reward")}:</b>{" "}
                    {meta ? <span style={meta.reward_percent > 0 ? { color: "green" } : { color: "inherit" }}>
                      {(meta.reward !== 0 &&
                        !isNaN(meta.reward_percent) &&
                        Number(meta.reward_percent).toFixed(2)) ||
                        0}
                    %
                    </span> : 0}
                  </Text>
                </div>
                <div>
                  <Text
                    type="secondary"
                  >
                    <b>{"p2" in bonded_state ? t("trade.tabs.buy_redeem.price_change", "{{pair}} price change", { pair: p2Pair }) + ": " : t("trade.tabs.buy_redeem.price", "{{pair}} price", { pair: p2Pair }) + ": "}</b>
                    {meta ? <>
                      {meta.priceChange > 0 ? "+" : ""}
                      {meta.priceChange.toFixed(4)}
                      {"p2" in bonded_state &&
                        " (" +
                        (meta.changePricePercent > 0 ? "+" : "") +
                        meta.changePricePercent.toFixed(2) +
                        "%)"}
                    </> : 0}
                  </Text>
                </div>
                <div>
                  <Text type="secondary">
                    <b>{t("trade.tabs.buy_redeem.final_price", "Final {{pair}} price", { pair: p2Pair })}:</b>{" "}
                    {meta ? <>
                      {Number(meta.new_p2).toFixed(
                        actualParams.reserve_asset_decimals
                      ) + (meta.changeFinalPricePercent ?
                        ` (${Math.abs(meta.changeFinalPricePercent).toFixed(2)}% ${meta.changeFinalPricePercent > 0 ? t("trade.tabs.buy_redeem.above_target", "above the target") : t("trade.tabs.buy_redeem.below_target", "below the target")})` : "")}
                    </> : Number(old_p2 || 0).toFixed(reserve_asset_decimals)}
                  </Text>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <QRButton disabled={isDisabled} type="primary" size="large" ref={btnRef} href={link}>Exchange</QRButton>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Form>
  </div>
}