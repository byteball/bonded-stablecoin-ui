import React from "react";
import { Link } from "react-router-dom";
import { Space } from "antd";

import styles from "./Footer.module.css";

export const Footer = () => (
  <div>
    <Space
      className={styles.footer}
      style={{ display: "flex", justifyContent: "center" }}
      size={20}
    >
      <Link className={styles.trade} to="/trade">
        Trade
      </Link>
      <Link to="/faq">F.A.Q.</Link>
      <Link to="/how-it-works">How it works</Link>
    </Space>
    <div className={styles.copy}>&copy; Obyte</div>
  </div>
);
