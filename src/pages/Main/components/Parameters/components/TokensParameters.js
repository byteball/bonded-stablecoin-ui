import React from "react";
import styles from "../Parameters.module.css";
import config from "config";

export const TokensParameters = ({
  asset,
  asset1,
  asset2,
  symbol1,
  symbol2,
  symbol3,
}) => {
  return (
    <>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          Tokens1
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          {symbol1 ? symbol1 + ", asset: " : null}
          <a
            href={`https://${
              config.TESTNET ? "testnet" : ""
            }explorer.obyte.org/#${asset1}`}
            target="_blank"
            rel="noopener"
          >
            {asset1}
          </a>
        </span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          Tokens2
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          {symbol2 ? symbol2 + ", asset: " : null}
          <a
            href={`https://${
              config.TESTNET ? "testnet" : ""
            }explorer.obyte.org/#${asset2}`}
            target="_blank"
            rel="noopener"
          >
            {asset2}
          </a>
        </span>
      </div>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          Stable tokens
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
          {symbol3 ? symbol3 + ", asset: " : null}
          <a
            href={`https://${
              config.TESTNET ? "testnet" : ""
            }explorer.obyte.org/#${asset}`}
            target="_blank"
            rel="noopener"
          >
            {asset}
          </a>
        </span>
      </div>
    </>
  );
};
