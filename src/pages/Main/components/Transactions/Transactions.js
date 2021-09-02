import { Typography, Tabs, Spin } from "antd";
import config from "config";
import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { isEmpty } from "lodash";
import { TransactionsTable } from "components/TransactionsTable/TransactionsTable";

const { Text, Title } = Typography;
const { TabPane } = Tabs;

export const Transactions = () => {
  const active = useSelector((state) => state.active);
  const { t } = useTranslation();

  const {
    address,
    deposit_aa,
    governance_aa,
    stable_aa,
    bonded_state: {decision_engine_aa},
    transactions: { curve, depositOrStable, governance, de }
  } = active;

  if (isEmpty(curve) && isEmpty(depositOrStable) && isEmpty(governance)) {
    return <div style={{ display: "flex", justifyContent: "center", paddingTop: 50, paddingBottom: 50 }}><Spin size="large" /></div>
  }

  const curveSource = getSourceFromObject(curve);
  const depositOrStableSource = getSourceFromObject(depositOrStable);
  const governanceSource = getSourceFromObject(governance);
  const deSource = decision_engine_aa ? getSourceFromObject(de): undefined;

  return <div>
    <Title level={3}>{t("trade.tabs.transactions.title", "Transactions")}</Title>
    <p>
      <Text type="secondary">
        {t("trade.tabs.transactions.desc", "In this section you can view the transactions of autonomous agents associated with the selected stablecoin")}
      </Text>
    </p>
    <Tabs defaultActiveKey="curve-1">
      <TabPane tab={t("trade.tabs.transactions.curve", "Curve")} key="curve-1">
        <Text>{t("trade.tabs.transactions.address", "The address of the autonomous agent")}: </Text>
        <a
          href={`https://${config.TESTNET ? "testnet" : ""
            }explorer.obyte.org/#${address}`}
          target="_blank"
          rel="noopener"
        >
          {address}
        </a>
        <div style={{ marginTop: 25 }}>
          <TransactionsTable type="curve" source={curveSource} />
        </div>
      </TabPane>

      <TabPane tab={stable_aa ? t("trade.tabs.transactions.stable", "Stable") : t("trade.tabs.transactions.deposits", "Deposits")} key="deposits-2">
        <Text>{t("trade.tabs.transactions.address", "The address of the autonomous agent")}: </Text>
        <a
          href={`https://${config.TESTNET ? "testnet" : ""
            }explorer.obyte.org/#${stable_aa || deposit_aa}`}
          target="_blank"
          rel="noopener"
        >
          {stable_aa || deposit_aa}
        </a>
        <div style={{ marginTop: 25 }}>
          <TransactionsTable type={stable_aa ? "stable" : "deposit"} source={depositOrStableSource} />
        </div>
      </TabPane>

      {deSource && <TabPane tab={t("trade.tabs.transactions.de", "Decision engine")} key="de-3">
        <Text>{t("trade.tabs.transactions.address", "The address of the autonomous agent")}: </Text>
        <a
          href={`https://${config.TESTNET ? "testnet" : ""
            }explorer.obyte.org/#${decision_engine_aa}`}
          target="_blank"
          rel="noopener"
        >
          {decision_engine_aa}
        </a>
        <div style={{ marginTop: 25 }}>
          <TransactionsTable type="de" source={deSource} />
        </div>
      </TabPane>}

      <TabPane tab={t("trade.tabs.transactions.governance", "Governance")} key="governance-4">
        <Text>{t("trade.tabs.transactions.address", "The address of the autonomous agent")}: </Text>
        <a
          href={`https://${config.TESTNET ? "testnet" : ""
            }explorer.obyte.org/#${governance_aa}`}
          target="_blank"
          rel="noopener"
        >
          {governance_aa}
        </a>
        <div style={{ marginTop: 25 }}>
          <TransactionsTable type="governance" source={governanceSource} />
        </div>
      </TabPane>

    </Tabs>
  </div>
}

const getSourceFromObject = (obj) => {
  return Object.keys(obj).map((key) => obj[key])
}