import React from "react";
import { Trans } from 'react-i18next';
import ReactGA from "react-ga";
import handleViewport from 'react-in-viewport';

import pools from "./img/liquidity.svg";
import styles from "./Liquidity.module.css";

const LiquidityNotTracking = ({ forwardedRef }) => {
  const handleClickLink = (name) => {
    ReactGA.event({
      category: "Stablecoin",
      action: "Click to " + name
    })
  }
  return (
    <div ref={forwardedRef} className={styles.liquidity}>
      <h2 className={styles.title}><Trans i18nKey="home.liquidity.title">Make money from liquidity provision</Trans></h2>
      <div className={styles.wrapper}>
        <div className={styles.info}>
          <Trans i18nKey="home.liquidity.info">
            <p>Add these tokens to liquidity pools on <a target="_blank" onClick={() => handleClickLink("Oswap")} rel="noopener" href="https://oswap.io/">Oswap</a> and
             earn from trading fees. Some liquidity pools are eligible for additional rewards,
             see <a target="_blank" rel="noopener" href="https://liquidity.obyte.org" onClick={() => handleClickLink("liquidity")}>liquidity.obyte.org</a>.</p>
            <p>The additional rewards are currently about <b>184% APY</b>, paid weekly.</p>
          </Trans>
        </div>
        <div className={styles.illustration}>
          <img src={pools} alt="Liquidity pools" />
        </div>
      </div>
    </div>
  );
}

export const Liquidity = handleViewport(LiquidityNotTracking);