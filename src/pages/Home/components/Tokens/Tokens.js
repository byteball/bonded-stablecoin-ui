import React, { useState } from "react";
import ReactGA from "react-ga";
import { Trans, useTranslation } from 'react-i18next';

import stableIllustration from "./img/OUSD.svg";
import interestIllustration from "./img/IUSD.svg";
import growthIllustration from "./img/GRD.svg";

import styles from "./Tokens.module.css";
import { Link } from "react-router-dom";
import handleViewport from "react-in-viewport/dist/lib/handleViewport";

export const Tokens = () => {
  const [shown, setShown] = useState({
    interest: false,
    growth: false,
    stable: false
  });

  const handleShown = (token) => {
    if (!shown[token]) {
      setShown((c) => ({ ...c, [token]: true }));
      ReactGA.event({
        category: "Stablecoin",
        action: `Shown ${token}`
      });
    }
  }

  return (
    <div>
      <Interest onEnterViewport={() => handleShown("interest")} />
      <Stable onEnterViewport={() => handleShown("stable")} />
      <Growth onEnterViewport={() => handleShown("growth")} />
    </div>
  )
}

const InterestNotTracking = ({ forwardedRef }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.tokens}>
      <div className={styles.infoFirst}>
        <div className={styles.tokensTitle}>
          {t("home.tokens.interest.title", "IUSD — interest token that earns 16% interest in USD")}
        </div>
        <Trans i18nKey="home.tokens.interest.info">
          <p ref={forwardedRef}>
            It started at exactly 1 USD on September 22, 2020 and the price of the
            token grows at 16% per year. In one year, it is expected to be $1.16,
            in two years &mdash; $1.3456, if the interest rate stays the same (it
            can be changed by GRD holders). It is a <b>stable+</b> coin.
          </p>
          <p>
            Stable+ coins are programmed to follow the growing target price, they do so thanks to bonding curve mechanics, and the programs cannot be changed.
          </p>
          <p>
            You can buy IUSD and hold. Or you can buy IUSD,{" "}
            <a href="/trade#deposits">
              put it on a deposit
            </a>
            , get an equivalent amount of OUSD in exchange, and periodically withdraw the
            accrued interest in OUSD. You can also redirect interest to someone else, e.g.
            to a charity or another nonprofit (Estonian Cryptocurrency Association, Obyte Foundation, and <a href="https://pollopollo.org" target="_blank" rel="noopener">PolloPollo</a> are already enrolled as suggested recipients).
          </p>
        </Trans>
        <Link className={styles.btnOpen} to="/buy">
          {t("home.tokens.interest.btn", "Buy IUSD interest tokens")}
        </Link>
      </div>
      <div className={styles.illustration}>
        <img alt="Interest token" src={interestIllustration} />
      </div>
    </div>
  )
};

const StableNotTracking = ({ forwardedRef }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.tokens}>
      <div className={styles.illustration}>
        <img alt="Stable token" src={stableIllustration} />
      </div>
      <div className={styles.infoSecond}>
        <div className={styles.tokensTitle}>{t("home.tokens.stable.title", "OUSD — a USD-pegged stablecoin")}</div>
        <Trans i18nKey="home.tokens.stable.info">
          <p ref={forwardedRef}>OUSD is essentially IUSD with interest payments stripped off. Its price stays near 1 USD &mdash; because it is so programmed, and the programs cannot be changed.</p>
          <p>
            OUSD is a familiar unit of account best suited for payments. Unlike
            USD, it can be freely and instantly moved cross-border, and the fees
            are fractions of a cent.
          </p>
          <p>
            You get it by <a href="/trade#deposits">depositing</a> IUSD, or you can buy it on the market, or you
            can receive it as payment for goods and services.
          </p>
        </Trans>
        <Link className={styles.btnOpen} to="/trade">
          {t("home.tokens.stable.btn", "Buy OUSD stablecoin")}
        </Link>
      </div>
    </div>
  )
};

const GrowthNotTracking = ({ forwardedRef }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.tokens}>
      <div className={styles.infoFirst}>
        <div className={styles.tokensTitle}>
          {t("home.tokens.growth.title", "GRD — growth and governance token")}
        </div>
        <Trans i18nKey="home.tokens.growth.info">
          <p ref={forwardedRef}>
            Price of GRD depends on the popularity of IUSD (and therefore OUSD). As
            more IUSD tokens are issued, the price of GRD grows programmatically — this follows from the bonding curve mechanics. When IUSD tokens
            are redeemed, GRD falls in price.
          </p>
          <p>
            GRD holders can <a href="/trade#governance">vote</a> to tune the interest rate and various parameters
            of the ecosystem that are important for keeping the peg. GRD holders
            can even vote to hire a management team tasked with promoting the use
            of OUSD &mdash; which directly affects GRD price.
          </p>
          <p>
            GRD comes from <b>gr</b>owth and <b>d</b>ollar, not from <b>gr</b>ee<b>d</b> as some might think.
          </p>
        </Trans>
        <Link className={styles.btnOpen} to="/trade">
          {t("home.tokens.stable.btn", "Buy GRD growth tokens")}
        </Link>
      </div>
      <div className={styles.illustration}>
        <img alt="Growth token" src={growthIllustration} />
      </div>
    </div>
  )
};

const Interest = handleViewport(InterestNotTracking);
const Stable = handleViewport(StableNotTracking);
const Growth = handleViewport(GrowthNotTracking);