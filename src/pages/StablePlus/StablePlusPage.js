
import React, { useState } from "react";
import { Trans, useTranslation } from 'react-i18next';
import ReactGA from "react-ga";
import { handleViewport } from "react-in-viewport";
import { useSelector } from "react-redux";
import { PopularInterest } from "pages/Home/components/Popular/PopularInterest";
import { InterestChart } from "pages/Home/components/Tokens/charts/InterestChart";
import { useGetTokenPrices } from "pages/Home/components/Tokens/useGetTokenPrices";

import styles from "./StablePlusPage.module.css";
import { ReactComponent as Curve } from "./img/curve.svg";
import safeIllustration from "../Home/components/Tokens/img/safe.svg";
import charityIllustration from "../Home/components/Tokens/img/charity.svg";

export const StablePlusPage = () => {
  const { data } = useSelector((state) => state.list);
  const [interest] = useGetTokenPrices(data);
  const { t } = useTranslation();

  const [shown, setShown] = useState({
    programmed: false,
    curve: false,
    hold: false,
    charity: false,
    lost: false
  });

  const [shownAnimation, setShownAnimation] = useState({
    programmed: false
  });

  const handleShown = (token) => {
    if (!shown[token]) {
      setShown((c) => ({ ...c, [token]: true }));
      ReactGA.event({
        category: "Stableplus",
        action: `Shown ${token}`
      });
    }
    if (token in shownAnimation && !shownAnimation[token]) {
      setShownAnimation((c) => ({ ...c, [token]: true }));
      setTimeout(() => setShownAnimation((c) => ({ ...c, [token]: false })), 20000);
    }
  }

  return <>
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>{t("stableplus.title", "Stable+ coins")}</h1>
          <h2 className={styles.subTitle}>{t("stableplus.sub_title_1", "Stablecoins that earn interest")}</h2>
          <h2 className={styles.subTitle}>{t("stableplus.sub_title_2", "Best suited for investors seeking predictable income")}</h2>
        </div>
        <PopularInterest prices={interest} hideTitle={true} inInterestPage={true} />
      </div>
      <ProgrammedPriced isShown={shownAnimation.programmed} onEnterViewport={() => handleShown("programmed")} />
      <BondingCurve onEnterViewport={() => handleShown("curve")} />
      <Hold onEnterViewport={() => handleShown("hold")} />
      <Charity onEnterViewport={() => handleShown("charity")} />
      <StableCoinsList onEnterViewport={() => handleShown("list")} prices={interest} />
    </div>
  </>
}

const ProgrammedPricedNotTracking = ({ forwardedRef, isShown }) => {
  return (
    <div className={styles.wrapper} ref={forwardedRef}>
      <div className={styles.first + " " + styles.text}>
        <Trans i18nKey="stableplus.programmed">
          <p>The prices of <b>stable+</b> coins are programmed to follow the growing target price. For example, IUSD — a USD-pegged coin — started at exactly 1 USD on September 22, 2020 and the target price of the token grows at 16% per year. In one year, it is expected to be $1.16, in two years — $1.3456.</p>
        </Trans>
      </div>
      <div className={styles.second + " " + styles.img}>
        <div className={styles.illustration + " " + styles.big}>
          <InterestChart isShown={isShown} />
        </div>
      </div>
    </div>
  )
}

const BondingCurveNotTracking = ({ forwardedRef }) => {
  return (
    <div className={styles.wrapper} ref={forwardedRef}>
      <div className={styles.first + " " + styles.img}>
        <div className={styles.illustration + " " + styles.big}>
          <Curve />
        </div>
      </div>
      <div className={styles.second + " " + styles.text}>
        <Trans i18nKey="stableplus.curve">
          <p>
            This is made possible by a bonding curve that mathematically bonds their prices with the prices of the companion <i>growth</i> tokens. Every deviation from the target price activates incentives for the traders of both stable+ and growth tokens that make them buy or sell their tokens and eventually correct the price of the stable+ coin back to the target. They do so to make a profit.
          </p>
        </Trans>
      </div>
    </div>
  )
}

const HoldNotTracking = ({ forwardedRef }) => {
  return (
    <div className={styles.wrapper} ref={forwardedRef}>
      <div className={styles.first + " " + styles.text}>
        <Trans i18nKey="home.tokens.interest.buy">
          <p>You can buy IUSD and hold.</p>
          <p>Or you can buy IUSD, <a href="/trade#deposits" target="_blank" rel="noopener">put it on a deposit</a>, get an equivalent amount of OUSD stablecoin in exchange, and periodically withdraw the accrued interest in OUSD.</p>
        </Trans>
      </div>
      <div className={styles.second + " " + styles.img}>
        <div className={styles.illustration} style={{ paddingLeft: 10 }}>
          <img alt="Safe deposit" src={safeIllustration} />
        </div>
      </div>
    </div>
  )
}

const CharityNotTracking = ({ forwardedRef }) => {
  return (
    <div className={styles.wrapper} ref={forwardedRef}>
      <div className={styles.first + " " + styles.img}>
        <div className={styles.illustration + " " + styles.big}>
          <img alt="Charity" src={charityIllustration} />
        </div>
      </div>
      <div className={styles.second + " " + styles.text}>
        <Trans i18nKey="home.tokens.interest.redirect">
          <p>
            You can also redirect interest to someone else, e.g. to a charity or another nonprofit. Estonian Cryptocurrency Association, Obyte Foundation, and <a href="https://pollopollo.org/" target="_blank" rel="noopener">PolloPollo</a> are already enrolled as suggested recipients.
          </p>
        </Trans>
      </div>
    </div>
  )
}

const StableCoinsListNotTracking = ({ forwardedRef, prices }) => {
  return (
    <div ref={forwardedRef}>
      <div style={{ textAlign: "center" }} className={styles.subTitle}>
        <Trans i18nKey="stableplus.choose">
          Choose your stable+ coin
        </Trans>
      </div>
      <div style={{ marginTop: 100 }}>
        <PopularInterest prices={prices} inInterestPage={true} hideTitle={true} showAll={true} />
      </div>
    </div>
  )
}

const ProgrammedPriced = handleViewport(ProgrammedPricedNotTracking, { threshold: 0.8 });
const BondingCurve = handleViewport(BondingCurveNotTracking, { threshold: 0.8 });
const Hold = handleViewport(HoldNotTracking, { threshold: 0.8 });
const Charity = handleViewport(CharityNotTracking, { threshold: 0.8 });
const StableCoinsList = handleViewport(StableCoinsListNotTracking, { threshold: 0.5 });