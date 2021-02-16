import React from "react";
import { Table, Button, List, Tooltip, Tabs, Space } from "antd";
import { useTranslation } from 'react-i18next';
import moment from "moment";
import ReactGA from "react-ga";
import { useSelector } from "react-redux";
import {
  EditOutlined,
  ExportOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { generateLink } from "utils/generateLink"
import { ForceCloseDepositsInfo, InterestRecipientDepositsInfo } from "./DepositsInfo";
import { DepositLocaleForEmpty } from "./DepositLocaleForEmpty";
import { DepositsItem } from "./DepositsItem";
import { useWindowSize } from "hooks/useWindowSize";
import { getParams } from "helpers/getParams";
import { Label } from "components/Label/Label";
import config from "config";
import { ShowDecimalsValue } from "components/ShowDecimalsValue/ShowDecimalsValue";
import { QRButton } from "components/QRButton/QRButton";

const { TabPane } = Tabs;

export const DepositsTables = ({
  timestamp,
  my,
  other,
  growth_factor,
  new_growth_factor,
  minProtectionRatio,
  setVisibleEditRecipient,
  setWithdrawProtection,
  setAddProtection,
  setWithdrawInterest
}) => {
  const [width] = useWindowSize();
  const { t } = useTranslation();

  const { activeWallet } = useSelector((state) => state.settings);
  const {
    deposit_state,
    deposit_aa,
    stable_state,
    symbol2,
    symbol3,
    reserve_asset_symbol,
    params
  } = useSelector((state) => state.active);

  const actualParams = getParams(params, stable_state);

  const mySortedDeposits = my.sort((a, b) => b.ts - a.ts);
  const otherSortedDeposits = other.sort((a, b) => a.protection_ratio - b.protection_ratio);
  const recipientSortedDeposits = other.filter((item) => item.interest_recipient === activeWallet).sort((a, b) => b.amount - a.amount).map((item) => ({ ...item, inRecipientTab: true }));

  const { last_force_closed_protection_ratio } = deposit_state;

  const columns = [
    {
      title: t("trade.tabs.deposits.opened", "Opened"),
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
          label={symbol2 || t("trade.tabs.deposits.interest_title", "Interest tokens")}
          descr={t("trade.tabs.deposits.interest_title_desc", "Amount of interest tokens")}
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
          label={symbol3 || t("trade.tabs.deposits.stable_title", "Stable tokens")}
          descr={t("trade.tabs.deposits.stable_title_desc", "Amount of stable tokens issued against the deposit")}
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
          label={t("trade.tabs.deposits.protection", "Protection (ratio)")}
          descr={t("trade.tabs.deposits.protection_desc", "Additional deposit in {{reserve}} that protects the deposit from being closed by others. The deposit with the least ratio of protection to deposit amount can be closed by anybody. There is no direct loss to you when your deposit is closed but you stop receiving interest from it.", {
            reserve: actualParams.reserve_asset in config.reserves
              ? config.reserves[actualParams.reserve_asset].name
              : reserve_asset_symbol || "reserve asset"
          })}
        />
      ),
      dataIndex: "protection",
      key: "protection",
      render: (value, records) => {
        const ratio = Number(records.protection_ratio).toPrecision(3);
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
            {records.isMy && <Tooltip title={t("trade.tabs.deposits.add_protection", "Add protection")}>
              <Button
                type="link"
                disabled={records.owner !== activeWallet}
                onClick={() => setAddProtection(records)}
                size="middle"
                icon={<DownloadOutlined />}
              />
            </Tooltip>}
            {records.isMy && <Tooltip title={t("trade.tabs.deposits.withdraw_protection", "Withdraw protection")}>
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
            </Tooltip>}
          </>
        );
      },
    },
    {
      title: (
        <Label label={t("trade.tabs.deposits.interest", "Interest")} descr={t("trade.tabs.deposits.interest_desc", "Interest available for withdrawal")} />
      ),
      dataIndex: "amount",
      key: "amount",
      render: (value, records) => {
        const new_stable_amount = Math.floor(records.amount * growth_factor);
        const interest = new_stable_amount - records.stable_amount;

        return (
          <>
            {records.closer ? (
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
            {(records.isMy || (activeWallet === records.interest_recipient && records.inRecipientTab)) && <Tooltip title={t("trade.tabs.deposits.withdraw_interest", "Withdraw interest")}>
              <Button
                type="link"
                onClick={() => setWithdrawInterest({ ...records, interest })}
                disabled={
                  interest <= 0 ||
                  (records.interest_recipient
                    ? activeWallet !== records.interest_recipient
                    : activeWallet !== records.owner) ||
                  records.closer
                }
                icon={<ExportOutlined />}
              />
            </Tooltip>}
          </>
        );
      },
    },
    {
      title: (
        <Label
          label={t("trade.tabs.deposits.interest_recipient", "Interest recipient")}
          descr={t("trade.tabs.deposits.interest_recipient_desc", "Who receives interest (deposit owner by default)")}
        />
      ),
      dataIndex: "interest_recipient",
      render: (value, records) => {
        const recipientName =
          value && config.interestRecipients.find((a) => a.address === value);
        return (
          <>
            {(!value && records.owner === activeWallet) || (value && value === activeWallet)
              ? t("trade.tabs.deposits.you", "you")
              : (recipientName && (
                <span style={{ fontSize: 12 }}>{recipientName.name}</span>
              )) ||
              (value || records.owner).slice(0, 9) + "..."}

            {records.isMy && <Tooltip title={t("trade.tabs.deposits.edit_interest_recipient", "Edit interest recipient")}>
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
            </Tooltip>}
          </>
        );
      },
    },
    {
      id: "action",
      render: (_, records) => {
        const closeUrl = generateLink(
          records.closer ? 1e4 : Math.ceil(records.amount * new_growth_factor),
          {
            id: records.id,
            commit_force_close: records.closer ? 1 : undefined
          },
          activeWallet,
          deposit_aa,
          records.closer ? "base" : deposit_state.asset
        );

        const challengeLink = records.weakerId ? generateLink(
          1e4,
          {
            id: records.id,
            challenge_force_close: 1,
            weaker_id: records.weakerId
          },
          activeWallet,
          deposit_aa
        ) : null;

        const aboveMin = {
          is: !records.isMy && minProtectionRatio !== null && records.protection_ratio > minProtectionRatio,
          info: t("trade.tabs.deposits.less_last", "This deposit's protection ratio is above the smallest")
        };

        const tooNew = {
          is: records.ts + actualParams.min_deposit_term > timestamp || records.id.match(/^dummy\d+$/),
          info: t("trade.tabs.deposits.too_new", "This deposit was opened less than {{hours}} hours ago and can't be force closed yet", { hours: Number(actualParams.min_deposit_term / 3600).toPrecision(3) })
        };

        const inChallengingPeriod = {
          is: (records.closer && records.force_close_ts && records.force_close_ts + actualParams.challenging_period > timestamp),
          info: t("trade.tabs.deposits.challenging_period", "Commit will be available in {{hours}} hours when the challenging period expires", { hours: Number((records.force_close_ts + actualParams.challenging_period - timestamp) / 3600).toPrecision(3) })
        };

        const tooltip = aboveMin.is ? aboveMin.info : (tooNew.is ? tooNew.info : (inChallengingPeriod.is ? inChallengingPeriod.info : undefined));

        return (
          <Space size="large">
            {!records.weakerId && <QRButton
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
              {!records.closer && (records.isMy ? t("trade.tabs.deposits.close", "Close") : t("trade.tabs.deposits.force_close", "Force close"))}
              {records.closer && t("trade.tabs.deposits.commit_force_close", "Commit force close")}
            </QRButton>}
            {records.weakerId ? <QRButton style={{ padding: 0 }} size="small" type="link" href={challengeLink}>{t("trade.tabs.deposits.challenge", "Challenge")}</QRButton> : null}
          </Space>
        );
      },
    },
  ];

  return (
    <Tabs defaultActiveKey="my-1">
      <TabPane tab={t("trade.tabs.deposits.my_deposits", "My deposits")} key="my-1">
        {width > 1279 ? (
          <Table
            dataSource={mySortedDeposits}
            columns={columns}
            onRow={(record) => {
              return {
                style: {
                  color:
                    record.protection_ratio <= (last_force_closed_protection_ratio || 0)
                      ? "#e74c3c"
                      : "inherit",
                },
              };
            }}
            locale={{
              emptyText: <DepositLocaleForEmpty isActive={stable_state.interest_rate} />,
            }}
            pagination={{ pageSize: 20, hideOnSinglePage: true }}
          />
        ) : (
            <List
              pagination={{ pageSize: 10, hideOnSinglePage: true }}
              grid={{ column: 1 }}
              bordered={false}
              dataSource={mySortedDeposits}
              locale={{
                emptyText: <DepositLocaleForEmpty isActive={stable_state.interest_rate} />,
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
                  new_growth_factor={new_growth_factor}
                  challenging_period={actualParams.challenging_period}
                  last_force_closed_protection_ratio={last_force_closed_protection_ratio}
                  symbol2={symbol2}
                  symbol3={symbol3}
                />
              )}
            />
          )}
      </TabPane>

      {activeWallet && <TabPane tab={t("trade.tabs.deposits.me_as_interest_recipient", "Me as interest recipient")} key="recipient-2">
        <InterestRecipientDepositsInfo />
        {width > 1279 ? (
          <Table
            dataSource={recipientSortedDeposits}
            columns={columns.filter((column) => column.dataIndex !== "interest_recipient" && column.id !== "action")}
            onRow={(record) => {
              return {
                style: {
                  color:
                    record.protection_ratio <= (last_force_closed_protection_ratio || 0)
                      ? "#e74c3c"
                      : "inherit",
                },
              };

            }}
            locale={{
              emptyText: <DepositLocaleForEmpty isActive={stable_state.interest_rate} />,
            }}
            pagination={{ pageSize: 20, hideOnSinglePage: true }}
          />
        ) : (
            <List
              pagination={{ pageSize: 10, hideOnSinglePage: true }}
              grid={{ column: 1 }}
              bordered={false}
              dataSource={recipientSortedDeposits}
              locale={{
                emptyText: <DepositLocaleForEmpty isActive={stable_state.interest_rate} />,
              }}
              renderItem={(item) => (
                <DepositsItem
                  item={item}
                  width={width}
                  decimals={actualParams.decimals2}
                  reserve_asset_decimals={actualParams.reserve_asset_decimals}
                  last_force_closed_protection_ratio={last_force_closed_protection_ratio}
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
                  new_growth_factor={new_growth_factor}
                  challenging_period={actualParams.challenging_period}
                  inRecipientTab={true}
                  symbol2={symbol2}
                  symbol3={symbol3}
                />
              )}
            />
          )}
      </TabPane>}

      <TabPane tab={t("trade.tabs.deposits.other_deposits", "Other deposits")} key="other-3">
        <ForceCloseDepositsInfo
          challengingPeriodInHours={Number(actualParams.challenging_period / 3600).toPrecision(2)}
          depositAa={deposit_aa}
          symbol2={symbol2}
          symbol3={symbol3}
        />
        {width > 1279 ? (
          <Table
            dataSource={otherSortedDeposits}
            columns={columns}
            onRow={(record) => {
              return {
                style: {
                  color:
                    record.protection_ratio <= (last_force_closed_protection_ratio || 0)
                      ? "#e74c3c"
                      : "inherit",
                },
              };

            }}
            locale={{
              emptyText: <DepositLocaleForEmpty isActive={stable_state.interest_rate} />,
            }}
            pagination={{ pageSize: 20, hideOnSinglePage: true }}
          />
        ) : (
            <List
              pagination={{ pageSize: 10, hideOnSinglePage: true }}
              grid={{ column: 1 }}
              bordered={false}
              dataSource={otherSortedDeposits}
              locale={{
                emptyText: <DepositLocaleForEmpty isActive={stable_state.interest_rate} />,
              }}
              renderItem={(item) => (
                <DepositsItem
                  item={item}
                  width={width}
                  decimals={actualParams.decimals2}
                  reserve_asset_decimals={actualParams.reserve_asset_decimals}
                  last_force_closed_protection_ratio={last_force_closed_protection_ratio}
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
                  new_growth_factor={new_growth_factor}
                  challenging_period={actualParams.challenging_period}
                  symbol2={symbol2}
                  symbol3={symbol3}
                />
              )}
            />
          )}
      </TabPane>
    </Tabs>
  )
}