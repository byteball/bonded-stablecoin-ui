import React, {useState} from "react";
import { Button } from "antd";

import { Label } from "components/Label/Label";
import { OracleInfoModal } from "modals/OracleInfoModal/OracleInfoModal";
import { ButtonEditParams } from "./ButtonEditParams";
import { paramsDescription } from "pages/Create/paramsDescription";

import styles from "../Parameters.module.css";
import config from "config";

export const CurveParameters = ({
  params,
  oracleValue1,
  oracleValue2,
  oracleValue3,
  reserve_asset_symbol,
  address,
  activeWallet
}) => {
  const [activeOracle, setActiveOracle] = useState(undefined);
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
      {((oracles && oracles[0]) || (!oracles && oracle1)) && (
        <>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr={paramsDescription.oracle1}
                label="Oracle 1"
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>
              {oracles ? oracles[0].oracle : oracle1}
              <Button type="link" size="small" onClick={()=>setActiveOracle(oracles ? oracles[0].oracle : oracle1)}>(Show info)</Button>
            </span>
          </div>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label descr={paramsDescription.feed_name1} label="Feed name 1" />
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
                descr={paramsDescription.op1}
                label="Operation 1"
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>{oracles ? oracles[0].op || "*" : op1 || "*"}</span>
          </div>
        </>
      )}
      
      {((oracles && oracles[1]) || (!oracles && oracle2)) && (
        <>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr={paramsDescription.oracle2}
                label="Oracle 2"
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>{oracles ? oracles[1].oracle : oracle2}</span>
            <Button type="link" size="small" onClick={()=>setActiveOracle(oracles ? oracles[1].oracle : oracle2)}>(Show info)</Button>
          </div>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr={paramsDescription.feed_name2}
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
                descr={paramsDescription.op2}
                label="Operation 2"
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>{oracles ? oracles[1].op || "*" : op2 || "*"}</span>
          </div>
        </>
      )}

      {((oracles && oracles[2]) || (!oracles && oracle3)) && (
        <>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr={paramsDescription.oracle3}
                label="Oracle 3"
              />

              <span className={styles.semi}>:</span>
            </div>
            <span>{oracles ? oracles[2].oracle : oracle3}</span>
            <Button type="link" size="small" onClick={()=>setActiveOracle(oracles ? oracles[2].oracle : oracle3)}>(Show info)</Button>
          </div>
          <div className={styles.param}>
            <div className={styles.labelWrap}>
              <Label
                descr={paramsDescription.feed_name3}
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
                descr={paramsDescription.op3}
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
            descr={paramsDescription.reserve_asset}
            label="Reserve asset"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{reserve_asset === "base"
          ? "GBYTE"
          : config.reserves[reserve_asset]
            ? config.reserves[reserve_asset].name
            : reserve_asset_symbol || ''}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.reserve_decimals}
            label="Reserve decimals"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{reserve_asset_decimals}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label descr={paramsDescription.decimals1} label="Decimals 1" />

          <span className={styles.semi}>:</span>
        </div>
        <span>{decimals1}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.decimals2}
            label="Decimals 2"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{decimals2}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.leverage}
            label="Leverage"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{leverage}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.m}
            label="m"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{m}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.n}
            label="n"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{n}</span>
      </div>

      <div className={styles.param}>
        <div className={styles.labelWrap}>
          <Label
            descr={paramsDescription.interest_rate}
            label="Interest rate"
          />

          <span className={styles.semi}>:</span>
        </div>
        <span>{interest_rate * 100} % {activeWallet && <ButtonEditParams param="interest_rate" address={address} />}</span>
      </div>
      <OracleInfoModal address={activeOracle} onCancel={()=>setActiveOracle(undefined)}/>
    </div>
  );
};
