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
          descr={paramsDescription.min_deposit_term}
          label="Min deposit term"
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{min_deposit_term} {activeWallet && <ButtonEditParams param="deposits.min_deposit_term" address={address} />}</span>
    </div>

    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr={paramsDescription.challenging_period}
          label="Challenging period"
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{challenging_period} {activeWallet && <ButtonEditParams param="deposits.challenging_period" address={address} />}</span>
    </div>

    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr={paramsDescription.challenge_immunity_period}
          label="Challenge immunity period"
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{challenge_immunity_period} {activeWallet && <ButtonEditParams param="deposits.challenge_immunity_period" address={address} />}</span>
    </div>

    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr={paramsDescription.reporter_share}
          label="Reporter share"
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{reporter_share * 100}% {activeWallet && <ButtonEditParams param="deposits.reporter_share" address={address} />}</span>
    </div>

  </div>
}