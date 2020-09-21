import React from "react";

import styles from "../Parameters.module.css";
import config from "config";

export const AutonomusParameters = ({
  deposit_aa,
  curve_aa,
  governance_aa,
}) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          Curve
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          <a
            href={`https://${
              config.TESTNET ? "testnet" : ""
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
          Deposits
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          <a
            href={`https://${
              config.TESTNET ? "testnet" : ""
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
          Governance
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          <a
            href={`https://${
              config.TESTNET ? "testnet" : ""
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
