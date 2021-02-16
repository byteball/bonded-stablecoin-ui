import React from "react";
import { Card, Space, Button } from "antd";
import moment from "moment";
import { useTranslation } from 'react-i18next';
import ReactGA from "react-ga";

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
  last_force_closed_protection_ratio,
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
  new_growth_factor,
  challenging_period,
  minProtectionRatio
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
    force_close_ts,
    weakerId,
    protection_ratio,
    isMy,
    closer
  } = item;
  const new_stable_amount = Math.floor(amount * growth_factor);
  const interest = new_stable_amount - stable_amount;
  const { t } = useTranslation();
  const closeUrl = generateLink(
    closer ? 1e4 : Math.ceil(amount * new_growth_factor),
    { id, commit_force_close: closer ? 1 : undefined },
    activeWallet,
    deposit_aa,
    closer ? "base" : asset
  );
  const receiveUrl = generateLink(1e4, { id }, activeWallet, deposit_aa);

  const challengeLink = item.weakerId ? generateLink(
    1e4,
    {
      id: item.id,
      challenge_force_close: 1,
      weaker_id: weakerId
    },
    activeWallet,
    deposit_aa,
    closer ? "base" : asset
  ) : null;

  const recipientName =
    interest_recipient &&
    config.interestRecipients.find((a) => a.address === interest_recipient);

  const aboveMin = {
    is: !isMy && minProtectionRatio !==null && protection_ratio > minProtectionRatio,
    info: t("trade.tabs.deposits.less_last", "This deposit's protection ratio is above the smallest")
  };

  const tooNew = {
    is: ts + min_deposit_term > timestamp || id === "dummy",
    info: t("trade.tabs.deposits.too_new", "This deposit was opened less than {{hours}} hours ago and can't be force closed yet", { hours: Number(min_deposit_term / 3600).toPrecision(3) })
  };

  const inChallengingPeriod = {
    is: (closer && force_close_ts && force_close_ts + challenging_period > timestamp),
    info: t("trade.tabs.deposits.challenging_period", "Commit will be available in {{hours}} hours when the challenging period expires", { hours: Number((force_close_ts + challenging_period - timestamp) / 3600).toPrecision(3) })
  };

  const tooltip = aboveMin.is ? aboveMin.info : (tooNew.is ? tooNew.info : (inChallengingPeriod.is ? inChallengingPeriod.info : undefined));

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
        {closer ? (
          <ShowDecimalsValue
            decimals={decimals}
            value={close_interest}
          />
        ) : (
            <ShowDecimalsValue
              decimals={decimals}
              value={interest}
            />
          )} {symbol3}
      </div>
      <div>
        <b>{t("trade.tabs.deposits.interest_recipient", "Interest recipient")}:</b>{" "}
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
        {protection && `(${protection_ratio})`}
      </div>
      <Space
        size={10}
        style={{ marginTop: 10 }}
        direction={width >= 900 ? "horizontal" : "vertical"}
      >
        {isMy && <QRButton
          href={receiveUrl}
          disabled={
            interest <= 0 ||
            (interest_recipient
              ? activeWallet !== interest_recipient
              : activeWallet !== owner) ||
            closer
          }
        >
          {t("trade.tabs.deposits.withdraw_interest", "Withdraw interest")}
        </QRButton>}
        {isMy && <Button
          disabled={owner !== activeWallet}
          onClick={() =>
            setVisibleEditRecipient({
              id,
              current: interest_recipient || owner,
            })
          }
        >
          {t("trade.tabs.deposits.edit_interest_recipient", "Edit interest recipient")}
        </Button>}
        {isMy && <Button
          disabled={owner !== activeWallet}
          onClick={() => setAddProtection(item)}
        >
          {t("trade.tabs.deposits.add_protection", "Add protection")}
        </Button>}
        {isMy && <Button
          disabled={owner !== activeWallet || !protection || protection === 0}
          onClick={() => setWithdrawProtection(item)}
        >
          {t("trade.tabs.deposits.withdraw_protection", "Withdraw protection")}
        </Button>}

        {!weakerId && <QRButton
          config={{
            tooltipMobile: tooltip,
            tooltip
          }}
          type="link"
          size="small"
          style={{ padding: 0 }}
          href={closeUrl}
          onClick={() => {
            ReactGA.event({
              category: "Stablecoin",
              action: "Close deposit",
            });
          }}
          disabled={inChallengingPeriod.is || tooNew.is || aboveMin.is}
        >
          {!closer && (isMy ? t("trade.tabs.deposits.close", "Close") : t("trade.tabs.deposits.force_close", "Force close"))}
          {closer && t("trade.tabs.deposits.commit_force_close", "Commit force close")}
        </QRButton>}
        {weakerId ? <QRButton style={{ padding: 0 }} size="small" type="link" href={challengeLink}>{t("trade.tabs.deposits.challenge", "Challenge")}</QRButton> : null}
      </Space>
    </Card>
  );
};
