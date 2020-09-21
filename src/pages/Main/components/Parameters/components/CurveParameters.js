import React from "react";
import { Label } from "components/Label/Label";
import styles from "../Parameters.module.css";
export const CurveParameters = ({
  params,
  oracleValue1,
  oracleValue2,
  oracleValue3,
}) => {
  const {
    oracle1,
    oracle2,
    oracle3,
    feed_name1,
    feed_name2,
    feed_name3,
    op1,
    op2,
    op3,
    oracles,
    reserve_asset,
    reserve_asset_decimals,
    decimals1,
    decimals2,
    leverage,
    m,
    n,
    interest_rate,
  } = params;

  return (
    <div style={{ marginBottom: 20 }}>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="Address of the oracle that reports the price for the stable token"
            label="Oracle 1"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{oracles ? oracles[0].oracle : oracle1}</span>
      </div>
      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label descr="Name of the oracle’s data feed" label="Feed name 1" />
        </div>
        <span className={styles.semi}>:</span>
        <span>
          {oracles ? oracles[0].feed_name : feed_name1} (Latest value:{" "}
          {oracleValue1})
        </span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="How the oracle’s price is interpreted: use ‘*’ if the oracle reports the price of the reserve currency in terms of the stable currency (this is the default). Use ‘/’ if it is the reverse, i.e. the price of the stable token in terms of the reserve asset."
            label="Operation 1"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{oracles ? oracles[0].op || "*" : op1 || "*"}</span>
      </div>

      {((oracles && oracles[1]) || oracle2) && (
        <>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr="Optional second oracle. Use it if you want to multiply or delete prices of different assets. E.g. to create a stablecoin pegged to TSLA, you need to divide two price feeds: GBYTE/USD and TSLA/USD."
                label="Oracle 2"
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>{oracles ? oracles[1].oracle : oracle2}</span>
          </div>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr="Name of the 2nd oracle’s data feed."
                label="Feed name 2"
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>
              {oracles ? oracles[1].feed_name : feed_name2} (Latest value:{" "}
              {oracleValue2})
            </span>
          </div>

          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr="What to do with the 2nd price: multiply or delete."
                label="Operation 2"
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>{oracles ? oracles[1].op || "*" : op2 || "*"}</span>
          </div>
        </>
      )}

      {((oracles && oracles[2]) || oracle3) && (
        <>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr="Optional 3rd oracle, like the 2nd one."
                label="Oracle 3"
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>{oracles ? oracles[2].oracle : oracle3}</span>
          </div>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr="Name of the 3rd oracle’s data feed."
                label="Feed name 3"
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>
              {oracles ? oracles[2].feed_name : feed_name3} (Latest value:{" "}
              {oracleValue3})
            </span>
          </div>

          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr="What to do with the 3rd price: multiply or delete."
                label="Operation 3"
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>{oracles ? oracles[2].op || "*" : op3 || "*"}</span>
          </div>
        </>
      )}

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="Asset used as reserve to back the issuance of Token1 and Token2. GBYTE is the default."
            label="Reserve asset"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{reserve_asset === "base" ? "GBYTE" : reserve_asset}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="Decimals of the reserve asset units. 9 for GBYTE."
            label="Reserve decimals"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{reserve_asset_decimals}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label descr="Decimals of Token1 (growth token)" label="Decimals 1" />

          <span className={styles.semi}>:</span>
        </div>
        <span>{decimals1}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="Decimals of Token2 (interest token, or stable token if interest is 0)"
            label="Decimals 2"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{decimals2}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="Leverage applied to the stable token. Use 0 (the default) to track the oracle price. Use positive values to create an asset that represents leveraged long positions in the reserve asset, negative values for leveraged short positions."
            label="Leverage"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{leverage}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={
              <span>
                Power m in the bonding curve r=s<sub>1</sub>
                <sup>m</sup> s<sub>2</sub>
                <sup>n</sup>
              </span>
            }
            label="m"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{m}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={
              <span>
                Power n in the bonding curve r=s<sub>1</sub>
                <sup>m</sup> s<sub>2</sub>
                <sup>n</sup>
              </span>
            }
            label="n"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{n}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr="Interest rate that Token2 earns on top of the stable token"
            label="Interest rate"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{interest_rate * 100} %</span>
      </div>

      {/* <div className={styles.param}>
        <div className={styles.labelWrap}>
          Asset1
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
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
          Asset2
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
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
          Stable asset
          <span style={{ marginRight: 5 }}>:</span>
        </div>
        <span>
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
      </div> */}

      {/* <div className={styles.param}>
        <div className={styles.labelWrap}>
          Autonomous Agent of deposits
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
          Autonomous Agent of curve
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
          Autonomous Agent of governance
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
      </div> */}

      {/* {symbol1 && (
        <div className={styles.param}>
          <div className={styles.labelWrap}>
            Symbol for tokens1
            <span style={{ marginRight: 5 }}>:</span>
          </div>
          <span>{symbol1}</span>
        </div>
      )}
      {symbol2 && (
        <div className={styles.param}>
          <div className={styles.labelWrap}>
            Symbol for tokens2
            <span style={{ marginRight: 5 }}>:</span>
          </div>
          <span>{symbol2}</span>
        </div>
      )}
      {symbol3 && (
        <div className={styles.param}>
          <div className={styles.labelWrap}>
            Symbol for stable tokens
            <span style={{ marginRight: 5 }}>:</span>
          </div>
          <span>{symbol3}</span>
        </div>
      )} */}
    </div>
  );
};
