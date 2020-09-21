import React from "react";
import { Card, Space, Button } from "antd";
import { generateLink } from "utils/generateLink";
import { ShowDecimalsValue } from "components/ShowDecimalsValue/ShowDecimalsValue";
import config from "config";
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
  timestamp,
  width,
}) => {
  const {
    protection,
    id,
    owner,
    stable_amount,
    amount,
    interest_recipient,
    ts,
  } = item;
  const new_stable_amount = Math.floor(amount * growth_factor);
  const interest = new_stable_amount - stable_amount;
  const closeUrl = generateLink(
    stable_amount,
    { id },
    activeWallet,
    deposit_aa,
    encodeURIComponent(asset)
  );
  const receiveUrl = generateLink(1e4, { id }, activeWallet, deposit_aa);
  const protectionView = protection
    ? (protection / 10 ** reserve_asset_decimals).toFixed(
        reserve_asset_decimals
      )
    : 0;
  const protectionRatio = Number((protection || 0) / amount).toFixed(2);
  const recepientName =
    interest_recipient &&
    config.interestRecipients.find((a) => a.address === interest_recipient);
  return (
    <Card
      style={{ marginBottom: 10, wordBreak: "break-all" }}
      bordered={false}
      size="small"
    >
      <div>
        <b>ID:</b> {id}
      </div>
      <div>
        <b>Stable:</b>{" "}
        <ShowDecimalsValue decimals={decimals} value={stable_amount} />
      </div>
      <div>
        <b>Interest:</b>{" "}
        <ShowDecimalsValue decimals={decimals} value={interest} />
      </div>
      <div>
        <b>Interest recipient:</b>{" "}
        {!interest_recipient || activeWallet === interest_recipient
          ? "you"
          : (recepientName && <span>{recepientName.name}</span>) ||
            interest_recipient.slice(0, 9) + "..."}
      </div>
      <div>
        <b>Protection (ratio):</b> {protection ? protectionView : "-"}{" "}
        {protection && `(${protectionRatio})`}
      </div>
      <Space
        size={10}
        style={{ marginTop: 10 }}
        direction={width >= 800 ? "horizontal" : "vertical"}
      >
        <Button
          href={receiveUrl}
          disabled={
            interest <= 0 ||
            (interest_recipient
              ? activeWallet !== interest_recipient
              : activeWallet !== owner)
          }
        >
          Withdraw interest
        </Button>
        <Button
          disabled={owner !== activeWallet}
          onClick={() =>
            setVisibleEditRecipient({
              id,
              current: interest_recipient || owner,
            })
          }
        >
          Edit recipient
        </Button>
        <Button
          disabled={owner !== activeWallet}
          onClick={() => setAddProtection(item)}
        >
          Add protection
        </Button>
        <Button
          disabled={owner !== activeWallet || !protection || protection === 0}
          onClick={() => setWithdrawProtection(item)}
        >
          Withdraw protection
        </Button>
        <Button
          href={closeUrl}
          disabled={owner !== activeWallet || ts + 2 * 3600 > timestamp}
        >
          Close
        </Button>
      </Space>
    </Card>
  );
};
