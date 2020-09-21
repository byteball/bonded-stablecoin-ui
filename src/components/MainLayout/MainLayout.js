import React, { useState, useEffect } from "react";
import { Layout, Drawer, Row, Button } from "antd";
import { NavLink, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga";

import { SelectStablecoin } from "../SelectStablecoin/SelectStablecoin";
import { useWindowSize } from "hooks/useWindowSize";
import styles from "./MainLayout.module.css";
import { Statistics } from "../Statistics/Statistics";
import { MainMenu } from "../MainMenu/MainMenu";
import { SelectWallet } from "../SelectWallet/SelectWallet";
import historyInstance from "historyInstance";
import logo from "./img/logo.svg";

const { Header, Content } = Layout;

export const MainLayout = (props) => {
  const { pathname } = useLocation();
  const [width] = useWindowSize();
  const [activeMenu, setActiveMenu] = useState(false);
  useEffect(() => {
    const unlisten = historyInstance.listen((location, action) => {
      if (action === "PUSH" || action === "PUP") {
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
        style={{ background: "#fff", paddingLeft: width >= 1200 ? 50 : 20 }}
      >
        <Row justify={width < 840 ? "space-between" : undefined} align="middle">
          <NavLink to="/" className={styles.navLink}>
            <img className={styles.logo} src={logo} alt="Bonded stablecoins" />
            <div style={{ paddingLeft: 10, paddingRight: 10 }}>
              <span>Bonded {width > 440 && "stablecoins"}</span>
              <sup style={{ fontSize: 8 }}>Beta</sup>
            </div>
          </NavLink>

          {width >= 840 ? (
            <MainMenu pathname={pathname} mode="horizontal" />
          ) : (
            <>
              <Button onClick={() => setActiveMenu(true)}>Menu</Button>
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
              </Drawer>
            </>
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
          pathname === "/" || width <= 520
            ? { padding: 0 }
            : { padding: "30px 50px" }
        }
      >
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
