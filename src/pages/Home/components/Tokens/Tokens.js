import React, { useState } from "react";
import ReactGA from "react-ga";
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

import stableIllustration from "./img/OUSD.svg";
import steeringIllustration from "./img/steering.svg";

import styles from "./Tokens.module.css";
import handleViewport from "react-in-viewport";
import { PopularInterest } from "../Popular/PopularInterest";
import { PopularStable } from "../Popular/PopularStable";

import { InterestChart } from "./charts/InterestChart";
import { StableChart } from "./charts/StableChart";
import { CoinsAnimation } from "./charts/CoinsAnimation"
import { GrowthChart } from "./charts/GrowthChart";
import { useGetTokenPrices } from "./useGetTokenPrices";
import { PopularFund } from "../Popular/PopularFund";

export const Tokens = () => {
  const [shown, setShown] = useState({
    interest: false,
    growth: false,
    stable: false
  });
  const [shownAnimation, setShownAnimation] = useState({
    interest: false,
    growth: false,
    stable: false,
    coins: false
  });
  const list = useSelector((state) => state.list.data);
  const data = useSelector((state) => state.data);
  const [interest, stable, fund] = useGetTokenPrices(list, data.data, data.balances);

  const handleShown = (token) => {
    if (!shown[token]) {
      setShown((c) => ({ ...c, [token]: true }));
      ReactGA.event({
        category: "Stablecoin",
        action: `Shown ${token}`
      });
    }
    if (!shownAnimation[token]) {
      setShownAnimation((c) => ({ ...c, [token]: true }));
      setTimeout(() => setShownAnimation((c) => ({ ...c, [token]: false })), 20000);
    }
  }

  return (
    <div>
      <Interest isShown={shownAnimation.interest} onEnterViewport={() => handleShown("interest")} />
      <PopularInterest prices={interest} />
      <Stable isShown={shownAnimation.stable} setShownAnimation={setShownAnimation} isShownCoinAnimation={shownAnimation.coins} onEnterViewport={() => handleShown("stable")} />
      <PopularStable prices={stable} />
      <Growth isShown={shownAnimation.growth} onEnterViewport={() => handleShown("growth")} />
      <PopularFund prices={fund} />
    </div>
  )
}


const InterestNotTracking = ({ forwardedRef, isShown }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.tokens} ref={forwardedRef}>
      <h3 className={styles.tokensTitle}>
        {t("home.tokens.interest.title", "IUSD — interest token that aims to earn 16% interest in USD")}
      </h3>
      <div className={styles.wrapper}>
        <div className={styles.first + " " + styles.text}>
          <Trans i18nKey="home.tokens.interest.follow">
            <p>IUSD is for investors seeking predictable income.</p>
            <p>Its price is programmed to gravitate to the growing target price. It started at exactly 1 USD on April 16, 2021 and the target price of the token grows at 16% per year. In one year, it is expected to be $1.16, in two years — $1.3456. It is a <b>stable+</b> coin. (Now the growth rate is 20% after it was changed by a governance vote.)</p>
          </Trans>
        </div>
        <div className={styles.second + " " + styles.img}>
          <div className={styles.illustration + " " + styles.big}>
            <InterestChart isShown={isShown} />
          </div>
        </div>
      </div>
    </div>
  )
};

const StableNotTracking = ({ forwardedRef, isShown, isShownCoinAnimation, setShownAnimation }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.tokens} ref={forwardedRef}>
      <h3 className={styles.tokensTitle}>{t("home.tokens.stable.title", "OUSD — a USD-pegged stablecoin")}</h3>
      <div className={styles.wrapper}>
        <div className={styles.first + " " + styles.img}>
          <div className={styles.illustration}>
            <img alt="Stable token" src={stableIllustration} />
          </div>
        </div>
        <div className={styles.second + " " + styles.text}>
          <Trans i18nKey="home.tokens.stable.payments">
            <p>OUSD is a familiar unit of account best suited for payments. </p>
            <p>Unlike USD, it can be freely and instantly moved cross-border, and the fees are fractions of a cent.</p>
          </Trans>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.first + " " + styles.text}>
          <Trans i18nKey="home.tokens.stable.programmed">
            <p>Its price is programmed to gravitate to 1 USD.</p>
          </Trans>
        </div>
        <div className={styles.second + " " + styles.img}>
          <div className={styles.illustration + " " + styles.big}>
            <StableChart isShown={isShown} />
          </div>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.first + " " + styles.img}>
          <div className={styles.illustration}>
            <Coins isShownCoinAnimation={isShownCoinAnimation} onEnterViewport={() => {
              if (!isShownCoinAnimation) {
                setShownAnimation((c) => ({ ...c, coins: true }));
                setTimeout(() => setShownAnimation((c) => ({ ...c, coins: false })), 20000);
              }
            }} />
          </div>
        </div>
        <div className={styles.second + " " + styles.text}>
          <Trans i18nKey="home.tokens.stable.exchange">
            <p>You can “stake” OUSD by converting it to IUSD. Any time later, you can make a reverse conversion and get more OUSD in exchange.</p>
          </Trans>
        </div>
      </div>
    </div>
  )
};

const GrowthNotTracking = ({ forwardedRef, isShown }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.tokens} ref={forwardedRef}>
      <h3 className={styles.tokensTitle}>
        {t("home.tokens.fund.title", "SFUSD — growth and governance token")}
      </h3>
      <div className={styles.wrapper}>
        <div className={styles.first + " " + styles.text}>
          <Trans i18nKey="home.tokens.fund.risks">
            <p>SFUSD is for investors seeking higher income, with higher risks.</p>
            <p>SFUSD tokens are shares in the stability fund that is programmatically managed to push the price of IUSD closer to the peg.</p>
            <p>The price of SFUSD depends on the popularity of IUSD. As more IUSD tokens are issued, the price of SFUSD grows programmatically — this follows from the bonding curve mechanics. When IUSD tokens are redeemed, SFUSD falls in price.</p>
          </Trans>
        </div>
        <div className={styles.second + " " + styles.img}>
          <div className={styles.illustration + " " + styles.big}>
            <GrowthChart isShown={isShown} />
          </div>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.first + " " + styles.img}>
          <div className={styles.illustration}>
            <img alt="Growth" src={steeringIllustration} />
          </div>
        </div>
        <div className={styles.second + " " + styles.text}>
          <Trans i18nKey="home.tokens.fund.vote">
            <p>SFUSD holders can vote to tune the interest rate and various parameters of the ecosystem that are important for keeping the peg. They can vote to replace the program, called Decision Engine (DE), that manages the fund. SFUSD holders can even vote to hire a management team tasked with promoting the use of OUSD — which directly affects SFUSD price.</p>
          </Trans>
        </div>
      </div>
    </div>
  )
};

const Coins = handleViewport(CoinsAnimation, { threshold: 0.7 });
const Interest = handleViewport(InterestNotTracking, { threshold: 0.1 });
const Stable = handleViewport(StableNotTracking, { threshold: 0.5 });
const Growth = handleViewport(GrowthNotTracking, { threshold: 0.5 });