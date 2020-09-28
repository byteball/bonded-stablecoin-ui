import React from "react";
import { Card, Space, Button } from "antd";
import moment from "moment";
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
  const protectionRatio = Number((protection || 0) / amount).toFixed(2);
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
        <b>Opened:</b> {moment.unix(ts).format("DD-MM-YYYY HH:mm")}
      </div>
      <div>
        <b>Stable tokens:</b>{" "}
        <ShowDecimalsValue decimals={decimals} value={stable_amount} />{" "}
        {symbol3}
      </div>
      <div>
        <b>Interest tokens:</b>{" "}
        <ShowDecimalsValue decimals={decimals} value={amount} /> {symbol2}
      </div>
      <div>
        <b>Interest:</b>{" "}
        <ShowDecimalsValue decimals={decimals} value={interest} /> {symbol3}
      </div>
      <div>
        <b>Interest recipient:</b>{" "}
        {!interest_recipient || activeWallet === interest_recipient
          ? "you"
          : (recipientName && <span>{recipientName.name}</span>) ||
            interest_recipient.slice(0, 9) + "..."}
      </div>
      <div>
        <b>Protection (ratio):</b>{" "}
        {protection ? (
          <>
            <ShowDecimalsValue
              decimals={reserve_asset_decimals}
              value={protection}
            />{" "}
            {reserve_asset === "base" ? "GBYTE" : ""}{" "}
          </>
        ) : (
          "-"
        )}{" "}
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
