import React, { useState } from "react";
import { Typography } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

import { RedeemToken } from "./forms/RedeemToken";
import { getParams } from "helpers/getParams";

const { Title } = Typography;

export const Redeem = () => {
  const {
    address,
    params,
    stable_state,
    symbol1,
    symbol2,
    reservePrice,
    oraclePrice,
    reserve_asset_symbol
  } = useSelector((state) => state.active);
  const { activeWallet } = useSelector((state) => state.settings);
  const [tokens, setTokens] = useState([]);
  const { t } = useTranslation();
  const tokens1Field = tokens.find((t) => t.name[0] === "r_tokens1");
  const tokens2Field = tokens.find((t) => t.name[0] === "r_tokens2");
  const tokens1 = tokens1Field ? tokens1Field.value : 0;
  const tokens2 = tokens2Field ? tokens2Field.value : 0;
  const actualParams = getParams(params, stable_state);
  return (
    <>
      <Title level={3}>{t("trade.tabs.buy_redeem.title_redeem", "Redeem token{{number}} {{symbol}}", { number: 1, symbol: symbol1 ? "(" + symbol1 + ")" : "" })}</Title>
      <RedeemToken
        address={address}
        tokens={tokens1}
        symbol={symbol1}
        setTokens={setTokens}
        stable_state={stable_state}
        reserve_asset_symbol={reserve_asset_symbol}
        actualParams={actualParams}
        activeWallet={activeWallet}
        reservePrice={reservePrice}
        key={1}
        type={1}
        p2={stable_state.p2}
        oraclePrice={oraclePrice}
        supply={stable_state.supply1 / 10 ** actualParams.decimals1}
      />
      <Title level={3}>{t("trade.tabs.buy_redeem.title_redeem", "Redeem token{{number}} {{symbol}}", { number: 2, symbol: symbol2 ? "(" + symbol2 + ")" : "" })}</Title>
      <RedeemToken
        address={address}
        tokens={tokens2}
        symbol={symbol2}
        setTokens={setTokens}
        stable_state={stable_state}
        reserve_asset_symbol={reserve_asset_symbol}
        actualParams={actualParams}
        reservePrice={reservePrice}
        activeWallet={activeWallet}
        key={2}
        type={2}
        p2={stable_state.p2}
        oraclePrice={oraclePrice}
        supply={stable_state.supply2 / 10 ** actualParams.decimals2}
      />
    </>
  );
};
