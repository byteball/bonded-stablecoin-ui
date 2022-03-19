import React, { useState, useEffect } from "react";
import obyte from "obyte";
import { Layout, Drawer, Row, Button } from "antd";
import { NavLink, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import { WalletOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';

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
import { langs, SelectLanguage } from "components/SelectLanguage/SelectLanguage";
import { SocialIcons } from "components/SocialIcons/SocialIcons";

const { Header, Content, Footer } = Layout;

export const MainLayout = ({ children, walletModalVisible, setWalletModalVisibility }) => {
  const { pathname, search, hash } = useLocation();
  const dispatch = useDispatch();
  const [width] = useWindowSize();
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState(false);
  const {visitedBefore, lang} = useSelector(state => state.settings);
  const loading = useSelector(state => state.active.loading);

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

  const pageIsSingle = pathname.includes("stableplus");

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#fff",
          paddingLeft: 20,
          paddingRight: 20,
          height: "100%"
        }}
      >
        <Row
          justify={width < 990 ? "space-between" : undefined}
          align="middle"
        >
          <NavLink to={lang !== "en" ? `/${lang}`: "/"} className={styles.navLink}>
            <img className={styles.logo} src={logo} alt="Bonded stablecoins" />

            {width > 440 && <div style={{ paddingLeft: 10 }}>
              <span>Bonded stablecoins</span>
              <sup style={{ fontSize: 8 }}>Beta</sup>
            </div>}
          </NavLink>
        {!pageIsSingle && <>
          {width >= 990 ? (
            <MainMenu pathname={pathname} width={width} mode="horizontal" />
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
                bodyStyle={{ padding: 0, overflowX: "hidden" }}
              >
                <MainMenu
                  pathname={pathname}
                  onClose={() => setActiveMenu(false)}
                  mode="vertical"
                />
                <div style={{ paddingLeft: 7 }}><SocialIcons size="short" gaLabel="Mobile menu" /></div>
              </Drawer>
              
              {width < 990 && width >= 320 && pathname !== "/" && (
                <WalletOutlined
                  onClick={() => setWalletModalVisibility(true)}
                  className={styles.iconWallet}
                  style={{ marginLeft: "auto" }}
                />
              )}
              <Button onClick={() => setActiveMenu(true)}>{t("main_menu.menu", "Menu")}</Button>
              <div style={{ width: 70, marginLeft: "auto" }}><SelectLanguage /></div>
            </div>
          )}

          {width >= 990 && pathname !== "/" && !langs.find((lang) => "/" + lang.name === pathname) && (
            <div style={{ marginLeft: "auto", display: "flex"}}>
              <SelectWallet />
              <div style={{ width: 70, marginLeft: "auto" }}><SelectLanguage /></div>
            </div>
          )}
        </>}
          {(((pathname === "/" || langs.find((lang) => "/" + lang.name === pathname)) && width >= 990) || pageIsSingle) && <div style={{ width: 70, marginLeft: "auto" }}><SelectLanguage /></div>}
        </Row>
      </Header>

      <Content
        className={styles.content}
        style={
          pathname === "/" || pageIsSingle || langs.find((lang) => "/" + lang.name === pathname) || width < 1240
            ? { padding: 0 }
            : { padding: "20px 20px" }
        }
      >
        <SelectWalletModal
          visible={walletModalVisible}
          onCancel={() => setWalletModalVisibility(false)}
        />
        <Route path="/:lang?/trade/:address?/:tab?" exact>
          <SelectStablecoin />
          {!loading && <Statistics windowWidth={width} />}
        </Route>
        {children !== undefined && children !== null && (
          <div style={{ background: "#fff", padding: 20 }}>
            {children}
          </div>
        )}
      </Content>
      <Footer>
        <SocialIcons centered gaLabel="Footer" />
      </Footer>
    </Layout>
  );
};
