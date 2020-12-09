import React from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

export const MainMenu = ({ mode, pathname, onClose }) => {
  const { address } = useSelector((state) => state.active);
  const { t } = useTranslation();
  return (
    <Menu
      mode={mode === "horizontal" ? "horizontal" : "vertical"}
      breakpoint="lg"
      collapsedWidth="0"
      selectedKeys={pathname !== "/" ? (pathname.includes("trade") ? ["/trade"] : [pathname]) : []}
      onOpenChange={() => {
        onClose && onClose();
      }}
    >
      <Menu.Item key="/trade">
        <NavLink
          to={`/trade${address ? "/" + address : ""}`}
          activeClassName="selected"
        >
          <span role="img" aria-label="Chart">📈</span> {t("main_menu.trade", "Trade")}
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/buy" style={{ marginRight: 10 }}>
        <NavLink to="/buy">
          {t("main_menu.buy", "Buy interest tokens")}
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/referral" style={{ marginRight: 10 }}>
        <NavLink to="/referral" activeClassName="selected" style={{ margin: 0, padding: 0 }}>
          {t("main_menu.referral", "Referral program")}
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/create">
        <NavLink to="/create" activeClassName="selected">
          {t("main_menu.create", "Create")}
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/how-it-works">
        <NavLink to="/how-it-works" activeClassName="selected">
          {t("main_menu.how", "How it works")}
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/faq">
        <NavLink to="/faq" activeClassName="selected">
          F.A.Q.
        </NavLink>
      </Menu.Item>
    </Menu>
  );
};
