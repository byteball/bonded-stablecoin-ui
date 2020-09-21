import React, { useState } from "react";
import { Table, Button, Space, Statistic, Card, List } from "antd";
import moment from "moment";

import { generateLink } from "utils/generateLink";
import { ChangeParamsModal } from "modals/ChangeParamsModal/ChangeParamsModal";

const { Countdown } = Statistic;

export const ChangeParams = ({
  asset,
  activeWallet,
  governance,
  freeze_period,
  governance_aa,
  regular_challenging_period,
  decimals,
  balance,
  symbol,
  width,
}) => {
  const [selectedParam, setSelectedParam] = useState(undefined);

  const source = [];

  const now = moment().unix();

  for (let param in governance) {
    const { value, challenging_period_start_ts, leader } = governance[param];

    if (
      param === "oracles" ||
      param === "proposal" ||
      param.includes("oracles")
    )
      continue;

    const isChoice = activeWallet in (governance[param].choice || {});
    source.push({
      param,
      value,
      isChoice: activeWallet in (governance[param].choice || {}),
      choiceValue: isChoice && governance[param].choice[activeWallet],
      support:
        governance[param].supports && leader in governance[param].supports
          ? governance[param].supports[leader]
          : undefined,
      challenging_period: challenging_period_start_ts
        ? challenging_period_start_ts + regular_challenging_period
        : undefined,
      leader,
      linkCommit: generateLink(
        1e4,
        { name: param, commit: 1 },
        activeWallet,
        governance_aa
      ),
      linkRemoveSupport: generateLink(
        1e4,
        { name: param },
        activeWallet,
        governance_aa
      ),
    });
  }
  const columns = [
    {
      title: "Param",
      dataIndex: "param",
      key: "param",
      width: "20%",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: "10%",
      render: (value, records) => {
        if (records.param === "interest_rate") {
          return value * 100 + " %";
        } else {
          return value;
        }
      },
    },
    {
      title: "Leader",
      dataIndex: "leader",
      key: "leader",
      width: "10%",
      render: (value, records) => {
        if (records.param === "interest_rate") {
          return value * 100 + " %";
        } else {
          return value;
        }
      },
    },
    {
      title: "Leader support",
      dataIndex: "support",
      key: "support",
      width: "15%",
      render: (value) => {
        if (!value) return "-";
        return Number(value / 10 ** decimals).toFixed(decimals);
      },
    },
    {
      title: "Сhallenging period",
      dataIndex: "challenging_period",
      key: "challenging_period",
      width: "15%",
      render: (value) => {
        if (!value) return "-";
        if (now > value) return "expired";
        return (
          <Countdown
            value={value}
            valueStyle={{ fontSize: 14, fontWeight: "normal" }}
          />
        );
      },
    },
    {
      key: "actions",
      width: "30%",
      render: (_, records) => {
        const {
          challenging_period,
          value,
          leader,
          choiceValue,
          isChoice,
          linkRemoveSupport,
        } = records;
        return (
          <Space>
            {isChoice ? (
              <Button
                type="link"
                href={linkRemoveSupport}
                disabled={
                  choiceValue &&
                  choiceValue === leader &&
                  challenging_period + freeze_period > now
                }
              >
                Remove support
              </Button>
            ) : (
              <Button
                type="link"
                onClick={() => setSelectedParam(records.param)}
              >
                Vote
              </Button>
            )}
            <Button
              type="link"
              href={records.linkCommit}
              disabled={
                now < challenging_period ||
                leader === value ||
                leader === undefined
              }
            >
              Commit
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {width > 1200 ? (
        <Table
          dataSource={source}
          pagination={{ pageSize: 20, hideOnSinglePage: true }}
          columns={columns}
          rowKey={(records) => records.param + records.support}
        />
      ) : (
        <List
          dataSource={source}
          grid={{ column: width >= 800 ? 2 : 1 }}
          renderItem={(item) => {
            let ChallengingPeriod;
            if (!item.challenging_period) {
              ChallengingPeriod = "-";
            } else if (now > item.challenging_period) {
              ChallengingPeriod = "expired";
            } else {
              ChallengingPeriod = (
                <Countdown
                  value={item.challenging_period}
                  valueStyle={{
                    fontSize: 14,
                    fontWeight: "normal",
                    color: "inherit",
                  }}
                />
              );
            }
            const {
              challenging_period,
              value,
              leader,
              choiceValue,
              isChoice,
              linkRemoveSupport,
              linkCommit,
            } = item;

            return (
              <Card size="small" style={{ marginBottom: 10 }} bordered={false}>
                <div>
                  <b>Param name:</b> {item.param}
                </div>
                <div>
                  <b>Value:</b> {item.value}{" "}
                </div>
                <div>
                  <b>Leader:</b> {item.leader}{" "}
                </div>
                <div>
                  <b>Leader support:</b>{" "}
                  {item.support
                    ? Number(item.support / 10 ** decimals).toFixed(decimals)
                    : "-"}
                </div>
                <div style={{ display: "flex" }}>
                  <b style={{ marginRight: 5 }}>Challenging period:</b>{" "}
                  {ChallengingPeriod}
                </div>
                <div style={{ marginTop: 10 }}>
                  <Space>
                    {isChoice ? (
                      <Button
                        size="middle"
                        href={linkRemoveSupport}
                        disabled={
                          choiceValue &&
                          choiceValue === leader &&
                          challenging_period + freeze_period > now
                        }
                      >
                        Remove support
                      </Button>
                    ) : (
                      <Button
                        size="middle"
                        onClick={() => setSelectedParam(item.param)}
                      >
                        Vote
                      </Button>
                    )}
                    <Button
                      size="middle"
                      href={linkCommit}
                      disabled={
                        now < challenging_period ||
                        leader === value ||
                        leader === undefined
                      }
                    >
                      Commit
                    </Button>
                  </Space>
                </div>
              </Card>
            );
          }}
        />
      )}

      <ChangeParamsModal
        visible={!!selectedParam}
        param={selectedParam}
        activeWallet={activeWallet}
        onCancel={() => setSelectedParam(undefined)}
        governance_aa={governance_aa}
        asset={asset}
        decimals={decimals}
        symbol={symbol}
        balance={balance}
      />
    </>
  );
};
