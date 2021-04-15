import React from "react";

import { Label } from "components/Label/Label";
import styles from "../Parameters.module.css";
import { paramsDescription } from "pages/Create/paramsDescription";
import { ButtonEditParams } from "./ButtonEditParams";

export const DecisionEngineParameters = ({below_peg_threshold, below_peg_timeout, min_reserve_delta, decision_engine_aa, address, activeWallet, reserve_asset_decimals, reserve_asset_symbol}) => {
  return <div style={{ marginBottom: 20 }}>
    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr={paramsDescription().below_peg_threshold.desc}
          label={paramsDescription().below_peg_threshold.name}
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{below_peg_threshold}</span>
    </div>

    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr={paramsDescription().below_peg_timeout.desc}
          label={paramsDescription().below_peg_timeout.name}
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{below_peg_timeout} seconds</span>
    </div>

    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr={paramsDescription().min_reserve_delta.desc}
          label={paramsDescription().min_reserve_delta.name}
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{min_reserve_delta / 10 ** reserve_asset_decimals} {reserve_asset_symbol}</span>
    </div>

    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr={paramsDescription().decision_engine_aa.desc}
          label={paramsDescription().decision_engine_aa.name}
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{decision_engine_aa} {activeWallet && <ButtonEditParams param="decision_engine_aa" address={address} />}</span>
    </div>
  </div>
}