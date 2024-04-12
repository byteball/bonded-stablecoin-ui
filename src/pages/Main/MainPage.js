import React, { useState, useEffect } from "react";
import { Tabs, Col, Row, BackTop, Spin } from "antd";
import ReactGA from "react-ga";
import {
  InteractionOutlined,
  ImportOutlined,
  SlidersOutlined,
  LineChartOutlined,
  NodeIndexOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet";
import { Trans } from 'react-i18next';

import { Issue } from "./components/Issue/Issue";
import { Redeem } from "./components/Redeem/Redeem";
import { Deposits } from "./components/Deposits/Deposits";
import { Capacitors } from "./components/Capacitors/Capacitors";
import { Governance } from "./components/Governance/Governance";
import { RegisterSymbols } from "./components/RegisterSymbols/RegisterSymbols";
import { getParams } from "../../helpers/getParams";
import { Parameters } from "./components/Parameters/Parameters";
import { CapacitorIcon } from "../../components/CapacitorIcon/CapacitorIcon";
import { GovernanceIcon } from "../../components/GovernanceIcon/GovernanceIcon";
import { Charts } from "./components/Charts/Charts";
import { changeActive } from "store/actions/active/changeActive";
import { changeActiveForBot } from "store/actions/active/changeActiveForBot";
import { botCheck } from "utils/botCheck";
import { Transactions } from "./components/Transactions/Transactions";
import { StabilityFund } from "./components/StabilityFund/StabilityFund";
import { IssueAndRedeem } from "./components/IssueAndRedeem/IssueAndRedeem";
import { FundIcon } from "components/FundIcon/FundIcon";

const { TabPane } = Tabs;

const tabList = ["buy", "charts", "deposits", "capacitor", "governance", "parameters", "fund"];

export const MainPage = ({ setWalletModalVisibility }) => {
  const {
    address,
    bonded_state,
    deposit_state,
    reserve_asset_symbol,
    fund_aa,
    fund_state,
    stable_state,
    params,
    symbol1,
    symbol2,
    symbol3,
    symbol4,
    loading
  } = useSelector((state) => state.active);
  const pendings = useSelector((state) => state.pendings);
  const { activeWallet, lang } = useSelector((state) => state.settings);
  const { loaded } = useSelector((state) => state.list);
  const [currentTab, setCurrentTab] = useState(undefined);
  const [handleSkip, setHandleSkip] = useState(false);
  const [tabInitialized, setTabInitialized] = useState(false);
  const [addressInitialized, setAddressInitialized] = useState(false);
  const actualParams = getParams(params, bonded_state);
  const urlParams = useParams();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { tab } = urlParams;
  const hash = location.hash.slice(1);
  const { t } = useTranslation();
  const basename = lang && lang !== "en" ? "/" + lang : "";

  useEffect(() => {
    if ((addressInitialized || !urlParams.address) && !loading && loaded && tabInitialized && currentTab && address && !tabList.includes(hash)) {
      let newTab;
      if (tab === "fund" && !(bonded_state?.fund_aa)) {
        if ("reserve" in bonded_state) {
          newTab = "deposits";
        } else {
          newTab = "buy-redeem";
        }
      } else if (currentTab === "deposits" && bonded_state?.fund_aa) {
        if ("reserve" in bonded_state) {
          newTab = "fund";
        } else {
          newTab = "buy-redeem";
        }
      }

      history.replace(`${basename}/trade/${address}/${newTab || currentTab || ""}${location.hash}`);
    }
  }, [currentTab, loaded, address, addressInitialized, loading]);

  useEffect(() => {
    if (!tabList.includes(hash)) {
      history.replace({ hash: undefined });
    }
  }, [address]);

  useEffect(() => {
    if (urlParams.address && address !== urlParams.address) {
      if (botCheck(navigator.userAgent)) {
        dispatch(changeActiveForBot(urlParams.address));
      } else {
        dispatch(changeActive(urlParams.address));
      }
    }
    setAddressInitialized(true);
  }, [])

  useEffect(() => {
    if (tabInitialized && tab !== currentTab) {
      setCurrentTab(tab);
    }
    if (tab !== "governance" && !tabList.includes(hash)) {
      history.replace({ hash: undefined });
    }
  }, [tab])

  useEffect(() => {
    if (loaded && !isEmpty(bonded_state) && !tabInitialized) {
      if (tabList.includes(hash)) {
        if ("reserve" in bonded_state || ["parameters", "charts"].includes(hash)) {
          setCurrentTab(hash === "buy" ? "buy-redeem" : hash);
        } else {
          setCurrentTab("buy-redeem");
        }
        history.replace({ hash: undefined });
      } else if (!tab) {
        if ("reserve" in bonded_state) {
          setCurrentTab("charts");
        } else {
          setCurrentTab("buy-redeem");
        }
      } else {
        if (tab === "fund") {
          if (bonded_state?.fund_aa) {
            setCurrentTab(tab);
          } else {
            if ("reserve" in bonded_state) {
              setCurrentTab("deposits");
            } else {
              setCurrentTab("buy-redeem");
            }
          }
        } if (tab === "deposits") {
          if (bonded_state?.fund_aa) {
            if ("reserve" in bonded_state) {
              setCurrentTab("fund");
            } else {
              setCurrentTab("buy-redeem");
            }
          } else {
            setCurrentTab(tab);
          }
        } else {
          setCurrentTab(tab);
        }
      }
      setTabInitialized(true);
    }
  }, [loaded, tabInitialized, bonded_state]);

  const handleClickToLiquidity = () => {
    ReactGA.event({
      category: "Stablecoin",
      action: "Click to liquidity"
    })
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>
      <Spin size="large" />
    </div>
  } else if (address === undefined || !loaded) {
    return null;
  } else if (
    !handleSkip &&
    address !== "undefined" &&
    ((!symbol1 && !pendings.tokens1) ||
      (!symbol2 && !pendings.tokens2) ||
      (!symbol3 && !pendings.tokens3 && bonded_state.interest_rate) || (fund_aa && !symbol4 && !pendings.tokens4))
  ) {
    return (
      <RegisterSymbols
        symbol1={symbol1}
        symbol2={symbol2}
        symbol3={symbol3}
        pendings={pendings}
        fund_aa={fund_aa}
        fund_asset={fund_state?.shares_asset}
        asset1={bonded_state.asset1}
        asset2={bonded_state.asset2}
        asset3={stable_state?.asset || deposit_state?.asset}
        decimals1={actualParams.decimals1}
        decimals2={actualParams.decimals2}
        reserve_asset_decimals={actualParams.reserve_asset_decimals}
        address={address}
        activeWallet={activeWallet}
        handleSkip={setHandleSkip}
        interest={stable_state?.asset || !!bonded_state.interest_rate}
        isV2={!!fund_aa}
      />
    );
  } else
    return (
      <div>
        <Helmet title="Bonded stablecoins - Trade" />
        <>
          <Tabs
            activeKey={currentTab}
            onChange={(key) => setCurrentTab(key)}
            animated={false}
          >
            <TabPane
              disabled={!("reserve" in bonded_state)}
              tab={
                <a href={`${basename}/trade/${address}/charts`}>
                  <LineChartOutlined /> {t("trade.tabs.charts.name", "Charts")}
                </a>
              }
              key="charts"
            >
              <Charts isActive={currentTab === "charts"} params={actualParams} />
            </TabPane>
            <TabPane
              tab={
                <a href={`${basename}/trade/${address}/buy-redeem`}>
                  <InteractionOutlined /> {t("trade.tabs.buy_redeem.name", "Buy/redeem")}
                </a>
              }
              key="buy-redeem"
            >
              {!fund_aa ? ("reserve" in bonded_state ? (
                <Row style={{ marginTop: 20 }}>
                  <Col md={{ span: 10 }} xs={{ span: 24 }}>
                    <Issue />
                  </Col>
                  <Col md={{ span: 10, offset: 4 }} xs={{ span: 24 }}>
                    <Redeem setWalletModalVisibility={setWalletModalVisibility} />
                  </Col>
                </Row>
              ) : (
                <Row style={{ marginTop: 20 }}>
                  <Col span={18}>
                    <Issue />
                  </Col>
                </Row>
              )) : <IssueAndRedeem />}

              <div style={{ textAlign: "center" }}>
                <Trans i18nKey="trade.tabs.buy_redeem.liquidity">
                  <p>You can earn additional interest by adding these tokens to liquidity pools, see <a target="_blank" rel="noopener" href="https://liquidity.obyte.org" onClick={handleClickToLiquidity}>liquidity.obyte.org</a>.</p>
                </Trans>
              </div>
            </TabPane>
            {fund_aa ? <TabPane
              disabled={!("reserve" in bonded_state)}
              tab={
                <a href={`${basename}/trade/${address}/fund`}>
                  <FundIcon /> {t("trade.tabs.stability_fund.name", "Stability fund")}
                </a>
              }
              key="fund"
            >
              <StabilityFund />
            </TabPane> : <TabPane
              disabled={!("reserve" in bonded_state) || (!bonded_state.interest_rate && !deposit_state.supply)}
              tab={
                <a href={`${basename}/trade/${address}/deposits`}>
                  <ImportOutlined /> {t("trade.tabs.deposits.name", "Deposits")}
                </a>
              }
              key="deposits"
            >
              <Deposits params={actualParams} openWalletModal={setWalletModalVisibility} />
            </TabPane>}
            <TabPane
              disabled={!("reserve" in bonded_state)}
              tab={
                <a href={`${basename}/trade/${address}/capacitor`}>
                  <CapacitorIcon />
                  {t("trade.tabs.capacitor.name", "Capacitors")}
                </a>
              }
              key="capacitor"
            >
              <Capacitors
                address={address}
                bonded_state={bonded_state}
                params={actualParams}
                reserve_asset_symbol={reserve_asset_symbol}
              />
            </TabPane>

            <TabPane
              disabled={!("reserve" in bonded_state)}
              tab={
                <a href={`${basename}/trade/${address}/governance`}>
                  <GovernanceIcon />
                  {t("trade.tabs.governance.name", "Governance")}
                </a>
              }
              key="governance"
            >
              <Governance openWalletModal={setWalletModalVisibility} />
            </TabPane>
            <TabPane
              disabled={!("reserve" in bonded_state)}
              tab={
                <a href={`${basename}/trade/${address}/transactions`}>
                  <NodeIndexOutlined />
                  {t("trade.tabs.transactions.name", "Transactions")}
                </a>
              }
              key="transactions"
            >
              <Transactions />
            </TabPane>
            <TabPane
              tab={
                <a href={`${basename}/trade/${address}/parameters`}>
                  <SlidersOutlined />
                  {t("trade.tabs.parameters.name", "Parameters")}
                </a>
              }
              key="parameters"
            >
              <Parameters />
            </TabPane>
          </Tabs>
        </>

        <BackTop />
      </div>
    );
};