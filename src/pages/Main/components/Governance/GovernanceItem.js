import React, { useState } from "react";
import moment from "moment";
import { Col, Divider, Row, Table, Statistic, Button, Tooltip } from "antd";
import { ImportOutlined } from "@ant-design/icons";

import { ShowDecimalsValue } from "components/ShowDecimalsValue/ShowDecimalsValue";
import { generateLink } from "utils/generateLink";
import { ChangeParamsModal } from "modals/ChangeParamsModal/ChangeParamsModal";
import { Label } from "components/Label/Label";
import { paramsDescription } from "pages/Create/paramsDescription";
import { SupportListModal } from "modals/SupportListModal/SupportListModal";

import styles from "./GovernanceItem.module.css";
import { parseOracle, viewParameter } from "./viewParameter";

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
  base_governance,
  refEl
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
        if (name === "oracles") {
          return parseOracle(value).map((item, index) => <div key={item.address + item.feed_name + index}>
            <div style={{ display: "flex" }}>
              <Label
                descr={paramsDescription["oracle" + (index + 1)]}
                label={"Oracle" + (index + 1)}
              /> <span style={{ marginLeft: 5, marginRight: 5 }}>:</span> {width >= 700 ? item.address : <Tooltip style={{ display: "inline" }} title={item.address}>
                <span>{item.address.slice(0, 8)}...</span>
              </Tooltip>}
            </div>
            <div style={{ display: "flex" }}>
              <Label
                descr={paramsDescription["feed_name" + (index + 1)]}
                label={"Feed name" + (index + 1)}
              /> <span style={{ marginLeft: 5, marginRight: 5 }}>:</span> {item.feed_name}</div>
            <div style={{ display: "flex" }}>
              <Label
                descr={paramsDescription["op" + (index + 1)]}
                label={"Op" + (index + 1)}
              /> <span style={{ marginLeft: 5, marginRight: 5 }}>:</span> {item.op}</div>
          </div>)
        } else if (name === "slow_capacity_share" || name === "interest_rate" || name === "deposits.reporter_share") {
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
            {(width <= 470 || (name === "oracles" && width <= 720)) ? <ImportOutlined /> : (records.value === String(choice)
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

  const choiceView = viewParameter(choice, name);
  const leaderView = viewParameter(leader, name);
  const valueView = viewParameter(value, name);

  return (
    <div className={styles.itemWrap} ref={refEl}>
      <Row>
        <Col sm={name === "oracles" ? { span: 24 } : { span: 12 }} xs={{ span: 24 }}>
          <div className={styles.itemName}>
            <Label
              label={nameView}
              descr={description}
            />
          </div>
        </Col>
        <Col sm={name === "oracles" ? { span: 24 } : { span: 12 }} xs={{ span: 24 }}>
          <div className={styles.itemCurrent} style={name === "oracles" ? { textAlign: "left", wordBreak: "break-all" } : { wordBreak: "break-all" }}>
            <span style={name === "oracles" ? { display: "block", fontSize: 14, fontWeight: "bold" } : (width <= 576 ? { fontSize: 14, fontWeight: "bold" } : { display: "inline" })}>Current value:</span>{" "}
            {valueView}
          </div>
        </Col>
      </Row>
      <Row align="top">
        <Col sm={name === "oracles" && width < 720 ? { span: 24 } : { span: 12 }}>
          {leader &&
            <div><b style={name === "oracles" ? { display: "block" } : { display: "inline" }}>Leader:</b> {leaderView}</div>}
          <div>{isChoice && <div><b>My choice: </b>{choiceView}</div>}</div>
        </Col>
        {challengingPeriod ? (
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            style={{ paddingRight: 10 }}
          >
            <div className={styles.secondInfo} style={name === "oracles" && width < 720 ? { textAlign: "left" } : {}}>
              <div>
                {new Date() <= challengingPeriod && !isExpired ? (
                  <>
                    Challenging period expires in {" "}
                    <Countdown
                      valueStyle={{ fontSize: 14, display: "inline", wordBreak: "break-all" }}
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
              xs={{ span: 24 }}
              sm={{ span: 12 }}
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
                rowKey={(record) => String('G-I-' + record.name + record.value)}
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
        value={selectedParam && viewParamSelected(selectedParam.value, name)}
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

export const viewParamSelected = (value, name) => {
  if (value) {
    if (name === "slow_capacity_share" || name === "interest_rate" || name === "deposits.reporter_share") {
      return value * 100;
    } else if (name === "oracles") {
      return value;
    } else {
      return value;
    }
  }

  return undefined
}
