import React from "react";

import styles from "./Reasons.module.css";

export const Reasons = () => (
  <div>
    <div className={styles.title}>
      007 reasons why bonded stablecoins are the best stablecoins ever
    </div>

    <div className={styles.items}>
      <div>
        <div className={styles.item}>
          <div className={styles.label}>001</div>
          <div className={styles.info}>
            100% crypto backed: no need to trust any custodians or
            intermediaries.
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.label}>002</div>
          <div className={styles.info}>
            No overcollateralization: you pay 1 USD worth of GBYTE to get 1 USD
            worth of stablecoins, plain and simple.
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.label}>003</div>
          <div className={styles.info}>
            They live on a DAG: no fucking miners, no blocks, no miner
            manipulation, no bribing of miners with fees.
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.label}>004</div>
          <div className={styles.info}>
            They pay interest: there are interest-paying tokens and deposits
            along with the stablecoins. What’s more, you can help a good cause
            by redirecting interest to a charity.
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.label}>005</div>
          <div className={styles.info}>
            There is a group of people &mdash; GRD holders &mdash; who have skin
            in the game as their wealth depends on the success of the ecosystem.
            They are able to make governance decisions that would keep the
            stablecoin stable, liquid, and widely used.
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.label}>006</div>
          <div className={styles.info}>
            They survive any volatility, even large abrupt movements of the
            reserve asset price. No margin calls, no liquidations.
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.label}>007</div>
          <div className={styles.info}>They have a cool name!</div>
        </div>
      </div>
    </div>
  </div>
);
