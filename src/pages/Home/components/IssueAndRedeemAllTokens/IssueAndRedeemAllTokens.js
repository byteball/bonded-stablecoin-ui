import { SwapOutlined } from "@ant-design/icons";
import { Col, Input, Row, Form, Select, Typography } from "antd";
import CoinIcon from "stablecoin-icons";
import { QRButton } from "components/QRButton/QRButton";
import { $get_exchange_result } from "helpers/bonded";
import { getParams } from "helpers/getParams";
import { useWindowSize } from "hooks/useWindowSize";
import React, { useEffect, useState, useRef, useMemo } from "react";
import ReactGA from "react-ga";
import { useTranslation, Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { generateLink } from "utils/generateLink";
import config from "config";
import { getTargetCurrency } from "components/SelectStablecoin/SelectStablecoin";
import "./IssueAndRedeemAllTokens.module.css";
import { updateSymbols } from "store/actions/symbols/updateSymbols";
import { updatePrices } from "store/actions/prices/updatePrices";
import { GbyteIcon } from "components/GbyteIcon/GbyteIcon";
import { addTrackedExchanges } from "store/actions/tracked/addTrackedExchanges";

const { Text } = Typography;

const f = (x) => (~(x + "").indexOf(".") ? (x + "").split(".")[1].length : 0);

export const IssueAndRedeemAllTokens = () => {
  const list = useSelector((state) => state.list.data);
  const balances = useSelector((state) => state.data.balances);
  const symbolList = useSelector((state) => state.symbols);
  const data = useSelector((state) => state.data.data);
  const prices = useSelector((state) => state.prices.prices);
  const { activeWallet, referrer } = useSelector((state) => state.settings);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const btnRef = useRef(null);

  const [width] = useWindowSize();

  const [input1, setInput1] = useState(undefined);
  const [input2, setInput2] = useState(undefined);
  const [meta, setMeta] = useState(undefined);
  const [error, setError] = useState(null);
  const [currentPairs, setCurrentPairs] = useState([]);
  const [pairs, setPairs] = useState({});
  const [changingDirection, setChangingDirection] = useState(false);
  const [toAsset, setToAsset] = useState(undefined);
  const [fromAsset, setFromAsset] = useState(undefined);
  const [address, setAddress] = useState(undefined);
  const [showInfo, setShowInfo] = useState(false);
  const [description, setDescription] = useState(undefined);
  const [infoForGetPrice, setInfoForGetPrice] = useState([]);
  const [visibleReserveNotification, setVisibleReserveNotification] = useState(false);
  const [toAssetInit, setTtoAssetInit] = useState(false);
  const [assetsType, setAssetsType] = useState({});

  const stable_aa = list[address]?.stable || {};
  const fund_aa = list[address]?.fund || {};

  const bonded_state = data[address] || {};
  const fund_balance = balances?.[fund_aa] || {};

  const initToAsset = config.TESTNET ? "IWwTGdT+S7+eJkNi/pSvlakG0Kpv3zE2L0eWAk1Kemk=" : "eCpmov+r6LOVNj8KD0EWTyfKPrqsG3i2GgxV4P+zE6A=";

  useEffect(() => {
    setFromAsset("base");
    setInput1("0.1")
  }, [list]);

  useEffect(() => {
    if (Object.keys(list).length > 0) {
      dispatch(updateSymbols())
    }
  }, [list])

  const stable_state = data[stable_aa] || {};
  const fund_state = data[fund_aa] || {};

  const actualParams = useMemo(() => getParams(list[address]?.params, bonded_state), [address, bonded_state]);

  const oraclePrice = prices[address];

  const { reserve_asset, reserve_asset_decimals, decimals1, decimals2, m, n } = actualParams;
  const { asset } = stable_state;
  const { asset1, asset2, reserve } = bonded_state;
  const symbol1 = symbolList[asset1]?.symbol;
  const symbol2 = symbolList[asset2]?.symbol;
  const reserve_asset_symbol = symbolList[actualParams.reserve_asset]?.symbol;

  const { shares_asset, shares_supply } = fund_state;

  let fromAssetType;
  let toAssetType;

  if (fromAsset === asset2) {
    fromAssetType = "T2"
  } else if (fromAsset === asset) {
    fromAssetType = "STABLE"
  } else if (fromAsset === shares_asset) {
    fromAssetType = "FUND"
  } else if (fromAsset === reserve_asset) {
    fromAssetType = "RESERVE"
  }

  if (toAsset === asset2) {
    toAssetType = "T2"
  } else if (toAsset === asset) {
    toAssetType = "STABLE"
  } else if (toAsset === shares_asset) {
    toAssetType = "FUND"
  } else if (toAsset === reserve_asset) {
    toAssetType = "RESERVE"
  }

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

  if (fromAsset === reserve_asset) {
    if (toAsset === shares_asset) {
      currentAddress = bonded_state.decision_engine_aa;
      sendPayload = { ref: referrer }
      sendAmount = Math.round(input1 * 10 ** reserve_asset_decimals);
    } else if (toAsset === asset2) {
      currentAddress = address;
      sendPayload = { tokens2: Math.trunc(input2 * 10 ** decimals2), ref: referrer, max_fee_percent: meta?.max_fee_percent };
      sendAmount = Math.ceil(input1 * 10 ** reserve_asset_decimals);
    } else if (toAsset === asset) {
      sendPayload = { tokens2: Math.trunc(meta?.expect_t2), tokens2_to: toAsset === asset ? stable_aa : undefined, max_fee_percent: meta?.max_fee_percent }
      currentAddress = address;
      sendAmount = Math.ceil(input1 * 10 ** reserve_asset_decimals);
    }

  } else if (fromAsset === asset2) {
    if (toAsset === asset) {
      currentAddress = stable_aa
    } else if (toAsset === reserve_asset) {
      currentAddress = address;
      sendPayload = { max_fee_percent: meta?.max_fee_percent }
    }
    sendAmount = Math.round(input1 * 10 ** decimals2);
  } else if (fromAsset === shares_asset) {
    currentAddress = bonded_state.decision_engine_aa;
    sendAmount = Math.round(input1 * 10 ** reserve_asset_decimals);
    sendPayload = { max_fee_percent: meta?.max_fee_percent }
  } else if (fromAsset === asset) {
    currentAddress = stable_aa
    sendAmount = Math.round(input1 * 10 ** decimals2);
    if (toAsset === reserve_asset) {
      sendPayload = { to: address, max_fee_percent: meta?.max_fee_percent }
    }
  }

  useEffect(() => {
    if ((currentPairs?.length > 0)) {
      const address = currentPairs.find((item) => item.asset === toAsset)?.address
      if (address) {
        setAddress(address);
      }
    }
  }, [currentPairs, toAsset, pairs, address]);

  useEffect(() => {
    let fullPairs = {};
    let assets = [];
    const infoForGetPrice = [];
    const assetsType = {};
    for (const address in list) {
      const coin = list[address];
      if ("fund" in coin) {
        const reserve_asset = coin.params.reserve_asset;
        const actualParams = getParams(coin.params, coin.bonded_state)
        const peggedToCurrency = getTargetCurrency(coin.params, coin.bonded_state);
        const apy = actualParams.interest_rate * 100;

        infoForGetPrice.push({ address, bonded_state: coin.bonded_state, params: coin.params });

        assetsType[coin.asset_2] = { type: 2, peggedToCurrency, apy, info: `— ${peggedToCurrency} ${apy}% APY` };
        assetsType[coin.asset_fund] = { type: 1, peggedToCurrency, info: `— ${peggedToCurrency} stability fund`, symbol2: coin.symbol };
        assetsType[coin.asset_stable] = { type: 3, peggedToCurrency, info: `— ${peggedToCurrency}-pegged` };

        if (coin.reserve > 0) {
          fullPairs[reserve_asset] = [...(fullPairs?.[reserve_asset] || []), { asset: coin.asset_2, address }]
          fullPairs[reserve_asset] = [...(fullPairs?.[reserve_asset] || []), { asset: coin.asset_fund, address }]
          fullPairs[reserve_asset] = [...(fullPairs?.[reserve_asset] || []), { asset: coin.asset_stable, address }]

          fullPairs[coin.asset_2] = [...(fullPairs?.[coin.asset_2] || []), { asset: coin.asset_stable, address }]
          fullPairs[coin.asset_2] = [...(fullPairs?.[coin.asset_2] || []), { asset: reserve_asset, address }]

          fullPairs[coin.asset_fund] = [...(fullPairs?.[coin.asset_fund] || []), { asset: reserve_asset, address }]

          fullPairs[coin.asset_stable] = [...(fullPairs?.[coin.asset_stable] || []), { asset: coin.asset_2, address }]
          fullPairs[coin.asset_stable] = [...(fullPairs?.[coin.asset_stable] || []), { asset: reserve_asset, address }]

        } else {
          fullPairs[reserve_asset] = [...(fullPairs?.[coin.asset_fund] || []), { asset: coin.asset_fund, address }]
        }
        assets = [...assets, reserve_asset, coin.asset_stable, coin.asset_fund, coin.asset_2]
      }
    }

    setPairs(fullPairs);
    setAssetsType(assetsType);

    if (Object.keys(list).length > 0) {
      setInfoForGetPrice(infoForGetPrice)
    }
  }, [list]);

  useEffect(() => {
    let intervalId;

    if (infoForGetPrice.length > 0) {
      dispatch(updatePrices(infoForGetPrice));
      intervalId = setInterval(() => {
        dispatch(updatePrices(infoForGetPrice));
      }, 30 * 1000)
    }

    return () => intervalId && clearInterval(intervalId);
  }, [infoForGetPrice]);

  const fromList = useMemo(() => Object.keys(pairs), [pairs]);

  useEffect(() => {
    setCurrentPairs(pairs[fromAsset]);
  }, [pairs, fromAsset])

  useEffect(() => {
    if (!changingDirection && currentPairs?.[0]) {
      setToAsset(toAssetInit ? currentPairs[0].asset : initToAsset)
      if (!toAssetInit) {
        setTtoAssetInit(true);
      }
    } else if (changingDirection) {
      setChangingDirection(false);
    }
  }, [currentPairs]);

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
    if (!oraclePrice) setInput2(undefined);

    const commonData = {
      params: actualParams,
      vars: bonded_state,
      oracle_price: oraclePrice,
      timestamp: Math.floor(Date.now() / 1000),
      isV2: true
    };
    let meta;
    let error;

    if (fromAsset === reserve_asset) {
      if (toAsset === asset) {
        if (Number(input1)) {
          const exchange = $get_exchange_result({
            tokens1: 0,
            tokens2: 0,
            addReserve: input1 * 10 ** reserve_asset_decimals * 0.99,
            ...commonData
          });

          if (exchange) {
            meta = exchange;
            const expect = Math.abs(Math.trunc(exchange.expectNewT2));
            meta.expect_t2 = expect;
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
      meta.max_fee_percent = meta.fee_percent ? meta.fee_percent + 1 : 1;
      setMeta(meta);
    } else {
      setMeta(undefined)
    }
    if (error) {
      setError(error)
    } else {
      setError(undefined)
    }
  }, [address, toAsset, fromAsset, toDecimals, fromDecimals, input1, actualParams, oraclePrice]);

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

  useEffect(() => {
    setVisibleReserveNotification(fromAsset === reserve_asset && (toAsset === asset || toAsset === asset2));
  }, [toAsset, fromAsset, asset, asset2, reserve_asset]);

  useEffect(() => {
    let description;
    if (assetsType[toAsset] && assetsType[toAsset].type === 2) {
      description = t("trade.tabs.buy_redeem.desc_interest", "Interest token that earns {{currentInterestPercent}}% interest in {{currentPegged}} — a stable+ coin. For investors seeking predictable income.", { currentPegged: assetsType[toAsset].peggedToCurrency, currentInterestPercent: assetsType[toAsset].apy })
    } else if (assetsType[toAsset] && assetsType[toAsset].type === 1) {
      description = t("trade.tabs.buy_redeem.desc_fund", "Fund token whose value is tied to the amount of {{symbol2}} issued. For investors seeking higher income, with higher risks.", { symbol2: assetsType[toAsset].symbol2 })
    } else if (assetsType[toAsset] && assetsType[toAsset].type === 3) {
      description = t("trade.tabs.buy_redeem.desc_stable", "Stablecoin whose value is 1 {{currentPegged}}. For use in commerce and trading.", { currentPegged: assetsType[toAsset]?.peggedToCurrency })
    } else if (toAsset === "base") {
      description = t("trade.tabs.buy_redeem.desc_gbyte", "The main token of Obyte network.")
    }
    setDescription(description)
  }, [toAsset, shares_asset])

  const changeDirection = () => {
    if (reserve > 0) {
      const oldFromAsset = `${fromAsset}`;
      const oldToAsset = `${toAsset}`;
      setChangingDirection(true);
      setInput1(input2);
      setFromAsset(oldToAsset);
      setToAsset(oldFromAsset);
    }
  }

  return <div style={{ paddingBottom: 50 }}>
    <Form size="large">
      <Row style={{ marginBottom: 70 }}>
        <Col lg={{ span: 8, offset: 3 }} sm={{ span: 17, offset: 3 }} xs={{ span: 24 }}>
          <Text>{t("trade.tabs.buy_redeem.you_send", "You send")}:</Text>
          <Input.Group compact size="large">
            <Form.Item style={{ width: "40%", marginBottom: 0 }}>
              <Input
                onChange={handleInput1}
                value={input1} placeholder="Amount"
                style={{ width: "100%", borderColor: "#0137FF" }}
                onKeyPress={onEnter}
              />
            </Form.Item>
            <Form.Item style={{ width: "60%", marginBottom: 0 }}>
              <Select optionFilterProp="children" showSearch={true} size="large" placeholder={t("trade.tabs.buy_redeem.select_token", "Select token")} value={fromAsset} onChange={(v) => setFromAsset(v)} style={{ width: "100%" }} dropdownStyle={{ fontWeight: 400 }} className="select-issue">
                {fromList.map((asset) => <Select.Option key={"send-" + asset} value={asset}> {asset in assetsType ? <CoinIcon width="1em" height="1em" style={{ marginRight: 5, marginBottom: -1.5 }} pegged={assetsType[asset].peggedToCurrency} type={assetsType[asset].type} /> : (asset === "base" ? <GbyteIcon width="1em" height="1em" style={{ marginRight: 3, marginBottom: -1.5 }} /> : null)} {symbolList[asset]?.symbol || asset}</Select.Option>)}
              </Select>
            </Form.Item>
          </Input.Group>
          {visibleReserveNotification ? <Text style={{ fontSize: 10, lineHeight: "auto" }}>{t("trade.tabs.buy_redeem.protect_v2", "1% of this amount will be added to protect against price volatility, you will receive this amount back if prices do not change.")}</Text> : null}
        </Col>
        <Col lg={{ span: 2, offset: 0 }} sm={{ span: 24, offset: 0 }} xs={{ span: 24, offset: 0 }}>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
            <SwapOutlined onClick={changeDirection} style={{ fontSize: 28, padding: 5, display: "block", height: 40, cursor: "pointer", transform: width < 992 ? "rotate(90deg)" : "none" }} />
          </div>
        </Col>
        <Col lg={{ span: 8, offset: 0 }} sm={{ span: 17, offset: 3 }} xs={{ span: 24, offset: 0 }}>
          <Text>{t("trade.tabs.buy_redeem.you_get", "You get")}:</Text>
          <Input.Group compact size="large" style={{ borderColor: "#0137FF" }}>
            <Form.Item style={{ width: "40%", marginBottom: 0 }}>
              <Input onKeyPress={onEnter} disabled={fromAsset !== reserve_asset || toAsset === shares_asset || toAsset === asset2 || toAsset === asset} autoFocus={true} placeholder="Amount" onChange={handleInput2} value={input2} style={{ width: "100%", borderColor: "#0137FF" }} />
            </Form.Item>
            <Form.Item style={{ width: "60%", marginBottom: 0 }}>
              <Select optionFilterProp="children" showSearch={true} size="large" bordered={true} placeholder={t("trade.tabs.buy_redeem.select_token", "Select token")} value={toAsset} onChange={(v) => setToAsset(v)} style={{ width: "100%", borderColor: "#0137FF" }} dropdownStyle={{}} className="select-issue">
                {currentPairs?.map((p, i) => <Select.Option key={"option" + i} value={p.asset}> {assetsType[p.asset] ? <CoinIcon width="1em" height="1em" style={{ marginRight: 5, marginBottom: -1.5 }} pegged={assetsType[p.asset].peggedToCurrency} type={assetsType[p.asset]?.type} /> : (p.asset === "base" ? <GbyteIcon width="1em" height="1em" style={{ marginRight: 3, marginBottom: -1.5 }} /> : null)} {symbolList[p.asset]?.symbol || p.asset} {assetsType[p.asset]?.info || null} </Select.Option>)}
              </Select>
            </Form.Item>
            <div style={{ minHeight: 66 }}>
              <Text>{description}</Text>
              <span style={{ color: "#e74c3c" }}>{(error && (error === "big_change" ? <div>{t("trade.tabs.buy_redeem.big_change", "The transaction would change the price too much, please try a smaller amount")}</div> : null)) || null}</span>
            </div>
          </Input.Group>
        </Col>
        <Col span="24">
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 5, paddingBottom: 10 }}>
            <span onClick={() => setShowInfo(!showInfo)} style={{ cursor: "pointer", borderBottom: "1px dashed #333" }}>{showInfo ? t("trade.tabs.buy_redeem.hide_details", "hide details") : t("trade.tabs.buy_redeem.show_details", "show details")}</span>
          </div>
          {showInfo && <div>
            <Row>
              <Col lg={{ span: 12, offset: 6 }} sm={{ span: 24, offset: 0 }}>
                <div style={{ marginBottom: 25, textAlign: "center" }}>
                  <div>
                    <Text style={{ display: "block" }}>
                      <b>{t("trade.tabs.buy_redeem.fee", "Fee")}: </b>
                      {meta ? <span style={(meta.fee_percent > 1) ? ((meta.fee_percent > 3) ? { color: "red" } : { color: "orange" }) : { color: "inherit" }}>
                        {Number(meta.fee_percent).toFixed(2) || 0}%
                    </span> : 0}
                    </Text>
                  </div>
                  <div>
                    <Text style={{ display: "block" }}>
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
                    <Text>
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
                    <Text>
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
              </Col>
            </Row>
          </div>}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <QRButton onClick={() => {
              const action = `${fromAssetType} -> ${toAssetType}`;
              const label = `${symbolList[fromAsset]?.symbol} -> ${symbolList[toAsset]?.symbol}`;
              const category = "Exchange";
              ReactGA.event({
                category,
                action,
                label
              });

              dispatch(addTrackedExchanges({ aa: currentAddress, payload: sendPayload, activeWallet, action, label, category, fromAsset, amount: Math.round(sendAmount) }));
            }} disabled={isDisabled} type="primary" size="large" ref={btnRef} href={link}>{t("trade.tabs.buy_redeem.exchange", "Exchange")}</QRButton>
          </div>
          {!activeWallet && <div style={{ textAlign: "center", marginTop: 10 }}>
            <Text type="secondary" style={{ fontSize: 14, display: "block" }}>
              <Trans i18nKey="trade.tabs.buy_redeem.open_wallet">
                Clicking "Exchange" will open your Obyte wallet. <a
                  href="https://obyte.org/#download"
                  target="_blank"
                  rel="noopener"
                  onClick={
                    () => {
                      ReactGA.event({
                        category: "Stablecoin",
                        action: "Install wallet (Home page)"
                      })
                    }
                  }>Install</a> it if you don't have one yet.
              </Trans>
            </Text>
          </div>}
        </Col>
      </Row>
    </Form>
  </div>
}