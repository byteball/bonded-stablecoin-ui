import React, { useState, useEffect } from "react";
import { Tabs, Col, Row, BackTop } from "antd";
import {
  InteractionOutlined,
  ImportOutlined,
  SlidersOutlined,
  LineChartOutlined
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

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

const { TabPane } = Tabs;

const tabList = ["buy", "charts", "deposits", "capacitor", "governance", "parameters"];

export const MainPage = ({ setWalletModalVisibility }) => {
  const {
    address,
    stable_state,
    deposit_state,
    reserve_asset_symbol,
    params,
    symbol1,
    symbol2,
    symbol3,
  } = useSelector((state) => state.active);
  const pendings = useSelector((state) => state.pendings);
  const { activeWallet, lang } = useSelector((state) => state.settings);
  const { loaded } = useSelector((state) => state.list);
  const [currentTab, setCurrentTab] = useState(undefined);
  const [handleSkip, setHandleSkip] = useState(false);
  const [tabInitialized , setTabInitialized] = useState(false);
  const actualParams = getParams(params, stable_state);
  const urlParams = useParams();
  const history = useHistory();
  const location = useLocation();
  const { tab } = urlParams;
  const hash = location.hash.slice(1);
  const { t } = useTranslation();
  const basename = lang && lang !== "en" ? "/" + lang : "";

  useEffect(() => {
    document.title = "Bonded stablecoins - Trade";
  }, []);

  useEffect(() => {
    if (loaded && tabInitialized && currentTab && address && !tabList.includes(hash)) {
      history.replace(`${basename}/trade/${address}/${currentTab || ""}${location.hash}`);
    }
  }, [currentTab, loaded, address]);

  useEffect(() => {
    if(!tabList.includes(hash)){
      history.replace({ hash: undefined });
    }
  }, [address]);
  
  useEffect(()=>{
    if(tabInitialized  &&  tab !== currentTab){
      setCurrentTab(tab);
    }
    if(tab !== "governance" && !tabList.includes(hash)){
      history.replace({ hash: undefined });
    }
  }, [tab])

  useEffect(()=>{
    if(loaded && !isEmpty(stable_state) && !tabInitialized){
      if(tabList.includes(hash)){
        if("reserve" in stable_state || ["parameters","charts"].includes(hash)){
          setCurrentTab(hash === "buy" ? "buy-redeem" : hash);
        } else {
          setCurrentTab("buy-redeem");
        }
        history.replace({ hash: undefined });
      } else if(!tab) {
        if ("reserve" in stable_state) {
          setCurrentTab("charts");
        } else {
          setCurrentTab("buy-redeem");
        }
      } else {
        setCurrentTab(tab);
      }
      setTabInitialized(true);
    }
  }, [loaded, tabInitialized, stable_state])

  if (address === undefined || !loaded) {
    return null;
  } else if (
    !handleSkip &&
    address !== "undefined" &&
    ((!symbol1 && !pendings.tokens1) ||
      (!symbol2 && !pendings.tokens2) ||
      (!symbol3 && !pendings.tokens3 && stable_state.interest_rate))
  ) {
    return (
      <RegisterSymbols
        symbol1={symbol1}
        symbol2={symbol2}
        symbol3={symbol3}
        pendings={pendings}
        asset1={stable_state.asset1}
        asset2={stable_state.asset2}
        asset3={deposit_state.asset}
        decimals1={actualParams.decimals1}
        decimals2={actualParams.decimals2}
        address={address}
        activeWallet={activeWallet}
        handleSkip={setHandleSkip}
        interest={!!stable_state.interest_rate}
      />
    );
  } else
    return (
      <div>
        <>
          <Tabs
            activeKey={currentTab}
            onChange={(key) => setCurrentTab(key)}
            animated={false}
          >
            <TabPane
              disabled={!("reserve" in stable_state)}
              tab={
                <span>
                  <LineChartOutlined /> {t("trade.tabs.charts.name", "Charts")}
                </span>
              }
              key="charts"
            >
              <Charts params={actualParams} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <InteractionOutlined /> {t("trade.tabs.buy_redeem.name", "Buy/redeem")}
                </span>
              }
              key="buy-redeem"
            >
              {"reserve" in stable_state ? (
                <Row style={{ marginTop: 20 }}>
                  <Col md={{ span: 10 }} xs={{ span: 24 }}>
                    <Issue />
                  </Col>
                  <Col md={{ span: 10, offset: 4 }} xs={{ span: 24 }}>
                    <Redeem />
                  </Col>
                </Row>
              ) : (
                  <Row style={{ marginTop: 20 }}>
                    <Col span={18}>
                      <Issue />
                    </Col>
                  </Row>
                )}
            </TabPane>
            <TabPane
              disabled={!("reserve" in stable_state) || (!stable_state.interest_rate && !deposit_state.supply)}
              tab={
                <span>
                  <ImportOutlined /> {t("trade.tabs.deposits.name", "Deposits")}
                </span>
              }
              key="deposits"
            >
              <Deposits params={actualParams} openWalletModal={setWalletModalVisibility} />
            </TabPane>
            <TabPane
              disabled={!("reserve" in stable_state)}
              tab={
                <span>
                  <CapacitorIcon />
                  {t("trade.tabs.capacitor.name", "Capacitors")}
                </span>
              }
              key="capacitor"
            >
              <Capacitors
                address={address}
                stable_state={stable_state}
                params={actualParams}
                reserve_asset_symbol={reserve_asset_symbol}
              />
            </TabPane>

            <TabPane
              disabled={!("reserve" in stable_state)}
              tab={
                <span>
                  <GovernanceIcon />
                  {t("trade.tabs.governance.name", "Governance")}
                </span>
              }
              key="governance"
            >
              <Governance openWalletModal={setWalletModalVisibility} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <SlidersOutlined />
                  {t("trade.tabs.parameters.name", "Parameters")}
                </span>
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
