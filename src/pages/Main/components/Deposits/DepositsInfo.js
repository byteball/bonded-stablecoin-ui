import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { useTranslation, Trans } from 'react-i18next';
import config from "config";

const { Title, Text } = Typography;

export const DepositsInfo = ({ isActive,
  onOpenDeposit,
  minDepositTermInHours,
  lastForceClosedProtectionRatio,
  symbol2,
  symbol3,
  asset
}) => {
  const { t } = useTranslation();

  const odexUrl = `https://odex.ooo/trade/${(symbol3 === 'OUSD' ? 'GBYTE' : symbol3)}/OUSD`;
  let oswapUrl = 'https://oswap.io/#/swap';

  switch (symbol3) {
    case 'OUSD':
      oswapUrl += '/I7UKETQTWW5H25BPLIIXLZTQBAKYTTN2?reverse=1'; // OUSD to GBYTE
      break;
    case 'OBIT':
      oswapUrl += '/QFIBPWBW6ADYSIZPTJ2FAHNARLHPGAN4?reverse=1'; // OUSD to OBIT
      break;
    case 'OAU':
      oswapUrl += '/C3XRJVE5RGJLTZ2V3K3NLS2IY5RIQPRI'; // OUSD to OAU
      break
    default:
      oswapUrl += `/${encodeURIComponent(asset)}`; // GBYTE to any (doesn't support reverse)
      break;
  }

  return <>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 10,
      }}
    >
      <Title level={3}>{t("trade.tabs.deposits.title", "Deposits")}</Title>
      <Button
        disabled={!isActive}
        type="primary"
        size="large"
        icon={<PlusOutlined />}
        onClick={onOpenDeposit}
      >
        {t("trade.tabs.deposits.open", "Open deposit")}
      </Button>
    </div>

    <p>
      <Text type="secondary">
        <Trans i18nKey="trade.tabs.deposits.create" symbol3={symbol3} symbol2={symbol2}>
          Create a deposit to exchange your {{ symbol2: symbol2 || "T2" }} for stable tokens {{ symbol3: symbol3 || "T3" }} and periodically withdraw interest in {{ symbol3: symbol3 || "T3" }} as it accrues. You can trade {{ symbol3: symbol3 || "T3" }} on <a href={oswapUrl} target="_blank" rel="noopener">Oswap.io</a> or <a href={odexUrl} target="_blank" rel="noopener">ODEX</a>.
        </Trans>
      </Text>
    </p>

    {lastForceClosedProtectionRatio !== undefined ? (
      <Text type="secondary">
        <p>
          <b>{t("trade.tabs.deposits.protection_ratio", "Last force closed protection ratio")}:</b>{" "}
          {lastForceClosedProtectionRatio}
        </p>
      </Text>
    ) : ""}

    <p>
      <Text type="secondary">
        <Trans i18nKey="trade.tabs.deposits.close_info" hours={minDepositTermInHours}>
          A new deposit cannot be closed within <b>{{ hours: minDepositTermInHours }} hours</b> after opening.
        </Trans>
      </Text>
    </p>

    <p>
      <Text type="secondary">
        <Trans i18nKey="trade.tabs.deposits.highlighted">
          Deposits with insufficient protection are <span style={{ color: "#e74c3c" }}>highlighted in red</span>.
        </Trans>
      </Text>
    </p>
  </>
}

export const ForceCloseDepositsInfo = ({
  challengingPeriodInHours,
  depositAa,
  symbol2,
  symbol3
}) => {
  return (<>
    <p>
      <Text type="secondary">
        <Trans i18nKey="trade.tabs.deposits.force_close_info" symbol3={symbol3 || "T3"} symbol2={symbol2 || "T2"}>
          You can close other people's deposits to exchange your {{ symbol3: symbol3 || "T3" }} for {{ symbol2: symbol2 || "T2" }}. The owner of the closed deposit will simply stop receiving interest, there will be no direct loss to them. Only the least protected deposits can be closed, you lose money if you try to close any deposit that is not least protected.
        </Trans>
      </Text>
    </p>

    <p>
      <Text type="secondary">
        <Trans i18nKey="trade.tabs.deposits.challenging_period_info" symbol2={symbol2 || "T2"} challengingPeriodInHours={challengingPeriodInHours}>
          Closing starts a <b>{{ challengingPeriodInHours }}-hour challenging period</b> during which your close request can be challenged if there is another deposit with an even smaller protection ratio. After the challenging period expires, you will be able to commit the close and the {{ symbol2: symbol2 || "T2" }} from the deposit will be released to you.
        </Trans>
      </Text>
    </p>

    <p>
      <Text type="warning">
        <Trans i18nKey="trade.tabs.deposits.warning">
          This page is beta, it may have bugs and display incorrect information which can lead you to trying to close a deposit that is not least protected and losing money. Double check this information using state vars on the <a target="_blank" rel="noopener" href={`https://${config.TESTNET ? "testnet" : ""}explorer.obyte.org/#${depositAa}`}>explorer</a>.
        </Trans>
      </Text>
    </p>

  </>)
}

export const InterestRecipientDepositsInfo = () => {
  return (
    <p>
      <Text type="secondary">
        <Trans i18nKey="trade.tabs.deposits.interest_recipient_tab_info">
          Other people's deposits where you are interest recipient. Use this page to withdraw interest.
        </Trans>
      </Text>
    </p>
  )
}