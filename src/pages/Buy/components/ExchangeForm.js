import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Row,
  Input,
  Select,
  Col,
  Button,
  message,
  Spin,
  Form,
} from "antd";
import ReactGA from "react-ga";
import { ArrowRightOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Decimal from "decimal.js";
import obyte from "obyte";

import { $get_exchange_result } from "helpers/bonded";
import { getOraclePrice } from "helpers/getOraclePrice";
import { generateLink } from "utils/generateLink";
import { addExchangeRecepient } from "store/actions/settings/addExchangeRecepient";
import { useGetCurrency } from "../hooks/useGetCurrency";
import { useGetRanges } from "../hooks/useGetRanges";
import { createExchange } from "../createExchange";
import { getTokens } from "../selectors/getTokens";
import { useGetRate } from "../hooks/useGetRate";
import { useWindowSize } from "hooks/useWindowSize";
import { popularCurrencies } from "../popularCurrencies";
import { useGetCompensation } from "../hooks/useGetCompensation";
import { updateExchangesForm } from "store/actions/settings/updateExchangesForm";

const { Text } = Typography;

export const ExchangeForm = () => {
  const { exchanges_recepient, exchangesFormInit } = useSelector(
    (state) => state.settings
  );
  const { reservePrice } = useSelector((state) => state.active);
  const dispatch = useDispatch();
  const [width] = useWindowSize();
  const { data, loaded } = useSelector((state) => state.list);
  const [activeCurrency, setActiveCurrency] = useState(undefined);
  const [amountCurrency, setAmountCurrency] = useState(undefined);
  const [index, setIndex] = useState(0);
  const [isCreated, setIsCreated] = useState(false);
  const [amountToken, setAmountToken] = useState(undefined);
  let tokens = getTokens(data);
  const [activeTokenAdr, setActiveTokenAdr] = useState(
    tokens[0] ? tokens[0].address : undefined
  );
  const [oraclePrice, setOraclePrice] = useState(undefined);
  const [inited, setInited] = useState(false);
  const [recipient, setRecipient] = useState(
    exchanges_recepient
      ? { value: exchanges_recepient, valid: true }
      : {
          value: undefined,
          valid: undefined,
        }
  );

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => i + 1), 1000 * 60 * 5);
    return () => {
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      if (exchangesFormInit.currentCurrency === "gbyte") {
        setAmountToken(exchangesFormInit.amountToken);
        setActiveCurrency("gbyte");
        setActiveTokenAdr(exchangesFormInit.currentToken);
      } else if (exchangesFormInit.currentCurrency !== undefined) {
        setActiveCurrency(exchangesFormInit.currentCurrency);
        setAmountCurrency(exchangesFormInit.amountCurrency);
        setActiveTokenAdr(exchangesFormInit.currentToken);
      } else {
        setActiveCurrency("gbyte");
        setAmountToken(1);
      }
      setInited(true);
    }
  }, [loaded]);

  const buyForGbyteRef = useRef(null);
  const buyRef = useRef(null);
  const currentTokenData = activeTokenAdr ? data[activeTokenAdr] : undefined;

  useEffect(() => {
    (async () => {
      if (currentTokenData) {
        const { stable_state, params } = currentTokenData;
        const price = await getOraclePrice(stable_state, params);
        setOraclePrice(price);
      }
    })();
  }, [currentTokenData, setOraclePrice]);

  const allCurrencies = useGetCurrency();
  const ranges = useGetRanges(activeCurrency);
  const exchangeRates = useGetRate(activeCurrency, index);
  const compensation = useGetCompensation(
    amountCurrency,
    activeCurrency,
    exchangeRates
  );

  const handleAmountCurrency = (ev) => {
    const value = ev.target.value;
    const reg = /^[0-9.]+$/;
    if (
      (~(value + "").indexOf(".") ? (value + "").split(".")[1].length : 0) <= 9
    ) {
      if (reg.test(String(value)) || value === "") {
        setAmountCurrency(value);
      }
    }
  };

  const handleAmountTokens = (ev, decimals) => {
    const value = ev.target.value;
    const reg = /^[0-9.]+$/;
    if (
      !currentTokenData ||
      (~(value + "").indexOf(".") ? (value + "").split(".")[1].length : 0) <=
        decimals
    ) {
      if (reg.test(String(value)) || value === "") {
        setAmountToken(value);
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (!currentTokenData) return undefined;
      const { stable_state, params } = currentTokenData;

      const result =
        currentTokenData &&
        oraclePrice &&
        oraclePrice !== undefined &&
        $get_exchange_result({
          tokens1: 0,
          tokens2: amountToken * 10 ** params.decimals2,
          params: params,
          vars: stable_state,
          oracle_price: oraclePrice,
          timestamp: Math.floor(Date.now() / 1000),
        });

      if (result && activeCurrency === "gbyte" && inited) {
        setAmountCurrency((result.reserve_needed / 10 ** 9).toFixed(9));
      }
    })();
  }, [
    amountToken,
    currentTokenData,
    activeCurrency,
    exchangeRates,
    oraclePrice,
  ]);

  useEffect(() => {
    const newData = {
      currentToken: activeTokenAdr,
      amountToken,
      currentCurrency: activeCurrency,
      amountCurrency: amountCurrency,
    };
    if (
      JSON.stringify(newData) !== JSON.stringify(exchangesFormInit) &&
      inited
    ) {
      dispatch(updateExchangesForm(newData));
    }
  }, [activeTokenAdr, amountToken, activeCurrency, amountCurrency]);

  useEffect(() => {
    if (!currentTokenData) return undefined;
    const { stable_state, params } = currentTokenData;

    const result =
      stable_state &&
      params &&
      oraclePrice &&
      activeCurrency !== "gbyte" &&
      $get_exchange_result({
        tokens1: 0,
        tokens2: 0,
        params: params,
        vars: stable_state,
        oracle_price: oraclePrice,
        timestamp: Math.floor(Date.now() / 1000),
      });
    if (result && activeCurrency !== "gbyte" && inited) {
      const expectT2 =
        (1 / result.target_p2) *
        (Number(amountCurrency) * Number(exchangeRates) + compensation);
      setAmountToken(expectT2.toFixed(params.decimals2));
    }
  }, [
    amountCurrency,
    currentTokenData,
    activeCurrency,
    exchangeRates,
    compensation,
  ]);

  const handleClickExchange = () => {
    createExchange({
      address: recipient.value,
      currency_from: activeCurrency,
      asset: currentTokenData.asset_2,
      symbol: currentTokenData.symbol,
      amount_currency: amountCurrency,
      amount_token: amountToken,
      active_currency: activeCurrency,
      recipient,
      curve_address: activeTokenAdr,
      after: ({ isError }) => {
        if (!isError) {
          message.success(
            "The exchange was successfully added to the list and is waiting for payment"
          );
          dispatch(addExchangeRecepient(recipient.value));
        } else {
          message.error("An error occurred, please try again later");
        }
        ReactGA.event({
          category: "Stablecoin",
          action: "Buy interest tokens for currency",
        });
        setAmountCurrency(undefined);
        setAmountToken(undefined);
        setIsCreated(false);
      },
    });
  };

  const handleChange = (value) => {
    if (obyte.utils.isValidAddress(value)) {
      setRecipient({ value, valid: true });
    } else {
      setRecipient({ value, valid: false });
    }
  };
  useEffect(() => {
    if (inited && activeCurrency !== "gbyte") {
      setAmountToken(undefined);
    }
  }, [activeCurrency]);

  if (!inited) return <Spin />;

  return (
    <div>
      <Row style={{ marginBottom: 20, marginTop: 50 }}>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 11 }}>
          <div style={{ marginBottom: 5 }}>
            <Text type="secondary">
              You <b>send</b>
            </Text>
          </div>
          <Input.Group compact>
            <Input
              style={{ width: "50%" }}
              size="large"
              placeholder={`Amount ${
                ranges && ranges.min ? "Min. " + ranges.min : ""
              }  ${ranges && ranges.max ? " Max. " + ranges.max : ""}`}
              onChange={handleAmountCurrency}
              value={isNaN(amountCurrency) ? undefined : amountCurrency}
              disabled={activeCurrency === "gbyte" || isCreated}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  if (activeCurrency === "gbyte") {
                    buyForGbyteRef.current.click();
                  } else {
                    buyRef.current.click();
                  }
                }
              }}
            />
            <Select
              style={{ width: "50%" }}
              size="large"
              showSearch
              placeholder="Currency to pay"
              onChange={(c) => {
                setActiveCurrency(c);
              }}
              disabled={isCreated}
              value={activeCurrency}
            >
              <Select.OptGroup label="Popular cryptocurrencies">
                <Select.Option value="gbyte" key="c-gbyte">
                  GBYTE
                </Select.Option>
                {popularCurrencies.sort().map((c) => (
                  <Select.Option key={"c-" + c} value={c}>
                    {c.toUpperCase()}
                  </Select.Option>
                ))}
              </Select.OptGroup>
              <Select.OptGroup label="Others">
                {allCurrencies.sort().map((c) => (
                  <Select.Option key={"c-" + c} value={c}>
                    {c.toUpperCase()}
                  </Select.Option>
                ))}{" "}
              </Select.OptGroup>
            </Select>
          </Input.Group>
          {activeCurrency && activeCurrency !== "gbyte" && (
            <span style={{ fontSize: 10 }}>
              You get a better rate if you pay in GBYTE
            </span>
          )}
        </Col>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 2, offset: 0 }}>
          <div
            style={{
              marginTop: width < 768 ? 10 : 27,
              textAlign: "center",
              height: 38,
              boxSizing: "border-box",
              fontSize: "1.5em",
            }}
          >
            {width < 768 ? <ArrowDownOutlined /> : <ArrowRightOutlined />}
          </div>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 11, offset: 0 }}>
          {!amountCurrency ||
          (amountToken && compensation !== undefined) ||
          activeCurrency === "gbyte" ? (
            <>
              <div style={{ marginBottom: 5 }}>
                <Text type="secondary">
                  You <b>get</b>
                </Text>
              </div>
              <Input.Group compact>
                <Input
                  style={{ width: "50%" }}
                  size="large"
                  suffix={
                    (exchangeRates || activeCurrency === "gbyte") &&
                    reservePrice &&
                    amountCurrency &&
                    amountToken && (
                      <span style={{ color: "#ccc" }}>
                        ≈{" "}
                        {activeCurrency === "gbyte"
                          ? (Number(amountCurrency) * reservePrice).toFixed(2)
                          : (
                              Number(amountCurrency) *
                              exchangeRates *
                              reservePrice
                            ).toFixed(2)}{" "}
                        USD
                      </span>
                    )
                  }
                  placeholder="Amount"
                  prefix={activeCurrency !== "gbyte" ? "≈" : ""}
                  value={isNaN(amountToken) ? undefined : amountToken}
                  onChange={(ev) =>
                    handleAmountTokens(
                      ev,
                      currentTokenData && currentTokenData.params.decimals2
                    )
                  }
                  disabled={activeCurrency !== "gbyte" || isCreated}
                  onKeyPress={(ev) => {
                    if (ev.key === "Enter") {
                      if (activeCurrency === "gbyte") {
                        buyForGbyteRef.current.click();
                      } else {
                        buyRef.current.click();
                      }
                    }
                  }}
                />
                <Select
                  style={{ width: "50%" }}
                  size="large"
                  showSearch
                  disabled={isCreated}
                  placeholder="The token you will receive"
                  onChange={(c) => setActiveTokenAdr(c)}
                  value={activeTokenAdr}
                >
                  {tokens.map((t) => (
                    <Select.Option key={"t-" + t.asset} value={t.address}>
                      {t.symbol || t.asset}{" "}
                      {" (" +
                        Decimal.mul(t.interest_rate, 100).toNumber() +
                        "%)"}
                    </Select.Option>
                  ))}
                </Select>
              </Input.Group>
              {activeCurrency !== "gbyte" && currentTokenData && (
                <>
                  <Text type="secondary">
                    Your{" "}
                    <span style={{ textTransform: "uppercase" }}>
                      {activeCurrency}
                    </span>{" "}
                    will be first exchanged for GBYTE, then GBYTE converted to{" "}
                    {currentTokenData.symbol ||
                      currentTokenData.asset_2.slice(0, 5) + "..."}
                    .{" "}
                    <span style={{ textTransform: "uppercase" }}>
                      {activeCurrency}
                    </span>{" "}
                    to GBYTE exchange is performed by{" "}
                    <a
                      href="https://simpleswap.io/"
                      target="_blank"
                      rel="noopener"
                    >
                      simpleswap.io
                    </a>
                    .{" "}
                  </Text>

                  {amountCurrency &&
                    (compensation ? (
                      <div>
                        <Text type="secondary">
                          Obyte compensates part of the exchange fees.
                        </Text>
                      </div>
                    ) : (
                      <div style={{ marginTop: 5 }}>
                        <Text type="secondary">
                          Obyte compensates part of the exchange fees but
                          today's quota is already depleted and the quoted price
                          includes the full fees. To get a better rate, try
                          again after the quota resets at midnight UTC or buy
                          with GBYTE now.
                        </Text>
                      </div>
                    ))}
                </>
              )}
              <Row>
                {activeCurrency !== "gbyte" && (
                  <Form.Item
                    hasFeedback
                    style={{ width: "100%", marginTop: 20 }}
                    extra={
                      <span>
                        <a
                          href="https://obyte.org/#download"
                          target="_blank"
                          rel="noopener"
                        >
                          Install Obyte wallet
                        </a>{" "}
                        if you don't have one yet, and copy/paste your address
                        here.
                      </span>
                    }
                    validateStatus={
                      recipient.valid !== undefined
                        ? recipient.valid
                          ? "success"
                          : "error"
                        : undefined
                    }
                  >
                    <Input
                      size="large"
                      disabled={isCreated}
                      value={recipient.value}
                      placeholder="Your Obyte wallet address"
                      onChange={(ev) => handleChange(ev.target.value)}
                    />
                  </Form.Item>
                )}
              </Row>
            </>
          ) : (
            <Row justify="center" align="middle">
              <Spin size="large" style={{ padding: 25 }} />
            </Row>
          )}
        </Col>
      </Row>

      {activeCurrency === "gbyte" ? (
        <>
          <Row justify="center" style={{ marginTop: 40 }}>
            <Button
              type="primary"
              size="large"
              disabled={
                !amountToken ||
                !amountCurrency ||
                amountCurrency === "" ||
                Number(amountCurrency) === 0
              }
              onClick={() =>
                ReactGA.event({
                  category: "Stablecoin",
                  action: "Buy interest tokens for gbyte",
                })
              }
              ref={buyForGbyteRef}
              href={
                currentTokenData &&
                amountCurrency &&
                generateLink(
                  Number(amountCurrency * 1.1).toFixed(9) * 1e9,
                  {
                    tokens2:
                      amountToken * 10 ** currentTokenData.params.decimals2,
                  },
                  undefined,
                  activeTokenAdr
                )
              }
            >
              Buy
            </Button>
          </Row>
          {amountCurrency &&
          amountCurrency !== "" &&
          Number(amountCurrency) !== 0 ? (
            <div style={{ textAlign: "center" }}>
              <Text type="secondary" style={{ fontSize: 10 }}>
                1% was added to protect against price volatility, you'll get
                this amount back if the prices don't change.
              </Text>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <Row justify="center">
            <Button
              type="primary"
              size="large"
              ref={buyRef}
              loading={isCreated || ranges.min === undefined}
              disabled={
                !recipient.valid ||
                !amountCurrency ||
                !amountToken ||
                compensation === undefined ||
                ranges === undefined ||
                ranges.min === undefined ||
                Number(ranges.min) > amountCurrency
              }
              onClick={() => {
                setIsCreated(true);
                handleClickExchange();
              }}
            >
              Buy
            </Button>
          </Row>
          {activeCurrency &&
          ranges &&
          ranges.min &&
          Number(ranges.min) > amountCurrency ? (
            <div style={{ textAlign: "center" }}>
              <Text type="secondary" style={{ fontSize: 12, color: "red" }}>
                Sorry, the minimum {String(activeCurrency).toUpperCase()} amount
                is {ranges.min}. Please increase the number of interest tokens
              </Text>
            </div>
          ) : null}
        </>
      )}
      <div style={{ fontSize: 16, textAlign: "center", padding: 10 }}>
        For buying growth tokens (GRD, GRB, etc) and redemption, go to the{" "}
        <Link to="/trade">trading page</Link>.
      </div>
    </div>
  );
};
