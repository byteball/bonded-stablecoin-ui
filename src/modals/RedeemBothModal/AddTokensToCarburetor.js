import React, { useState, useEffect, useRef } from "react";
import { Typography, Input, Form, Space, Checkbox } from "antd";
import { generateLink } from "utils/generateLink";
import { validator } from "utils/validators";
import { useSelector } from "react-redux";
import { QRButton } from 'components/QRButton/QRButton';
import { isInteger } from "lodash";
import { getParams } from "helpers/getParams";
import { $get_exchange_result } from "helpers/bonded";
import { useTranslation } from "react-i18next";

const { Paragraph, Text } = Typography;

const f = (x) => (~(x + "").indexOf(".") ? (x + "").split(".")[1].length : 0);

export const AddTokensToCarburetor = () => {
  const { activeWallet } = useSelector((state) => state.settings);
  const { address: carburetorAddress, carburetor_balance } = useSelector((state) => state.carburetor);
  const { params, reservePrice, oraclePrice, bonded_state, symbol1, symbol2, reserve_asset_symbol, address: curve_address } = useSelector((state) => state.active);
  const [calculation, setCalculation] = useState(undefined);
  const { m, n, decimals1, decimals2, reserve_asset_decimals } = params;
  const { asset1, asset2 } = bonded_state;
  const { t } = useTranslation();
  const token1Button = useRef(null);
  const token2Button = useRef(null);

  const [countTokens1, setCountTokens1] = useState({ value: "", valid: undefined });
  const [countTokens2, setCountTokens2] = useState({ value: "", valid: undefined });
  const [withdrawAllChange, setWithdrawAllChange] = useState(false);

  const amount1InCarburetor = carburetor_balance?.[asset1] || 0;
  const amount2InCarburetor = carburetor_balance?.[asset2] || 0;

  const amount1 = (Number(countTokens1.valid && countTokens1.value) || 0) + ((amount1InCarburetor / 10 ** decimals1) || 0);
  const amount2 = (Number(countTokens2.valid && countTokens2.value) || 0) + ((amount2InCarburetor / 10 ** decimals2) || 0);

  const { p2, dilution_factor, supply1, supply2 } = bonded_state;

  const new_supply1 = supply1 - amount1 * 10 ** decimals1;
  const new_supply2 = supply2 - amount2 * 10 ** decimals2;

  const s1 = new_supply1 / 10 ** decimals1;
  const s2 = new_supply2 / 10 ** decimals2;

  const expectT1 = Math.abs(((p2 / (dilution_factor * n * (isInteger(n * 2) ? Math.sqrt(s2 ** ((n - 1) * 2)) : s2 ** (n - 1)))) ** (1 / m)) - (supply1 / 10 ** decimals1));
  const expectT2 = Math.abs(((p2 / (dilution_factor * (s1 ** m) * n)) ** (1 / (n - 1))) - (supply2 / 10 ** decimals2));

  let count1, count2;

  if (expectT2 < amount2) {
    count1 = amount1
    count2 = expectT2;
  } else if (expectT1 < amount1) {
    count1 = expectT1;
    count2 = amount2;
  } else {
    count1 = 0;
    count2 = 0;
  }

  const actualParams = getParams(params, bonded_state);

  useEffect(() => {
    const get_exchange_result =
      actualParams &&
      $get_exchange_result({
        tokens1: -(count1 * 10 ** decimals1),
        tokens2: -(count2 * 10 ** decimals2),
        params: actualParams,
        vars: bonded_state,
        oracle_price: oraclePrice,
        timestamp: Math.floor(Date.now() / 1000),
        reservePrice,
      });

    setCalculation(get_exchange_result);
  }, [activeWallet, decimals1, decimals2, bonded_state, count1, count2]);

  const [t1Form] = Form.useForm();
  const [t2Form] = Form.useForm();

  return <div>
    <div>
      <Form
        size="large"
        form={t1Form}
        onValuesChange={(value) => {
          if ("tokens1" in value) {
            if (f(value.tokens1) <= decimals1) {
              setCountTokens1((o) => ({ ...o, value: value.tokens1 }));
            }
          }
        }}
      >
        <Form.Item
          name="tokens1"
          rules={[
            {
              validator: (_, value) =>
                validator({
                  value,
                  name: "tokens1",
                  type: "number",
                  minValue: Number(1 / 10 ** decimals1).toFixed(decimals1),
                  maxDecimals: decimals1,
                  maxValue: bonded_state.supply1 / 10 ** decimals1,
                  onError: () => { setCountTokens1((o) => ({ ...o, valid: false })) },
                  onSuccess: () => { setCountTokens1((o) => ({ ...o, valid: true })) }
                }),
            },
          ]}
        >
          <Input
            onKeyPress={(ev) => {
              if (ev.key === "Enter" && token1Button.current && countTokens1.valid) {
                token1Button.current.click();
              }
            }}
            placeholder={t("modals.redeem-both.amount", "{{symbol}} amount", {symbol: symbol1 || "T1"})}
            autoComplete="off"
            suffix={symbol1 || "T1"}
            ref={token1Button} />
        </Form.Item>
      </Form>
      <QRButton
        size="large"
        style={{ marginBottom: 20 }}
        type="primary"
        ref={token1Button}
        onClick={() => { t1Form.resetFields(); setCountTokens1({ value: "", valid: false }); }}
        disabled={countTokens1 && !countTokens1.valid}
        href={generateLink(Math.round((countTokens1.value || 0) * 10 ** decimals1), { curve_address, auto_withdraw: withdrawAllChange && amount2InCarburetor > 0 ? 1 : undefined }, activeWallet, carburetorAddress, bonded_state.asset1, true)}
      >
        {amount2InCarburetor > 0 ? t("modals.redeem-both.send_execute", "Send {{count}} {{symbol}} and execute", { count: countTokens1.valid ? countTokens1.value : "", symbol: symbol1 || "T1" }) : t("modals.redeem-both.send", "Send {{count}} {{symbol}}", { count: countTokens1.valid ? countTokens1.value : "", symbol: symbol1 || "T1" })}
      </QRButton>
      <Form
        size="large"
        form={t2Form}
        onValuesChange={(value) => {
          if ("tokens2" in value) {
            if (f(value.tokens2) <= decimals2) {
              setCountTokens2((o) => ({ ...o, value: value.tokens2 }));
            }
          }
        }}
      >
        <Form.Item
          name="tokens2"
          rules={[
            {
              validator: (_, value) =>
                validator({
                  value,
                  name: "tokens2",
                  type: "number",
                  minValue: Number(1 / 10 ** decimals2).toFixed(decimals2),
                  maxDecimals: decimals2,
                  maxValue: bonded_state.supply2 / 10 ** decimals2,
                  onError: () => { setCountTokens2((o) => ({ ...o, valid: false })) },
                  onSuccess: () => { setCountTokens2((o) => ({ ...o, valid: true })) }
                }),
            },
          ]}
        >
          <Input
            onKeyPress={(ev) => {
              if (ev.key === "Enter" && token2Button.current && countTokens2.valid) {
                token2Button.current.click();
              }
            }}
            placeholder={t("modals.redeem-both.amount", "{{symbol}} amount", {symbol: symbol2 || "T2"})}
            autoComplete="off"
            suffix={symbol2 || "T2"}
          />
        </Form.Item>
      </Form>

      <QRButton
        size="large"
        type="primary"
        ref={token2Button}
        disabled={countTokens2 && !countTokens2.valid}
        onClick={() => { t2Form.resetFields(); setCountTokens2({ value: "", valid: false }); }}
        href={generateLink(Math.round((countTokens2.value || 0) * 10 ** decimals2), { curve_address, auto_withdraw: withdrawAllChange && amount1InCarburetor > 0 ? 1 : undefined }, activeWallet, carburetorAddress, bonded_state.asset2, true)}
      >
        {amount1InCarburetor > 0 ? t("modals.redeem-both.send_execute", "Send {{count}} {{symbol}} and execute", { count: countTokens2.valid ? countTokens2.value : "", symbol: symbol2 || "T2" }) : t("modals.redeem-both.send", "Send {{count}} {{symbol}}", { count: countTokens2.valid ? countTokens2.value : "", symbol: symbol2 || "T2" })}
      </QRButton>

      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Checkbox checked={withdrawAllChange} onChange={(ev) => { setWithdrawAllChange(ev.target.checked) }}>{t("modals.redeem-both.withdraw_all_label", "Withdraw all the change when executing")}</Checkbox>
      </div>

      <div style={{ marginBottom: 10 }}>
        <Text type="secondary">{t("modals.redeem-both.expect_values", "Expected values (tokens in the intermediary agent plus tokens in the fields)")}: </Text>
        <Paragraph type="secondary" style={{ marginBottom: 10 }}>
          <div>
            <b>{t("modals.redeem-both.total", "Total {{symbol}} in the intermediary agent", {symbol: symbol1 || "T1"})}</b>: {amount1}
          </div>

          <div>
            <b>{t("modals.redeem-both.total", "Total {{symbol}} in the intermediary agent", {symbol: symbol2 || "T2"})}</b>: {amount2}
          </div>

          {amount1 > 0 && amount2 > 0 && <>
            <div>
              <b>{t("modals.redeem-both.count_to_redeem", "Count {{symbol}} to redeem", {symbol: symbol1 || "T1"})}</b>: {+Number(count1).toFixed(decimals1)}
            </div>

            <div>
              <b>{t("modals.redeem-both.count_to_redeem", "Count {{symbol}} to redeem", {symbol: symbol2 || "T2"})}</b>: {+Number(count2).toFixed(decimals2)}
            </div>
            <div>
              <b>{t("modals.redeem-both.you_get", "You get {{count}} {{symbol}}", {count: calculation && Number(calculation.payout / 10 ** reserve_asset_decimals).toFixed(reserve_asset_decimals), symbol: reserve_asset_symbol})}.</b>
            </div>
          </>}
        </Paragraph>
      </div>
    </div>

    <Space wrap={true}>
      <QRButton
        size="large"
        type="primary"
        disabled={amount2InCarburetor === 0 && amount1InCarburetor === 0}
        href={generateLink(1e4, { curve_address, withdraw: 1 }, activeWallet, carburetorAddress, "base", true)}
      >
        {t("modals.redeem-both.withdraw_all","Withdraw all")}
      </QRButton>
    </Space>
  </div>
}