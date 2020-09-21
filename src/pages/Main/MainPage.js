import React, { useState, useEffect } from "react";
import { Tabs, Col, Row, BackTop } from "antd";
import {
  InteractionOutlined,
  ImportOutlined,
  SlidersOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

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

const { TabPane } = Tabs;

export const MainPage = () => {
  const {
    address,
    stable_state,
    deposit_state,
    params,
    symbol1,
    symbol2,
    symbol3,
  } = useSelector((state) => state.active);
  const pendings = useSelector((state) => state.pendings);
  const { activeWallet } = useSelector((state) => state.settings);
  const { loaded } = useSelector((state) => state.list);
  const [currentTab, setCurrentTab] = useState(undefined);
  const [handleSkip, setHandleSkip] = useState(false);
  const actualParams = getParams(params, stable_state);
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    document.title = "Bonded stablecoins - Trade";
  }, []);

  useEffect(() => {
    if (currentTab !== location.hash.slice(1)) {
      history.replace({ hash: currentTab });
    }
  }, [currentTab]);

  useEffect(() => {
    if (location.hash && location.hash.slice(1) !== currentTab) {
      setCurrentTab(location.hash.slice(1));
    } else if (!location.hash) {
      setCurrentTab("buy");
    }
  }, []);

  if (address === undefined || !loaded) {
    return null;
  } else if (
    !handleSkip &&
    address !== "undefined" &&
    ((!symbol1 && !pendings.tokens1) ||
      (!symbol2 && !pendings.tokens2) ||
      (!symbol3 && !pendings.tokens3))
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
              tab={
                <span>
                  <InteractionOutlined /> Buy/redeem
                </span>
              }
              key="buy"
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
              disabled={!("reserve" in stable_state)}
              tab={
                <span>
                  <ImportOutlined /> Deposits
                </span>
              }
              key="deposits"
            >
              <Deposits />
            </TabPane>

            <TabPane
              disabled={!("reserve" in stable_state)}
              tab={
                <span>
                  <CapacitorIcon />
                  Capacitors
                </span>
              }
              key="capacitor"
            >
              <Capacitors
                address={address}
                stable_state={stable_state}
                params={actualParams}
              />
            </TabPane>

            <TabPane
              disabled={!("reserve" in stable_state)}
              tab={
                <span>
                  <GovernanceIcon />
                  Governance
                </span>
              }
              key="governance"
            >
              <Governance />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <SlidersOutlined />
                  Parameters
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
