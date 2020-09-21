import React from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export const MainMenu = ({ mode, pathname, onClose }) => {
  const { address } = useSelector((state) => state.active);
  return (
    <Menu
      mode={mode === "horizontal" ? "horizontal" : "vertical"}
      breakpoint="lg"
      collapsedWidth="0"
      selectedKeys={pathname !== "/" ? pathname : undefined}
      onOpenChange={() => {
        onClose && onClose();
      }}
    >
      <Menu.Item key="/trade">
        <NavLink
          to={`/trade${address ? "/" + address : ""}`}
          activeClassName="selected"
          style={{
            color: "#0037ff",
            fontWeight: "bold",
          }}
        >
          Trade
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/create">
        <NavLink to="/create" activeClassName="selected">
          Create
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/buy">
        <NavLink to="/buy" activeClassName="selected">
          Buy interest tokens
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/how-it-works">
        <NavLink to="/how-it-works" activeClassName="selected">
          How it works
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
