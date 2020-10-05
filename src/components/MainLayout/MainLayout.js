import React, { useState, useEffect } from "react";
import { Layout, Drawer, Row, Button } from "antd";
import { NavLink, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import { WalletOutlined } from "@ant-design/icons";

import { SelectStablecoin } from "../SelectStablecoin/SelectStablecoin";
import { useWindowSize } from "hooks/useWindowSize";
import styles from "./MainLayout.module.css";
import { Statistics } from "../Statistics/Statistics";
import { MainMenu } from "../MainMenu/MainMenu";
import { SelectWallet } from "../SelectWallet/SelectWallet";
import historyInstance from "historyInstance";
import logo from "./img/logo.svg";
import { SelectWalletModal } from "modals/SelectWalletModal/SelectWalletModal";

const { Header, Content } = Layout;

export const MainLayout = (props) => {
  const { pathname } = useLocation();
  const [width] = useWindowSize();
  const [activeMenu, setActiveMenu] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

  useEffect(() => {
    const unlisten = historyInstance.listen((location, action) => {
      if (action === "PUSH" || action === "POP") {
        ReactGA.pageview(location.pathname);
      }
    });
    ReactGA.pageview(pathname);
    return () => {
      unlisten();
    };
  }, []);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#fff",
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <Row
          justify={width < 1100 ? "space-between" : undefined}
          align="middle"
        >
          <NavLink to="/" className={styles.navLink}>
            <img className={styles.logo} src={logo} alt="Bonded stablecoins" />

            <div style={{ paddingLeft: 10 }}>
              <span>Bonded {width > 440 ? "stablecoins" : ""}</span>
              <sup style={{ fontSize: 8 }}>Beta</sup>
            </div>
          </NavLink>

          {width >= 1100 ? (
            <MainMenu pathname={pathname} mode="horizontal" />
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Drawer
                title={
                  <span>
                    Bonded stablecoins <sup style={{ fontSize: 10 }}>Beta</sup>
                  </span>
                }
                placement="left"
                closable={true}
                onClose={() => setActiveMenu(false)}
                visible={activeMenu}
                bodyStyle={{ padding: 0 }}
              >
                <MainMenu
                  pathname={pathname}
                  onClose={() => setActiveMenu(false)}
                  mode="vertical"
                />
                {width < 1100 && pathname !== "/" && (
                  <Button onClick={() => setVisibleModal(true)} className={styles.iconWallet}>
                    <WalletOutlined /> Select Wallet
                  </Button>
                )}
              </Drawer>
              <Button onClick={() => setActiveMenu(true)}>Menu</Button>
            </div>
          )}
          {width >= 1100 && pathname !== "/" && (
            <div style={{ marginLeft: "auto" }}>
              <SelectWallet />
            </div>
          )}
        </Row>
      </Header>

      <Content
        className={styles.content}
        style={
          pathname === "/" || width < 1100
            ? { padding: 0 }
            : { padding: "20px 20px" }
        }
      >
        <SelectWalletModal
          visible={visibleModal}
          onCancel={() => setVisibleModal(false)}
        />
        <Route path="/trade/:address?" exact>
          <SelectStablecoin />
          <Statistics windowWidth={width} />
        </Route>
        {props.children !== undefined && props.children !== null && (
          <div style={{ background: "#fff", padding: 20 }}>
            {props.children}
          </div>
        )}
      </Content>
    </Layout>
  );
};
