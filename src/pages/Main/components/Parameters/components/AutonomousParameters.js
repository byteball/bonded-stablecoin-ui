import React from "react";
import { useTranslation } from 'react-i18next';

import styles from "../Parameters.module.css";
import config from "config";

export const AutonomousParameters = ({
  deposit_aa,
  curve_aa,
  governance_aa,
}) => {
  const { t } = useTranslation();
  return (
    <div style={{ marginBottom: 20 }}>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          {t("trade.tabs.parameters.title_curve", "Curve")}
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          <a
            href={`https://${config.TESTNET ? "testnet" : ""
              }explorer.obyte.org/#${curve_aa}`}
            target="_blank"
            rel="noopener"
          >
            {curve_aa}
          </a>
        </span>
      </div>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          {t("trade.tabs.parameters.title_deposits", "Deposits")}
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          <a
            href={`https://${config.TESTNET ? "testnet" : ""
              }explorer.obyte.org/#${deposit_aa}`}
            target="_blank"
            rel="noopener"
          >
            {deposit_aa}
          </a>
        </span>
      </div>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          {t("trade.tabs.parameters.title_governance", "Governance")}
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          <a
            href={`https://${config.TESTNET ? "testnet" : ""
              }explorer.obyte.org/#${governance_aa}`}
            target="_blank"
            rel="noopener"
          >
            {governance_aa}
          </a>
        </span>
      </div>
    </div>
  );
};
