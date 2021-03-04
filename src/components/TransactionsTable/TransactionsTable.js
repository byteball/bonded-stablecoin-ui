import React from "react";
import { List, Tooltip, Typography } from "antd";
import { useTranslation } from 'react-i18next';
import moment from "moment";
import { useSelector } from "react-redux";

import { eventIdentification } from "utils/eventIdentification";
import { getParams } from "helpers/getParams";
import config from "config";
import styles from "./TransactionsTable.module.css";

const { Text } = Typography;

export const TransactionsTable = ({ source, type }) => {
  const active = useSelector((state) => state.active);
  const { t } = useTranslation();
  const {
    params,
    stable_state,
  } = active;
  const { activeWallet } = useSelector((state) => state.settings);
  const actualParams = getParams(params, stable_state);

  return <div className={styles.wrap}>
    <div className={styles.head + " " + styles.row}>
      <div className={styles.status}><Text strong>{t("trade.tabs.transactions.head.status", "Status")}</Text></div>
      <div className={styles.event}><Text strong>{t("trade.tabs.transactions.head.event", "Event")}</Text></div>
      <div className={styles.input}><Text strong>{t("trade.tabs.transactions.head.input", "Input")}</Text></div>
      <div className={styles.output}><Text strong>{t("trade.tabs.transactions.head.output", "Output")}</Text></div>
      <div className={styles.user}><Text strong>{t("trade.tabs.transactions.head.user", "User")}</Text></div>
      <div className={styles.time}><Text strong>{t("trade.tabs.transactions.head.time", "Time")}</Text></div>
    </div>

    <List dataSource={source.sort((a, b) => b.timestamp - a.timestamp)} className={styles.list} renderItem={(item) => {
      const ts = moment.unix(item.timestamp).format("DD-MM-YYYY HH:mm");

      const [event, input, inputCurrency, output, user] = eventIdentification(type, item, actualParams, activeWallet, active);

      return <a href={`https://${config.TESTNET ? "testnet" : ""
        }explorer.obyte.org/#${item.unit}`}
        target="_blank"
        rel="noopener" className={styles.row}>
        <div className={styles.status}>
          <div className={styles.dotWrap}>
            <Dot status={item.bounced ? "error" : (item.isStable ? "stable" : "not_stable")} tooltip={item.bounced ? t("trade.tabs.transactions.error", "Error") : (item.isStable ? t("trade.tabs.transactions.stable", "Stable") : t("trade.tabs.transactions.not_stable", "Not stable"))} />
          </div>
          <div className={styles.statusInfo}><span className={styles.label}>{t("trade.tabs.transactions.head.status", "Status")}:</span><Text type="secondary">{item.bounced ? <span style={{ color: "#F4222D" }}>Error</span> : (item.isStable ? <span style={{ color: "#52C51A" }}>Stable</span> : <span style={{ color: "#FBAD13" }}>Not stable</span>)}</Text></div>
        </div>
        <div className={styles.event}><span className={styles.label}>{t("trade.tabs.transactions.head.event", "Event")}:</span><Text type="secondary">{event}</Text></div>
        <div className={styles.input}><span className={styles.label}>{t("trade.tabs.transactions.head.input", "Input")}:</span><Text type="secondary">{(!item.bounced && input) || "-"} {(!item.bounced && inputCurrency) || ""}</Text></div>
        <div className={styles.output}><span className={styles.label}>{t("trade.tabs.transactions.output", "Output")}:</span> <Text type="secondary">{(!item.bounced && output) || "-"}</Text></div>
        <div className={styles.user}><span className={styles.label}>{t("trade.tabs.transactions.head.user", "User")}:</span><Text type="secondary">{<Tooltip title={user || item.trigger_address}>
          {(user || item.trigger_address).slice(0, 14) + "..."}
        </Tooltip>}</Text></div>
        <div className={styles.time}><span className={styles.label}>{t("trade.tabs.transactions.head.time", "Time")}:</span><Text type="secondary">{ts}</Text></div>
      </a>
    }} />

  </div>
}


export const Dot = ({ size = 12, status, tooltip = "" }) => {

  let color = "#0137FF"

  switch (status) {
    case "stable": {
      color = "#52C51A";
      break;
    }
    case "error": {
      color = "#F4222D";
      break;
    }
    case "not_stable": {
      color = "#FBAD13";
      break;
    }
    default: {
      color = "#52C51A";
      break;
    }
  }

  return (
    <Tooltip title={tooltip}>
      <span className={styles.dot} style={{ height: size, width: size, background: color }}> </span>
    </Tooltip>
  )
}