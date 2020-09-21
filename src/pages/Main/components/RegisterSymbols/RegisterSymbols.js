import React, { useState, useEffect } from "react";
import { Typography, Steps, Input, Form, Button, Space } from "antd";
import config from "config";
import socket from "services/socket";
import { isBoolean } from "lodash";
import { generateLink } from "utils/generateLink";
import { useWindowSize } from "hooks/useWindowSize.js";

const { Title, Text } = Typography;
const { Step } = Steps;

const reservedTokens = ["GBYTE", "MBYTE", "KBYTE", "BYTE"];
const initStateValue = {
  value: "",
  valid: false,
};
export const RegisterSymbols = (props) => {
  let initCurrentStep = 0;
  if (!props.symbol1 && !props.pendings.tokens1) {
    initCurrentStep = 0;
  } else if (!props.symbol2 && !props.pendings.tokens2) {
    initCurrentStep = 1;
  } else if (!props.symbol3 && !props.pendings.tokens3) {
    initCurrentStep = 2;
  }
  const [width] = useWindowSize();
  const [currentStep, setCurrentStep] = useState(initCurrentStep);
  const currentSymbol = currentStep + 1;
  const [isAvailable, setIsAvailable] = useState(undefined);
  const [symbolByCurrentAsset, setSymbolByCurrentAsset] = useState(undefined);
  const [token, setToken] = useState(initStateValue);
  const [tokenSupport, setTokenSupport] = useState(initStateValue);
  const [descr, setDescr] = useState(initStateValue);

  const currentAsset = props["asset" + currentSymbol];
  const currentDecimals =
    currentSymbol === 3 || currentSymbol === 2
      ? props.decimals2
      : props.decimals1;

  useEffect(() => {
    if (!props.symbol1 && !props.pendings.tokens1) {
      setCurrentStep(0);
    } else if (!props.symbol2 && !props.pendings.tokens2) {
      setCurrentStep(1);
    } else if (!props.symbol3 && !props.pendings.tokens3) {
      setCurrentStep(2);
    }
  }, [props]);

  useEffect(() => {
    setIsAvailable(undefined);
    setToken(initStateValue);
    setTokenSupport(initStateValue);
    setDescr(initStateValue);
    (async () => {
      const symbol = await socket.api.getSymbolByAsset(
        config.TOKEN_REGISTRY,
        currentAsset
      );
      if (symbol !== currentAsset.replace(/[+=]/, "").substr(0, 6)) {
        setSymbolByCurrentAsset(symbol);
      } else {
        setSymbolByCurrentAsset(null);
      }
    })();
  }, [currentStep, setSymbolByCurrentAsset, currentAsset]);

  useEffect(() => {
    if (isAvailable === null) {
      (async () => {
        const asset = await socket.api.getAssetBySymbol(
          config.TOKEN_REGISTRY,
          token.value
        );
        if (!!asset) {
          setIsAvailable(false);
        } else {
          setIsAvailable(true);
          const initDescr =
            currentSymbol === 3
              ? `Stable token for bonded stablecoin (${props.address})`
              : `Token${currentSymbol} for bonded stablecoin (${props.address})`;
          setDescr({
            value: initDescr,
            valid: true,
          });
        }
      })();
    }
  }, [isAvailable, props.address, currentSymbol]);

  const data = {
    asset: currentAsset,
    symbol: token.value,
    decimals:
      (isAvailable && !symbolByCurrentAsset && currentDecimals) || undefined,
    description:
      (isAvailable && descr.valid && !symbolByCurrentAsset && descr.value) ||
      undefined,
  };

  const handleChangeSymbol = (ev) => {
    const targetToken = ev.target.value.toUpperCase();
    // eslint-disable-next-line no-useless-escape
    const reg = /^[0-9A-Z_\-]+$/;
    if (reg.test(targetToken) || !targetToken) {
      if (targetToken.length > 0) {
        if (targetToken.length <= 40) {
          if (reservedTokens.find((t) => targetToken === t)) {
            setToken({ ...token, value: targetToken, valid: false });
          } else {
            setToken({ ...token, value: targetToken, valid: true });
          }
        } else {
          setToken({
            ...token,
            value: targetToken,
            valid: false,
          });
        }
      } else {
        setToken({ ...token, value: targetToken, valid: false });
      }
    }
  };
  const handleChangeSupport = (ev) => {
    const support = ev.target.value;
    const reg = /^[0-9.]+$/;
    const f = (x) =>
      ~(x + "").indexOf(".") ? (x + "").split(".")[1].length : 0;
    if (support) {
      if (reg.test(support) && f(support) <= 9) {
        if (Number(support) >= 0.1) {
          setTokenSupport({ ...token, value: support, valid: true });
        } else {
          setTokenSupport({ ...token, value: support, valid: false });
        }
      }
    } else {
      setTokenSupport({ ...token, value: "", valid: false });
    }
  };
  const handleChangeDescr = (ev) => {
    const { value } = ev.target;
    if (value.length < 140) {
      setDescr({ value, valid: true });
    } else {
      setDescr({ value, valid: false });
    }
  };

  let helpSymbol = undefined;
  if (isBoolean(isAvailable)) {
    if (isAvailable) {
      helpSymbol = `Symbol name ${token.value} is available, you can register it`;
    } else {
      helpSymbol =
        "This token name is already taken. This will start a dispute";
    }
  }
  return (
    <div>
      <Title level={3} type="secondary">
        Register symbols
      </Title>

      <Steps
        current={currentStep}
        style={{ marginTop: 20 }}
        direction={width > 800 ? "horizontal" : "vertical"}
      >
        <Step title="Symbol for tokens1" />
        <Step title="Symbol for tokens2" />
        <Step title="Symbol for stable tokens" />
      </Steps>
      {symbolByCurrentAsset && (
        <p style={{ paddingTop: 20, maxWidth: 600 }}>
          <Text type="secondary">
            This stablecoin already has a symbol {symbolByCurrentAsset} assigned
            to it. Attempting to assign a new symbol will start a dispute
            process which can take more than 30 days. The symbol that gets more
            support (in terms of GBYTE deposits) eventually wins.
          </Text>
        </p>
      )}
      <Form size="large" style={{ marginTop: 35 }}>
        <Form.Item
          hasFeedback
          extra={helpSymbol}
          validateStatus={
            (isAvailable === false && "warning") ||
            (isAvailable === true && "success")
          }
        >
          <Input
            placeholder="Symbol"
            allowClear
            autoFocus={true}
            disabled={isBoolean(isAvailable)}
            autoComplete="off"
            value={token.value}
            onChange={handleChangeSymbol}
          />
        </Form.Item>
        {isAvailable !== undefined && isAvailable !== null && (
          <Form.Item>
            <Input
              placeholder="Support (Min amount 0.1 GB)"
              suffix="GB"
              autoComplete="off"
              value={tokenSupport.value}
              onChange={handleChangeSupport}
              autoFocus={isBoolean(isAvailable)}
            />
          </Form.Item>
        )}
        {isAvailable === true && !symbolByCurrentAsset && (
          <Form.Item>
            <Form.Item
              hasFeedback
              // validateStatus={descr && !descr.valid ? "error" : null}
            >
              <Input.TextArea
                style={{ fontSize: 16 }}
                rows={5}
                value={descr.value}
                onChange={handleChangeDescr}
                placeholder="Description of an asset (up to 140 characters)"
              />
            </Form.Item>
          </Form.Item>
        )}
        <Form.Item>
          <Space>
            {isAvailable === undefined || isAvailable === null ? (
              <Button
                onClick={() => {
                  setIsAvailable(null);
                }}
                loading={isAvailable === null}
                disabled={token.value === "" || !token.valid}
              >
                Check availability
              </Button>
            ) : (
              <Button
                disabled={!token.valid || !tokenSupport.valid}
                href={generateLink(
                  tokenSupport.value * 1e9,
                  data,
                  props.activeWallet,
                  config.TOKEN_REGISTRY
                )}
              >
                {isAvailable && !symbolByCurrentAsset
                  ? "Register"
                  : "Register anyway"}
              </Button>
            )}
            <Button
              type="link"
              danger
              onClick={() => {
                props.handleSkip(true);
              }}
            >
              Skip
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
