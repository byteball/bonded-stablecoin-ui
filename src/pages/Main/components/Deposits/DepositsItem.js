import React from "react";
import { Card, Space, Button } from "antd";
import moment from "moment";
import { useTranslation } from 'react-i18next';
import { generateLink } from "utils/generateLink";
import { ShowDecimalsValue } from "components/ShowDecimalsValue/ShowDecimalsValue";
import config from "config";
import { QRButton } from "components/QRButton/QRButton";
export const DepositsItem = ({
  decimals,
  growth_factor,
  activeWallet,
  deposit_aa,
  asset,
  setVisibleEditRecipient,
  setWithdrawProtection,
  setAddProtection,
  item,
  reserve_asset_decimals,
  min_deposit_term,
  reserve_asset_symbol,
  reserve_asset,
  timestamp,
  width,
  symbol2,
  symbol3,
}) => {
  const {
    protection,
    id,
    owner,
    stable_amount,
    amount,
    interest_recipient,
    ts,
    close_interest,
  } = item;
  const new_stable_amount = Math.floor(amount * growth_factor);
  const interest = new_stable_amount - stable_amount;
  const { t } = useTranslation();
  const closeUrl = generateLink(
    stable_amount,
    { id },
    activeWallet,
    deposit_aa,
    asset
  );
  const receiveUrl = generateLink(1e4, { id }, activeWallet, deposit_aa);
  const protectionRatio =
    Number(
      (protection || 0) /
      10 ** config.reserves.base.decimals /
      (amount / 10 ** decimals)
    ).toPrecision(3);
  const recipientName =
    interest_recipient &&
    config.interestRecipients.find((a) => a.address === interest_recipient);
  return (
    <Card
      style={{ marginBottom: 10, wordBreak: "break-all" }}
      bodyStyle={{ paddingLeft: 0 }}
      bordered={false}
      size="small"
    >
      <div>
        <b>{t("trade.tabs.deposits.opened", "Opened")}:</b> {moment.unix(ts).format("DD-MM-YYYY HH:mm")}
      </div>
      <div>
        <b>{t("trade.tabs.deposits.interest_title", "Interest tokens")}:</b>{" "}
        <ShowDecimalsValue decimals={decimals} value={amount} /> {symbol2}
      </div>
      <div>
        <b>{t("trade.tabs.deposits.stable_title", "Stable tokens")}:</b>{" "}
        <ShowDecimalsValue decimals={decimals} value={stable_amount} />{" "}
        {symbol3}
      </div>
      <div>
        <b>{t("trade.tabs.deposits.interest", "Interest")}:</b>{" "}
        <ShowDecimalsValue decimals={decimals} value={interest} /> {symbol3}
      </div>
      <div>
        <b>{t("trade.tabs.deposits.interest_recipient","Interest recipient")}:</b>{" "}
        {!interest_recipient || activeWallet === interest_recipient
          ? "you"
          : (recipientName && <span>{recipientName.name}</span>) ||
          interest_recipient.slice(0, 9) + "..."}
      </div>
      <div>
        <b>{t("trade.tabs.deposits.protection", "Protection (ratio)")}:</b>{" "}
        {protection ? (
          <>
            <ShowDecimalsValue
              decimals={reserve_asset_decimals}
              value={protection}
            />{" "}
            {reserve_asset === "base"
              ? "GBYTE"
              : config.reserves[reserve_asset]
                ? config.reserves[reserve_asset].name
                : reserve_asset_symbol || ''}{" "}
          </>
        ) : (
            "-"
          )}{" "}
        {protection && `(${protectionRatio})`}
      </div>
      <Space
        size={10}
        style={{ marginTop: 10 }}
        direction={width >= 900 ? "horizontal" : "vertical"}
      >
        <QRButton
          href={receiveUrl}
          disabled={
            interest <= 0 ||
            (interest_recipient
              ? activeWallet !== interest_recipient
              : activeWallet !== owner) ||
            close_interest
          }
        >
          {t("trade.tabs.deposits.withdraw_interest","Withdraw interest")}
        </QRButton>
        <Button
          disabled={owner !== activeWallet}
          onClick={() =>
            setVisibleEditRecipient({
              id,
              current: interest_recipient || owner,
            })
          }
        >
          {t("trade.tabs.deposits.edit_interest_recipient", "Edit interest recipient")}
        </Button>
        <Button
          disabled={owner !== activeWallet}
          onClick={() => setAddProtection(item)}
        >
          {t("trade.tabs.deposits.add_protection", "Add protection")}
        </Button>
        <Button
          disabled={owner !== activeWallet || !protection || protection === 0}
          onClick={() => setWithdrawProtection(item)}
        >
          {t("trade.tabs.deposits.withdraw_protection", "Withdraw protection")}
        </Button>
        <QRButton
          href={closeUrl}
          disabled={
            (interest_recipient
              ? activeWallet !== interest_recipient
              : activeWallet !== owner) ||
            ts + min_deposit_term > timestamp ||
            close_interest
          }
        >
          {t("trade.tabs.deposits.close", "Close")}
        </QRButton>
      </Space>
    </Card>
  );
};
