import React from "react";
import { useTranslation } from 'react-i18next';

import styles from "../Parameters.module.css";
import config from "config";

export const TokensParameters = ({
  asset,
  asset1,
  asset2,
  symbol1,
  symbol2,
  symbol3,
  symbol4,
  shares_asset
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ marginBottom: 20 }}>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          {t("trade.tabs.parameters.tokens1", "Tokens1")}
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          {symbol1 ? (symbol1 + ", " + t("trade.tabs.parameters.asset", "asset") + ": ") : null}
          <a
            href={`https://${config.TESTNET ? "testnet" : ""
              }explorer.obyte.org/asset/${symbol1 || asset1}`}
            target="_blank"
            rel="noopener"
          >
            {asset1}
          </a>
        </span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          {t("trade.tabs.parameters.tokens2", "Tokens2")}
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          {symbol2 ? (symbol2 + ", " + t("trade.tabs.parameters.asset", "asset") + ": ") : null}
          <a
            href={`https://${config.TESTNET ? "testnet" : ""
              }explorer.obyte.org/asset/${symbol2 || asset2}`}
            target="_blank"
            rel="noopener"
          >
            {asset2}
          </a>
        </span>
      </div>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          {t("trade.tabs.parameters.stable_tokens", "Stable tokens")}
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          {symbol3 ? (symbol3 + ", " + t("trade.tabs.parameters.asset", "asset") + ": ") : null}
          <a
            href={`https://${config.TESTNET ? "testnet" : ""
              }explorer.obyte.org/asset/${symbol3 || asset}`}
            target="_blank"
            rel="noopener"
          >
            {asset}
          </a>
        </span>
      </div>
      {shares_asset && <div className={styles.param}>
        <div className={styles.labelWrap}>
          {t("trade.tabs.parameters.fund_tokens", "Fund tokens")}
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          {symbol4 ? (symbol4 + ", " + t("trade.tabs.parameters.asset", "asset") + ": ") : null}
          <a
            href={`https://${config.TESTNET ? "testnet" : ""
              }explorer.obyte.org/asset/${symbol4 || shares_asset}`}
            target="_blank"
            rel="noopener"
          >
            {shares_asset}
          </a>
        </span>
      </div>}
    </div>
  );
};
