import React, { useState } from "react";
import ReactGA from "react-ga";
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

import stableIllustration from "./img/OUSD.svg";
import safeIllustration from "./img/safe.svg";
import charityIllustration from "./img/charity.svg";
import steeringIllustration from "./img/steering.svg";

import styles from "./Tokens.module.css";
import handleViewport from "react-in-viewport";
import { PopularInterest } from "../Popular/PopularInterest";
import { PopularStable } from "../Popular/PopularStable";

import { InterestChart } from "./charts/InterestChart";
import { StableChart } from "./charts/StableChart";
import { CoinsAnimation } from "./charts/CoinsAnimation"
import { GrowthChart } from "./charts/GrowthChart";
import { PopularGrowth } from "../Popular/PopularGrowth";
import { useGetTokenPrices } from "./useGetTokenPrices";

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
  const { data } = useSelector((state) => state.list);
  const [interest, stable, growth] = useGetTokenPrices(data);

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
      <PopularGrowth prices={growth} />
    </div>
  )
}


const InterestNotTracking = ({ forwardedRef, isShown }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.tokens} ref={forwardedRef}>
      <h3 className={styles.tokensTitle}>
        {t("home.tokens.interest.title", "IUSD — interest token that earns 16% interest in USD")}
      </h3>
      <div className={styles.wrapper}>
        <div className={styles.first + " " + styles.text}>
          <Trans i18nKey="home.tokens.interest.follow">
            <p>IUSD is for investors seeking predictable income.</p>
            <p>Its price is programmed to follow the growing target price. It started at exactly 1 USD on September 22, 2020 and the target price of the token grows at 16% per year. In one year, it is expected to be $1.16, in two years — $1.3456. It is a <b>stable+</b> coin.</p>
          </Trans>
        </div>
        <div className={styles.second + " " + styles.img}>
          <div className={styles.illustration + " " + styles.big}>
            <InterestChart isShown={isShown} />
          </div>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.first + " " + styles.img}>
          <div className={styles.illustration} style={{ paddingLeft: 10 }}>
            <img alt="Safe deposit" src={safeIllustration} />
          </div>
        </div>
        <div className={styles.second + " " + styles.text}>
          <Trans i18nKey="home.tokens.interest.buy">
            <p>You can buy IUSD and hold.</p>
            <p>Or you can buy IUSD, <a href="/trade#deposits" target="_blank" rel="noopener">put it on a deposit</a>, get an equivalent amount of OUSD stablecoin in exchange, and periodically withdraw the accrued interest in OUSD.</p>
          </Trans>
        </div>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.first + " " + styles.text}>
          <Trans i18nKey="home.tokens.interest.redirect">
            <p>
              You can also redirect interest to someone else, e.g. to a charity or another nonprofit. Estonian Cryptocurrency Association, Obyte Foundation, and <a href="https://pollopollo.org/" target="_blank" rel="noopener">PolloPollo</a> are already enrolled as suggested recipients.
            </p>
          </Trans>
        </div>
        <div className={styles.second + " " + styles.img}>
          <div className={styles.illustration}>
            <img alt="Safe deposit" src={charityIllustration} />
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
            <p>Its price is programmed to stay near 1 USD.</p>
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
            <p>OUSD is essentially IUSD with interest payments stripped off. You get it in exchange for depositing IUSD and can use it for payments while your deposit is accruing interest. You can withdraw interest and spend it too.</p>
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
        {t("home.tokens.growth.title", "GRD — growth and governance token")}
      </h3>
      <div className={styles.wrapper}>
        <div className={styles.first + " " + styles.text}>
          <Trans i18nKey="home.tokens.growth.risks">
            <p>GRD is for investors seeking higher income, with higher risks.</p>
            <p>The price of GRD depends on the popularity of IUSD (and therefore OUSD). As more IUSD tokens are issued, the price of GRD grows programmatically — this follows from the bonding curve mechanics. When IUSD tokens are redeemed, GRD falls in price.</p>
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
          <Trans i18nKey="home.tokens.growth.vote">
            <p>GRD holders can vote to tune the interest rate and various parameters of the ecosystem that are important for keeping the peg. GRD holders can even vote to hire a management team tasked with promoting the use of OUSD — which directly affects GRD price.</p>
            <p>GRD comes from <b>gr</b>owth and <b>d</b>ollar, not from <b>gr</b>ee<b>d</b> as some might think.</p>
          </Trans>
        </div>
      </div>
    </div>
  )
};

const Coins = handleViewport(CoinsAnimation, { threshold: 0.7 });
const Interest = handleViewport(InterestNotTracking, { threshold: 0.5 });
const Stable = handleViewport(StableNotTracking, { threshold: 0.5 });
const Growth = handleViewport(GrowthNotTracking, { threshold: 0.5 });