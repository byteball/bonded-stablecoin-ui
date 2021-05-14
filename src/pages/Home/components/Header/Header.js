import React from "react";
import styles from "./Header.module.css";
import { useTranslation } from 'react-i18next';
import { IssueAndRedeemAllTokens } from "../IssueAndRedeemAllTokens/IssueAndRedeemAllTokens";

export const Header = React.memo(() => {
  const { t } = useTranslation();
  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>{t("home.header.title", "Bonded stablecoins")}</h1>
          <h2 className={styles.subTitle}>{t("home.header.desc", "The most advanced stablecoins powered by bonding curves")}</h2>
        </div>
        <IssueAndRedeemAllTokens />
      </header>
    </>
  );
});
