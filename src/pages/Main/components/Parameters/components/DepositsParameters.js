import React from "react";

import { Label } from "components/Label/Label";
import styles from "../Parameters.module.css";

export const DepositsParameters = ({ params }) => {
  const {
    min_deposit_term,
    challenging_period,
    challenge_immunity_period,
    reporter_share
  } = params;

  return <div>
    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr="Minimum deposit term in seconds. 
          During this period, the deposit cannot be closed."
          label="Min deposit term"
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{min_deposit_term}</span>
    </div>

    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr="The period in seconds when a deposit close attempt can be challenged. 
          The deposit with the least protection can be closed by anybody, not just the owner. 
          An attempt to close it starts a challenging period during which the close can be challenged by indicating another deposit with even less protection. 
          In this case, the reporter earns part of the deposit amount while the closer loses."
          label="Challenging period"
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{challenging_period}</span>
    </div>

    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr="The additional period in seconds during which a deposit cannot be used for challenging the closes of other deposits. 
          This period applies after the minimum deposit term and after the last protection withdrawal of the less protected deposit."
          label="Challenge immunity period"
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{challenge_immunity_period}</span>
    </div>

    <div className={styles.param}>
      <div className={styles.labelWrap}>
        <Label
          descr="The share of the deposit amount paid to users who report invalid close attempts when a deposit to be closed is not the least protected."
          label="Reporter share"
        />
        <span className={styles.semi}>:</span>
      </div>
      <span>{reporter_share * 100}%</span>
    </div>

  </div>
}