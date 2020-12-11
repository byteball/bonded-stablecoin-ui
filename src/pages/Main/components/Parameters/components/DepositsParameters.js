import React from "react";

import { paramsDescription } from "pages/Create/paramsDescription";
import { Label } from "components/Label/Label";
import styles from "../Parameters.module.css";
import { ButtonEditParams } from "./ButtonEditParams";

export const DepositsParameters = ({ params, address, activeWallet }) => {
  const {
    min_deposit_term,
    challenging_period,
    challenge_immunity_period,
    reporter_share
  } = params;

  return <div style={{ marginBottom: 20 }}>
    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr={paramsDescription().min_deposit_term.desc}
          label={paramsDescription().min_deposit_term.name}
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{min_deposit_term} {activeWallet && <ButtonEditParams param="deposits.min_deposit_term" address={address} />}</span>
    </div>

    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr={paramsDescription().challenging_period.desc}
          label={paramsDescription().challenging_period.name}
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{challenging_period} {activeWallet && <ButtonEditParams param="deposits.challenging_period" address={address} />}</span>
    </div>

    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr={paramsDescription().challenge_immunity_period.desc}
          label={paramsDescription().challenge_immunity_period.name}
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{challenge_immunity_period} {activeWallet && <ButtonEditParams param="deposits.challenge_immunity_period" address={address} />}</span>
    </div>

    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr={paramsDescription().reporter_share.desc}
          label={paramsDescription().reporter_share.name}
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{reporter_share * 100}% {activeWallet && <ButtonEditParams param="deposits.reporter_share" address={address} />}</span>
    </div>

  </div>
}