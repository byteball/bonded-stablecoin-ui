import React from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

export const MainMenu = ({ mode, pathname, onClose, width }) => {
  const { address } = useSelector((state) => state.active);
  const { lang } = useSelector((state) => state.settings);
  const { t } = useTranslation();
  const basename = lang && lang !== "en" ? "/" + lang : "";
  const buyOrTrade = (pathname.includes("trade") && "/trade") || (pathname.includes("buy") && "/buy");
  return (
    <Menu
      mode={mode === "horizontal" ? "horizontal" : "vertical"}
      breakpoint="lg"
      overflowedIndicator=". . ."
      collapsedWidth="0"
      style={{border: "none", width: (width < 1340 && mode === "horizontal" ? width - 40 - 205 - 250 - 70 - 30 : 760) }}
      selectedKeys={pathname !== "/" ? (buyOrTrade ? [buyOrTrade] : [pathname]) : []}
      onOpenChange={() => {
        onClose && onClose();
      }}
    >
      <Menu.Item key="/trade">
        <NavLink
          to={`${basename}/trade${address ? "/" + address : ""}`}
          activeClassName="selected"
        >
          <span role="img" aria-label="Chart">📈</span> {t("main_menu.trade", "Trade")}
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/buy" style={{ marginRight: 10 }}>
        <NavLink to={`${basename}/buy`} replace={true} style={{ color: "#FFAA09" }}>
          {t("main_menu.buy_with_btc", "Buy with Bitcoin")}
        </NavLink>
      </Menu.Item>
      <Menu.Item key={`${basename}/create`}>
        <NavLink to={`${basename}/create`} activeClassName="selected">
          {t("main_menu.create", "Create")}
        </NavLink>
      </Menu.Item>
      <Menu.Item key={`${basename}/how-it-works`}>
        <NavLink to={`${basename}/how-it-works`} activeClassName="selected">
          {t("main_menu.how", "How it works")}
        </NavLink>
      </Menu.Item>
      <Menu.Item key={`${basename}/faq`}>
        <NavLink to={`${basename}/faq`} activeClassName="selected">
          F.A.Q.
        </NavLink>
      </Menu.Item>
    </Menu>
  );
};
