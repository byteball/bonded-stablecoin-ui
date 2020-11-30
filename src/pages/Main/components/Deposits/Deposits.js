import React, { useState, useEffect } from "react";
import { Table, Button, Space, List, Typography, Tooltip } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  ExportOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import moment from "moment";
import ReactGA from "react-ga";

import { generateLink } from "utils/generateLink";
import { $get_growth_factor } from "helpers/bonded.js";
import { EditRecipientModal } from "modals/EditRecipientModal/EditRecipientModal";
import { OpenDepositModal } from "modals/OpenDepositModal/OpenDepositModal";
import { useWindowSize } from "hooks/useWindowSize";
import { DepositsItem } from "./DepositsItem";
import { ShowDecimalsValue } from "components/ShowDecimalsValue/ShowDecimalsValue";
import { getParams } from "helpers/getParams";
import { Label } from "components/Label/Label";
import { AddProtectionModal } from "modals/AddProtectionModal/AddProtectionModal";
import { WithdrawProtectionModal } from "modals/WithdrawProtectionModal/WithdrawProtectionModal";
import config from "config";

const { Title, Text } = Typography;

export const Deposits = ({ openWalletModal }) => {
  const [width] = useWindowSize();
  const [visibleEditRecipient, setVisibleEditRecipient] = useState(false);
  const [visibleOpenDeposit, setVisibleOpenDeposit] = useState(false);
  const [addProtection, setAddProtection] = useState(undefined);
  const [withdrawProtection, setWithdrawProtection] = useState(undefined);
  const {
    deposit_state,
    params,
    deposit_aa,
    stable_state,
    symbol2,
    symbol3,
    reserve_asset_symbol
  } = useSelector((state) => state.active);
  const actualParams = getParams(params, stable_state);
  const [timestamp, setTimestamp] = useState(moment().unix());
  const { activeWallet } = useSelector((state) => state.settings);
  const { last_force_closed_protection_ratio } = deposit_state;
  const growth_factor = $get_growth_factor(
    actualParams.interest_rate,
    timestamp,
    stable_state.rate_update_ts,
    stable_state.growth_factor
  );
  const new_growth_factor = $get_growth_factor(
    actualParams.interest_rate,
    timestamp + 3600 * 24 * 30,
    stable_state.rate_update_ts,
    stable_state.growth_factor
  );

  useEffect(() => {
    const updateTimestamp = setInterval(() => {
      setTimestamp((t) => t + 3);
    }, 3000);
    return () => {
      clearInterval(updateTimestamp);
    };
  }, []);

  if (!activeWallet) {
    return (
      <div style={{ textAlign: "center", cursor: "pointer", color: "#1890ff" }} onClick={openWalletModal}>
        Please add the address of your wallet in order to view/open deposits.
      </div>
    );
  }
  const columns = [
    {
      title: "Opened",
      dataIndex: "ts",
      key: "ts",
      render: (value) => {
        return (
          <Tooltip title={moment.unix(value).format("DD-MM-YYYY HH:mm")}>
            {timestamp - value > 60 * 60 * 24
              ? moment.unix(value).format("DD-MM-YYYY")
              : moment.unix(value).format("HH:mm")}
          </Tooltip>
        );
      },
    },
    {
      title: (
        <Label
          label={symbol2 || "Interest tokens"}
          descr="Amount of interest tokens"
        />
      ),
      dataIndex: "amount",
      key: "interest",
      render: (value) => {
        return (
          <ShowDecimalsValue decimals={actualParams.decimals2} value={value} />
        );
      },
    },
    {
      title: (
        <Label
          label={symbol3 || "Stable"}
          descr="Amount of stable tokens issued against the deposit"
        />
      ),
      dataIndex: "stable_amount",
      key: "stable",
      render: (value) => {
        return (
          <ShowDecimalsValue decimals={actualParams.decimals2} value={value} />
        );
      },
    },

    {
      title: (
        <Label
          label="Protection (ratio)"
          descr={`Additional deposit in ${
            actualParams.reserve_asset in config.reserves
              ? config.reserves[actualParams.reserve_asset].name
              : reserve_asset_symbol || "reserve asset"
          } that protects the deposit from being closed by others. The deposit with the least ratio of protection to deposit amount can be closed by anybody. There is no direct loss to you when your deposit is closed but you stop receiving interest from it.`}
        />
      ),
      dataIndex: "protection",
      key: "protection",
      render: (value, records) => {
        const ratio = Number(
          (value || 0) /
            10 ** config.reserves.base.decimals /
            (records.amount / 10 ** actualParams.decimals2)
        ).toPrecision(3);
        return (
          <>
            {value ? (
              <>
                <ShowDecimalsValue
                  decimals={actualParams.reserve_asset_decimals}
                  value={value}
                />{" "}
                {actualParams.reserve_asset === "base"
                  ? "GBYTE"
                  : config.reserves[actualParams.reserve_asset]
                    ? config.reserves[actualParams.reserve_asset].name
                    : reserve_asset_symbol || ''}{" "}
                ({ratio})
              </>
            ) : (
              0
            )}
            <Tooltip title="Add protection">
              <Button
                type="link"
                disabled={records.owner !== activeWallet}
                onClick={() => setAddProtection(records)}
                size="middle"
                icon={<DownloadOutlined />}
              />
            </Tooltip>
            <Tooltip title="Withdraw protection">
              <Button
                disabled={
                  records.owner !== activeWallet ||
                  !records.protection ||
                  records.protection === 0
                }
                type="link"
                size="middle"
                onClick={() => setWithdrawProtection(records)}
                icon={<ExportOutlined />}
              />
            </Tooltip>
          </>
        );
      },
    },
    {
      title: (
        <Label label="Interest" descr="Interest available for withdrawal" />
      ),
      dataIndex: "amount",
      key: "amount",
      render: (value, records) => {
        const new_stable_amount = Math.floor(records.amount * growth_factor);
        const interest = new_stable_amount - records.stable_amount;

        return (
          <>
            {records.close_interest ? (
              <ShowDecimalsValue
                decimals={actualParams.decimals2}
                value={records.close_interest}
              />
            ) : (
              <ShowDecimalsValue
                decimals={actualParams.decimals2}
                value={interest}
              />
            )}
            <Tooltip title="Withdraw interest">
              <Button
                type="link"
                href={generateLink(
                  1e4,
                  { id: records.id },
                  activeWallet,
                  deposit_aa
                )}
                disabled={
                  interest <= 0 ||
                  (records.interest_recipient
                    ? activeWallet !== records.interest_recipient
                    : activeWallet !== records.owner) ||
                  records.close_interest
                }
                icon={<ExportOutlined />}
              />
            </Tooltip>
          </>
        );
      },
    },
    {
      title: (
        <Label
          label="Interest recipient"
          descr="Who receives interest (deposit owner by default)"
        />
      ),
      dataIndex: "interest_recipient",
      render: (value, records) => {
        const recipientName =
          value && config.interestRecipients.find((a) => a.address === value);
        return (
          <>
            {!value || value === records.owner
              ? "you"
              : (recipientName && (
                  <span style={{ fontSize: 12 }}>{recipientName.name}</span>
                )) ||
                value.slice(0, 9) + "..."}

            <Tooltip title="Edit interest recipient">
              <Button
                type="link"
                size="small"
                style={{ padding: 0 }}
                disabled={records.owner !== activeWallet}
                onClick={() =>
                  setVisibleEditRecipient({
                    id: records.id,
                    current: records.interest_recipient || records.owner,
                  })
                }
                icon={<EditOutlined />}
              />
            </Tooltip>
          </>
        );
      },
    },
    {
      render: (_, records) => {
        const closeUrl = generateLink(
          Math.ceil(records.amount * new_growth_factor),
          { id: records.id },
          activeWallet,
          deposit_aa,
          deposit_state.asset
        );
        return (
          <Space size={10} align="center">
            <Button
              type="link"
              size="small"
              href={closeUrl}
              onClick={() => {
                ReactGA.event({
                  category: "Stablecoin",
                  action: "Close deposit",
                });
              }}
              disabled={
                activeWallet !== records.owner ||
                records.ts + actualParams.min_deposit_term > timestamp ||
                records.close_interest
              }
            >
              Close
            </Button>
          </Space>
        );
      },
    },
  ];
  const deposits = {};
  const forceClose = {};
  for (let row in deposit_state) {
    if (row.includes("_force_close")) {
      const id = row.split("_")[1];
      forceClose[id] = { ...deposit_state[row] };
    } else if (row.includes("deposit_")) {
      const id = row.split("_")[1];
      deposits[id] = { ...deposit_state[row] };
    }
  }
  for (let id in forceClose) {
    if (id in deposits) {
      deposits[id].close_interest = forceClose[id].interest;
    }
  }
  const source = [];
  for (let id in deposits) {
    if (
      deposits[id].owner === activeWallet ||
      deposits[id].interest_recipient === activeWallet
    ) {
      source.push({ id, ...deposits[id], key: id });
    }
  }
  const localeForEmpty = stable_state.interest_rate ? (
    <span>
      You don't have any open deposits, please{" "}
      <Button
        type="link"
        style={{ padding: 0 }}
        onClick={() => setVisibleOpenDeposit(true)}
      >
        open a new one
      </Button>{" "}
      or change your wallet address.
    </span>
  ) : 'Deposits are disabled when there is no interest rate.';

  const odexUrl = `https://odex.ooo/trade/${ (symbol3 === 'OUSD' ? 'GBYTE' : symbol3) }/OUSD`;
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
      oswapUrl += `/${encodeURIComponent(deposit_state.asset)}`; // GBYTE to any (doesn't support reverse)
      break;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Title level={3}>Deposits</Title>
        <Button
          disabled={!stable_state.interest_rate}
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setVisibleOpenDeposit(true)}
        >
          Open deposit
        </Button>
      </div>
      <p>
        <Text type="secondary">
          Create a deposit to exchange your {symbol2 || "interest tokens"} for stable tokens{" "}
          {symbol3 || ""} and periodically withdraw interest in {symbol3 || ""} as it
          accrues. You can trade {symbol3 || "stable tokens"} on <a href={oswapUrl} target="_blank" rel="noopener">Oswap.io</a> or <a href={odexUrl} target="_blank" rel="noopener">ODEX</a>.
        </Text>
      </p>
      {last_force_closed_protection_ratio !==undefined ? (
        <Text type="secondary">
          <p>
            <b>Last force closed protection ratio:</b>{" "}
            {last_force_closed_protection_ratio}
          </p>
        </Text>
      ) : ""}
      <p>
        <Text type="secondary">
          A new deposit cannot be closed within <b>{actualParams.min_deposit_term / 3600} hours</b> after opening.
        </Text>
      </p>

      {width > 1279 ? (
        <Table
          dataSource={source.sort((a, b) => b.ts - a.ts)}
          columns={columns}
          onRow={(record) => {
            if (record.protection && last_force_closed_protection_ratio) {
              const ratio = record.protection / record.amount;
              return {
                style: {
                  color:
                    ratio <= last_force_closed_protection_ratio
                      ? "red"
                      : "inherit",
                },
              };
            }
          }}
          locale={{
            emptyText: localeForEmpty,
          }}
          pagination={{ pageSize: 20, hideOnSinglePage: true }}
        />
      ) : (
        <List
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          grid={{ column: 1 }}
          bordered={false}
          dataSource={source.sort((a, b) => b.ts - a.ts)}
          locale={{
            emptyText: localeForEmpty,
          }}
          renderItem={(item) => (
            <DepositsItem
              item={item}
              width={width}
              decimals={actualParams.decimals2}
              reserve_asset_decimals={actualParams.reserve_asset_decimals}
              reserve_asset_symbol={reserve_asset_symbol}
              min_deposit_term={actualParams.min_deposit_term}
              reserve_asset={actualParams.reserve_asset}
              growth_factor={growth_factor}
              activeWallet={activeWallet}
              deposit_aa={deposit_aa}
              timestamp={timestamp}
              asset={deposit_state.asset}
              setVisibleEditRecipient={setVisibleEditRecipient}
              setAddProtection={setAddProtection}
              setWithdrawProtection={setWithdrawProtection}
              symbol2={symbol2}
              symbol3={symbol3}
            />
          )}
        />
      )}
      <EditRecipientModal
        visible={!!visibleEditRecipient}
        id={visibleEditRecipient.id}
        current={visibleEditRecipient.current}
        setShowWalletModal={setVisibleEditRecipient}
        activeWallet={activeWallet}
        deposit_aa={deposit_aa}
      />
      <WithdrawProtectionModal
        activeWallet={activeWallet}
        deposit_aa={deposit_aa}
        visible={withdrawProtection !== undefined}
        deposit={withdrawProtection}
        setVisible={() => setWithdrawProtection(undefined)}
      />
      <AddProtectionModal
        activeWallet={activeWallet}
        deposit_aa={deposit_aa}
        visible={addProtection !== undefined}
        deposit={addProtection}
        setVisible={() => setAddProtection(undefined)}
      />
      <OpenDepositModal
        visible={visibleOpenDeposit}
        setVisible={setVisibleOpenDeposit}
        activeWallet={activeWallet}
        deposit_aa={deposit_aa}
        asset={stable_state.asset2}
        decimals={actualParams.decimals2}
        growth_factor={growth_factor}
        new_growth_factor={new_growth_factor}
        symbol={symbol2}
      />
    </>
  );
};
