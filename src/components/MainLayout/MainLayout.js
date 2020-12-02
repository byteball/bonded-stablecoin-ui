import React, { useState, useEffect } from "react";
import obyte from "obyte";
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
import { useDispatch, useSelector } from "react-redux";
import { addReferrer } from "store/actions/settings/addReferrer";
import { firstVisit } from "store/actions/settings/firstVisit";

const { Header, Content } = Layout;

export const MainLayout = ({ children, walletModalVisible, setWalletModalVisibility }) => {
  const { pathname, search, hash } = useLocation();
  const dispatch = useDispatch();
  const [width] = useWindowSize();
  const [activeMenu, setActiveMenu] = useState(false);
  const {visitedBefore} = useSelector(state => state.settings);

  useEffect(() => {
    const unlisten = historyInstance.listen((location, action) => {
      if(!location.pathname.includes("governance")){
        window.scrollTo(0, 0);
      }
      if (action === "PUSH" || action === "POP") {
        ReactGA.pageview(location.pathname);
      }
    });
    ReactGA.pageview(pathname);
    return () => {
      unlisten();
    };
  }, []);

  useEffect(()=>{
    if (search && !visitedBefore){
      const [name, address] = search.slice(1).split("=");
      if (name === "r" && address && obyte.utils.isValidAddress(address)){
        dispatch(addReferrer(address));
      } 
      dispatch(firstVisit());
      if (!hash){
        historyInstance.replace(pathname, { search: undefined })
      } 
    } else if (!visitedBefore){
      dispatch(firstVisit());
    } else if (visitedBefore && search && !hash){
      historyInstance.replace(pathname, { search: undefined })
    }
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
          justify={width < 1240 ? "space-between" : undefined}
          align="middle"
        >
          <NavLink to="/" className={styles.navLink}>
            <img className={styles.logo} src={logo} alt="Bonded stablecoins" />

            <div style={{ paddingLeft: 10 }}>
              <span>Bonded {width > 440 ? "stablecoins" : ""}</span>
              <sup style={{ fontSize: 8 }}>Beta</sup>
            </div>
          </NavLink>

          {width >= 1240 ? (
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
              </Drawer>
              {width < 1240 && width >= 320 && pathname !== "/" && (
                <WalletOutlined
                  onClick={() => setWalletModalVisibility(true)}
                  className={styles.iconWallet}
                />
              )}
              <Button onClick={() => setActiveMenu(true)}>Menu</Button>
            </div>
          )}
          {width >= 1240 && pathname !== "/" && (
            <div style={{ marginLeft: "auto" }}>
              <SelectWallet />
            </div>
          )}
        </Row>
      </Header>

      <Content
        className={styles.content}
        style={
          pathname === "/" || width < 1240
            ? { padding: 0 }
            : { padding: "20px 20px" }
        }
      >
        <SelectWalletModal
          visible={walletModalVisible}
          onCancel={() => setWalletModalVisibility(false)}
        />
        <Route path="/trade/:address?/:tab?" exact>
          <SelectStablecoin />
          <Statistics windowWidth={width} />
        </Route>
        {children !== undefined && children !== null && (
          <div style={{ background: "#fff", padding: 20 }}>
            {children}
          </div>
        )}
      </Content>
    </Layout>
  );
};
