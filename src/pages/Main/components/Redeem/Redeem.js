import React, { useState } from "react";
import { Button, Typography } from "antd";
import { useSelector } from "react-redux";
import { Trans, useTranslation } from 'react-i18next';

import { RedeemToken } from "./forms/RedeemToken";
import { getParams } from "helpers/getParams";
import { RedeemBothModal } from "modals/RedeemBothModal/RedeemBothModal";

const { Title, Paragraph } = Typography;

export const Redeem = ({ setWalletModalVisibility }) => {
  const {
    address,
    params,
    bonded_state,
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
  const actualParams = getParams(params, bonded_state);
  const [visibleModal, setVisibleModal] = useState(false);
  return (
    <>
      <Title level={3}>{t("trade.tabs.buy_redeem.title_redeem", "Redeem token{{number}} {{symbol}}", { number: 1, symbol: symbol1 ? "(" + symbol1 + ")" : "" })}</Title>
      <RedeemToken
        address={address}
        tokens={tokens1}
        symbol={symbol1}
        symbol1={symbol1}
        symbol2={symbol2}
        setTokens={setTokens}
        bonded_state={bonded_state}
        reserve_asset_symbol={reserve_asset_symbol}
        actualParams={actualParams}
        activeWallet={activeWallet}
        reservePrice={reservePrice}
        key={1}
        type={1}
        p2={bonded_state.p2}
        oraclePrice={oraclePrice}
        supply={bonded_state.supply1 / 10 ** actualParams.decimals1}
      />
      <Title level={3}>{t("trade.tabs.buy_redeem.title_redeem", "Redeem token{{number}} {{symbol}}", { number: 2, symbol: symbol2 ? "(" + symbol2 + ")" : "" })}</Title>
      <RedeemToken
        address={address}
        tokens={tokens2}
        symbol={symbol2}
        symbol1={symbol1}
        symbol2={symbol2}
        setTokens={setTokens}
        bonded_state={bonded_state}
        reserve_asset_symbol={reserve_asset_symbol}
        actualParams={actualParams}
        reservePrice={reservePrice}
        activeWallet={activeWallet}
        key={2}
        type={2}
        p2={bonded_state.p2}
        oraclePrice={oraclePrice}
        supply={bonded_state.supply2 / 10 ** actualParams.decimals2}
      />
      <Paragraph type="secondary">
        <Trans i18nKey="trade.tabs.buy_redeem.redeem_both">
          If you want to redeem two tokens at the same time, we recommend that you use an <Button disabled={!activeWallet} onClick={() => setVisibleModal(true)} style={{ padding: 0, fontWeight: "bold" }} type="link">intermediary agent</Button>.
        </Trans>
        {" "} {!activeWallet ? <Button onClick={() => setWalletModalVisibility(true)} style={{ padding: 0, fontWeight: "bold", height: "auto" }} type="link">
          <Trans i18nKey="trade.tabs.buy_redeem.add_wallet">Please add your wallet to use</Trans>
        </Button> : null}{activeWallet ? "" : "."}
      </Paragraph>
      <RedeemBothModal visible={visibleModal} onCancel={() => setVisibleModal(false)} />
    </>
  );
};
