import React, { useState } from "react";
import moment from "moment";
import { Col, Divider, Row, Table, Statistic, Button } from "antd";
import { ImportOutlined } from "@ant-design/icons";

import { ShowDecimalsValue } from "components/ShowDecimalsValue/ShowDecimalsValue";
import { generateLink } from "utils/generateLink";
import { ChangeParamsModal } from "modals/ChangeParamsModal/ChangeParamsModal";
import { Label } from "components/Label/Label";
import { paramsDescription } from "pages/Create/paramsDescription";
import { SupportListModal } from "modals/SupportListModal/SupportListModal";

import styles from "./GovernanceItem.module.css";

const { Countdown } = Statistic;

export const GovernanceItem = ({
  value,
  width,
  name,
  challengingPeriod,
  regularPeriod,
  supportParamsByAddress,
  supportList,
  leader,
  supports,
  decimals,
  choice,
  governance_aa,
  activeWallet,
  balance,
  freezePeriod,
  asset,
  symbol,
  base_governance
}) => {
  const [selectedParam, setSelectedParam] = useState(undefined);
  const [activeSupportValue, setActiveSupportValue] = useState(undefined);
  const [isExpired, setIsExpired] = useState(false);
  const nameView = name.split("_").join(" ").replace(".", ': ');
  const now = Date.now();
  const source = [];
  const supportsByValue = {};
  const isChoice = !!choice;

  for (let address in supports) {
    if (supports[address].value in supportsByValue) {
      supportsByValue[supports[address].value] += supports[address].support;
    } else {
      supportsByValue[supports[address].value] = supports[address].support;
    }
  }

  for (let value in supportsByValue) {
    source.push({
      value: value,
      support: supportsByValue[value],
    });
  }

  const linkRemoveSupport = generateLink(
    1e4,
    { name },
    activeWallet,
    governance_aa
  );

  const linkCommit = generateLink(
    1e4,
    { name, commit: 1 },
    activeWallet,
    governance_aa
  );

  const columns = [
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value) => {
        if (name === "interest_rate" || name === "deposits.reporter_share") {
          return value * 100 + "%";
        } else {
          return value;
        }
      },
    },
    {
      title: "Support",
      dataIndex: "support",
      key: "support",
      render: (value, records) => {
        return (
          <Button type="link" style={{ padding: 0 }} onClick={() => setActiveSupportValue(records.value)}>
            <ShowDecimalsValue decimals={decimals} value={value} /><>&nbsp;</>{symbol || "T1"}
          </Button>
        );
      },
    },
    {
      render: (records) => {
        return (
          <Button
            type="link"
            onClick={() => setSelectedParam({ name, value: records.value })}
          >
            {width <= 360 ? <ImportOutlined /> : (records.value === String(choice)
              ? "add support for this value"
              : "vote for this value")}
          </Button>
        );
      },
    },
  ];
  let description;
  if (!name.includes("deposits.") && name in paramsDescription) {
    description = paramsDescription[name];
  } else if (name.replace("deposits.", '') in paramsDescription) {
    description = paramsDescription[name.replace("deposits.", "")];
  }

  return (
    <div className={styles.itemWrap}>
      <Row>
        <Col span={12}>
          <div className={styles.itemName}>
            <Label
              label={nameView}
              descr={description}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.itemCurrent}>
            Current value:{" "}
            {name === "interest_rate" || name === "deposits.reporter_share" ? value * 100 + "%" : value}
          </div>
        </Col>
      </Row>
      <Row align="top">
        <Col span={12}>
          {leader &&
            <div>Leader: {name === "interest_rate" || name === "deposits.reporter_share" ? leader * 100 + "%" : leader}</div>}
          <div>{isChoice && <div>{name === "interest_rate" || name === "deposits.reporter_share" ? 'My choice: ' + choice * 100 + "%" : 'My choice: ' + choice}</div>}</div>
        </Col>
        {challengingPeriod ? (
          <Col
            span={12}
            style={{ paddingRight: 10 }}
          >
            <div style={{ textAlign: "right" }}>
              <div>
                {new Date() <= challengingPeriod && !isExpired ? (
                  <>
                    Challenging period expires in {" "}
                    <Countdown
                      valueStyle={{ fontSize: 14, display: "inline" }}
                      value={moment.utc(challengingPeriod)}
                      style={{ display: "inline" }}
                      format={regularPeriod > 86400 ? "D [days] HH:mm:ss" : "HH:mm:ss"}
                      onFinish={() => setIsExpired(true)}
                    />
                  </>
                ) : (
                    <div>
                      {source.length === 0 && <div>
                        <Button
                          type="link"
                          style={{ padding: 0, lineHeight: "1em", height: "auto" }}
                          onClick={() => setSelectedParam(name)}
                        >
                          suggest another value
                      </Button>
                      </div>}
                      {leader && <Button
                        type="link"
                        style={{ padding: 0, lineHeight: "1em", height: "auto" }}
                        href={linkCommit}
                        disabled={
                          now < challengingPeriod ||
                          leader === value ||
                          leader === undefined
                        }
                      >
                        commit
                      </Button>}
                    </div>
                  )}
              </div>
              {isChoice && <div>
                <Button
                  type="link"
                  href={linkRemoveSupport}
                  style={{ padding: 0, lineHeight: "1em", height: "auto" }}
                  disabled={
                    !isChoice ||
                    (choice && choice === leader && freezePeriod > now)
                  }
                >
                  remove support
              </Button>
              </div>}
            </div>
          </Col>
        ) : (
            <Col
              span={12}
              style={{
                textAlign: "right",
                paddingRight: 10,
              }}
            >
              <Button
                type="link"
                style={{ padding: 0, lineHeight: "1em", height: "auto" }}
                onClick={() => setSelectedParam(name)}
              >
                suggest another value
              </Button>
            </Col>
          )}
      </Row>
      {source.length > 0 && (
        <>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
          <Row style={{ marginTop: 10 }}>
            <Col span={24}>
              <Table
                bordered={false}
                columns={columns}
                dataSource={source.sort((a, b) => b.support - a.support)}
                pagination={{ pageSize: 5, hideOnSinglePage: true }}
                size="small"
                rowKey={(record) => String(record.name + record.value)}
                footer={() => <>
                  <Button
                    type="link"
                    style={{ padding: 5 }}
                    onClick={() => setSelectedParam(name)}
                  >
                    suggest another value
                  </Button>
                </>}
              />
            </Col>
          </Row>
        </>
      )}
      <ChangeParamsModal
        visible={!!selectedParam}
        choice={choice}
        param={name}
        value={
          selectedParam &&
          String(
            name === "interest_rate" || name === "deposits.reporter_share"
              ? selectedParam.value * 100
              : selectedParam.value
          )
        }
        activeWallet={activeWallet}
        onCancel={() => setSelectedParam(undefined)}
        governance_aa={governance_aa}
        base_governance={base_governance}
        asset={asset}
        decimals={decimals}
        symbol={symbol}
        balance={balance}
        supportParamsByAddress={supportParamsByAddress}
        supportsByValue={supportsByValue}
        isMyVote={
          selectedParam && String(choice) === String(selectedParam.value)
        }
      />
      <SupportListModal
        decimals={decimals}
        symbol={symbol}
        onCancel={() => setActiveSupportValue(undefined)}
        activeSupportValue={activeSupportValue}
        supportList={supportList.filter(a => a.value === activeSupportValue)} />
    </div>
  );
};


