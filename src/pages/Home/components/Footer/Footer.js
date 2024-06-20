import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Space } from "antd";

import styles from "./Footer.module.css";
import { useSelector } from "react-redux";

export const Footer = () => {
  const { lang } = useSelector((state) => state.settings);
  const { t } = useTranslation();
  const basename = lang && lang !== "en" ? "/" + lang : "";
  return (
    <div>
      <Space
        className={styles.footer}
        style={{ display: "flex", justifyContent: "center" }}
        size={20}
      >
        <Link className={styles.trade} to={`${basename}/trade`}>
          {t("main_menu.trade", "Trade")}
        </Link>
        <Link to={`${basename}/faq`}>F.A.Q.</Link>
        <Link to={`${basename}/how-it-works`}>{t("main_menu.how", "How it works")}</Link>
      </Space>
      <div className={styles.copy}><a href="https://obyte.org" target="_blank" rel="noopener">Built on Obyte</a></div>
    </div>
  )
};
