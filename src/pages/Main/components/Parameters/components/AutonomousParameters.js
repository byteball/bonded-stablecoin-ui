import React from "react";
import { useTranslation } from 'react-i18next';

import styles from "../Parameters.module.css";
import config from "config";

export const AutonomousParameters = ({
  deposit_aa,
  curve_aa,
  governance_aa,
  stable_aa,
  fund_aa,
  decision_engine_aa
}) => {
  const { t } = useTranslation();
  return (
    <div style={{ marginBottom: 20 }}>
      {curve_aa && <div className={styles.param}>
        <div className={styles.labelWrap}>
          {t("trade.tabs.parameters.title_curve", "Curve")}
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          <a
            href={`https://${config.TESTNET ? "testnet" : ""
              }explorer.obyte.org/address/${curve_aa}`}
            target="_blank"
            rel="noopener"
          >
            {curve_aa}
          </a>
        </span>
      </div>}
      {deposit_aa && <div className={styles.param}>
        <div className={styles.labelWrap}>
          {t("trade.tabs.parameters.title_deposits", "Deposits")}
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          <a
            href={`https://${config.TESTNET ? "testnet" : ""
              }explorer.obyte.org/address/${deposit_aa}`}
            target="_blank"
            rel="noopener"
          >
            {deposit_aa}
          </a>
        </span>
      </div>}
      {stable_aa && <div className={styles.param}>
        <div className={styles.labelWrap}>
          {t("trade.tabs.parameters.title_stable", "Stable")}
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          <a
            href={`https://${config.TESTNET ? "testnet" : ""
              }explorer.obyte.org/address/${stable_aa}`}
            target="_blank"
            rel="noopener"
          >
            {stable_aa}
          </a>
        </span>
      </div>}
      {fund_aa && <div className={styles.param}>
        <div className={styles.labelWrap}>
          {t("trade.tabs.parameters.title_fund", "Stability fund")}
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          <a
            href={`https://${config.TESTNET ? "testnet" : ""
              }explorer.obyte.org/address/${fund_aa}`}
            target="_blank"
            rel="noopener"
          >
            {fund_aa}
          </a>
        </span>
      </div>}
      {governance_aa && <div className={styles.param}>
        <div className={styles.labelWrap}>
          {t("trade.tabs.parameters.title_governance", "Governance")}
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          <a
            href={`https://${config.TESTNET ? "testnet" : ""
              }explorer.obyte.org/address/${governance_aa}`}
            target="_blank"
            rel="noopener"
          >
            {governance_aa}
          </a>
        </span>
      </div>}

      {decision_engine_aa && <div className={styles.param}>
        <div className={styles.labelWrap}>
          {t("trade.tabs.parameters.title_de", "Decision engine")}
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          <a
            href={`https://${config.TESTNET ? "testnet" : ""
              }explorer.obyte.org/address/${decision_engine_aa}`}
            target="_blank"
            rel="noopener"
          >
            {decision_engine_aa}
          </a>
        </span>
      </div>}
    </div>
  );
};
