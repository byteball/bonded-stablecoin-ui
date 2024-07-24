import React, { useState } from "react";
import moment from "moment";
import { Col, Divider, Row, Table, Statistic, Button, Tooltip } from "antd";
import { useTranslation } from 'react-i18next';
import { ImportOutlined } from "@ant-design/icons";

import { ShowDecimalsValue } from "components/ShowDecimalsValue/ShowDecimalsValue";
import { generateLink } from "utils/generateLink";
import { ChangeParamsModal } from "modals/ChangeParamsModal/ChangeParamsModal";
import { Label } from "components/Label/Label";
import { paramsDescription } from "pages/Create/paramsDescription";
import { SupportListModal } from "modals/SupportListModal/SupportListModal";

import styles from "./GovernanceItem.module.css";
import { parseOracle, viewParameter } from "./viewParameter";
import { percentageParams } from "./components/percentageParams";
import { QRButton } from "components/QRButton/QRButton";
import config from "config";

const { Countdown } = Statistic;

export const GovernanceItem = ({
  value,
  width,
  name,
  challengingPeriodEndInSeconds,
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
  fund_aa,
  refEl
}) => {
  const [selectedParam, setSelectedParam] = useState(undefined);
  const [visible, setVisible] = useState(false);
  const [activeSupportValue, setActiveSupportValue] = useState(undefined);
  const [isExpired, setIsExpired] = useState(false);
  const { t } = useTranslation();
  const now = Math.floor(Date.now() / 1000);
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
      title: t("trade.tabs.governance.value", "Value"),
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
        } else if (percentageParams.includes(name)) {
          return value * 100 + "%";
        } else if (name === "decision_engine_aa") {
          return <a href={`https://${config.TESTNET ? "testnet" : ""
            }explorer.obyte.org/address/${value}`}
            target="_blank"
            rel="noopener">
            {value}
          </a>
        } else {
          return value;
        }
      },
    },
    {
      title: t("trade.tabs.governance.support", "Support"),
      dataIndex: "support",
      key: "support",
      render: (value, records) => {
        return (
          <Button type="link" style={{ padding: 0 }} onClick={() => setActiveSupportValue(records.value)}>
            <ShowDecimalsValue decimals={decimals} value={value} /><>&nbsp;</>{symbol || (fund_aa ? "T_SF" : "T1")}
          </Button>
        );
      },
    },
    {
      render: (records) => {
        return (
          <Button
            type="link"
            disabled={choice && choice === leader && freezePeriod > now}
            onClick={() => { setSelectedParam({ name, value: records.value }); setVisible(true); }}>
            {(width <= 470 || (name === "oracles" && width <= 720)) ? <ImportOutlined /> : (records.value === String(choice)
              ? t("trade.tabs.governance.add_support", "add support for this value")
              : t("trade.tabs.governance.vote_for_this", "vote for this value"))}
          </Button>
        );
      },
    },
  ];

  const choiceView = viewParameter(choice, name);
  const leaderView = viewParameter(leader, name);
  const valueView = viewParameter(value, name);
  const info = paramsDescription();

  if (!(name.replace("deposits.", '') in info)) {
    return null
  }

  return (
    <div className={styles.itemWrap} ref={refEl}>
      <Row>
        <Col sm={name === "oracles" || name === "decision_engine_aa" ? { span: 24 } : { span: 12 }} xs={{ span: 24 }}>
          <div className={styles.itemName}>
            <Label
              label={info[name.replace("deposits.", '')].name}
              descr={info[name.replace("deposits.", '')].desc}
            />
          </div>
        </Col>
        <Col sm={name === "oracles" || name === "decision_engine_aa" ? { span: 24 } : { span: 12 }} xs={{ span: 24 }}>
          <div className={styles.itemCurrent} style={name === "oracles" || name === "decision_engine_aa" ? { textAlign: "left", wordBreak: "break-all" } : { wordBreak: "break-all" }}>
            <span style={name === "oracles" || name === "decision_engine_aa" ? { fontSize: width > 576 ? 16 : 14, display: width > 576 ? "inline" : "block", fontWeight: "bold" } : (width <= 576 ? { fontSize: 14, fontWeight: "bold" } : { display: "inline" })}>{t("trade.tabs.governance.current_value", "Current value")}:</span>{" "}
            {valueView}
          </div>
        </Col>
      </Row>
      <Row align="top">
        <Col sm={(name === "oracles" || name === "decision_engine_aa") && width < 720 ? { span: 24 } : { span: 12 }}>
          {(leader !== undefined && leader !== false) &&
            <div><b style={name === "oracles" ? { display: valueView !== "-" ? "block" : "inline" } : { display: "inline" }}>{t("trade.tabs.governance.leader", "Leader")}:</b> {leaderView}</div>}
          <div>{isChoice && <div><b>{t("trade.tabs.governance.my_choice", "My choice")}: </b>{choiceView}</div>}</div>
        </Col>
        {challengingPeriodEndInSeconds ? (
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            style={{ paddingRight: 10 }}
          >
            <div className={styles.secondInfo} style={(name === "oracles" || name === "decision_engine_aa") && width < 720 ? { textAlign: "left" } : {}}>
              <div>
                {now <= challengingPeriodEndInSeconds && !isExpired ? (
                  <>
                    {t("trade.tabs.governance.expires_period", "Challenging period expires in")} {" "}
                    <Countdown
                      valueStyle={{ fontSize: 14, display: "inline", wordBreak: "break-all" }}
                      value={moment.unix(challengingPeriodEndInSeconds)}
                      style={{ display: "inline" }}
                      format={regularPeriod > 86400 ? "D [days] HH:mm:ss" : "HH:mm:ss"}
                      onFinish={() => setIsExpired(true)}
                    />
                  </>
                ) : (
                  <div>
                      {(leader !== undefined && leader !== false) && <QRButton
                      type="link"
                      style={{ padding: 0, lineHeight: "1em", height: "auto" }}
                      href={linkCommit}
                      size="small"
                      disabled={
                        now < challengingPeriodEndInSeconds ||
                        leader === value ||
                        leader === undefined
                      }
                    >
                      {t("trade.tabs.governance.commit", "commit")}
                    </QRButton>}
                  </div>
                )}
              </div>
              {isChoice && <div>
                <QRButton
                  type="link"
                  href={linkRemoveSupport}
                  style={{ padding: 0, lineHeight: "1em", height: "auto" }}
                  size="small"
                  disabled={
                    !isChoice ||
                    (choice && choice === leader && freezePeriod > now)
                  }
                >
                  {t("trade.tabs.governance.remove_support", "remove support")}
                </QRButton>
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
              onClick={() => { setSelectedParam(name); setVisible(true); }}
              disabled={choice && choice === leader && freezePeriod > now}
            >
              {t("trade.tabs.governance.another_value", "suggest another value")}
            </Button>
          </Col>
        )}
      </Row>
      {source.length > 0 ? (
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
                    onClick={() => { setSelectedParam(name); setVisible(true); }}
                    disabled={choice && choice === leader && freezePeriod > now}
                  >
                    {t("trade.tabs.governance.another_value", "suggest another value")}
                  </Button>
                </>}
              />
            </Col>
          </Row>
        </>) : <>
          {source.length === 0 && (now > challengingPeriodEndInSeconds || isExpired) && <div style={{ paddingRight: 10, textAlign: width > 576 ? "right" : "right" }}>
            <Button
              type="link"
              style={{ padding: 0, lineHeight: "1em", height: "auto" }}
              onClick={() => { setSelectedParam(name); setVisible(true); }}
            >
              {t("trade.tabs.governance.another_value", "suggest another value")}
            </Button>
          </div>}
        </>}
      <ChangeParamsModal
        visible={visible}
        choice={choice}
        param={name}
        value={selectedParam && viewParamSelected(selectedParam.value, name)}
        activeWallet={activeWallet}
        onCancel={() => setVisible(false)}
        governance_aa={governance_aa}
        base_governance={base_governance}
        asset={asset}
        decimals={decimals}
        symbol={symbol}
        balance={balance}
        fund_aa={fund_aa}
        supportParamsByAddress={supportParamsByAddress}
        supportsByValue={supportsByValue}
        isMyVote={
          selectedParam && String(choice) === String(selectedParam.value)
        }
      />
      <SupportListModal
        decimals={decimals}
        symbol={symbol}
        fund_aa={fund_aa}
        onCancel={() => setActiveSupportValue(undefined)}
        activeSupportValue={activeSupportValue}
        supportList={supportList.filter(a => a.value === activeSupportValue)} />
    </div>
  );
};

export const viewParamSelected = (value, name) => {
  if (value) {
    if (percentageParams.includes(name)) {
      return value * 100;
    } else if (name === "oracles") {
      return value;
    } else {
      return value;
    }
  }

  return undefined
}
