import React from "react";

import stableIllustration from "./img/OUSD.svg";
import interestIllustration from "./img/IUSD.svg";
import growthIllustration from "./img/GRD.svg";

import styles from "./Tokens.module.css";
import { Link } from "react-router-dom";

export const Tokens = () => (
  <div>
    <div className={styles.tokens}>
      <div className={styles.infoFirst}>
        <div className={styles.tokensTitle}>
          IUSD &mdash; interest token that earns 16% interest in USD
        </div>
        <p>
          It started at exactly 1 USD on September 22, 2020 and the price of the
          token grows at 16% per year. In one year, it is expected to be $1.16,
          in two years &mdash; $1.3456, if the interest rate stays the same (it
          can be changed by GRD holders). It is a <b>stable+</b> coin.
        </p>
        <p>
          You can buy IUSD and hold. Or you can buy IUSD,{" "}
          <a href="/trade#deposits">
            put it on a deposit
          </a>
          , get an equivalent amount of OUSD, and periodically withdraw the
          accrued interest. You can also redirect interest to someone else, e.g.
          to a charity.
        </p>
        <Link className={styles.btnOpen} to="/buy">
          Buy interest tokens
        </Link>
      </div>
      <div className={styles.illustration}>
        <img alt="Interest token" src={interestIllustration} />
      </div>
    </div>
    <div className={styles.tokens}>
      <div className={styles.illustration}>
        <img alt="Stable token" src={stableIllustration} />
      </div>
      <div className={styles.infoSecond}>
        <div className={styles.tokensTitle}>OUSD &mdash; a USD-pegged stablecoin</div>
        <p>OUSD is essentially IUSD with interest payments stripped off.</p>
        <p>
          You get it by <a href="/trade#deposits">depositing</a> IUSD, or you can buy it on the market, or you
          can receive it as payment for goods and services.
        </p>
        <p>
          OUSD is a familiar unit of account best suited for payments. Unlike
          USD, it can be freely and instantly moved cross-border, and the fees
          are fractions of a cent.
        </p>
        <Link className={styles.btnOpen} to="/trade">
          trade
        </Link>
      </div>
    </div>
    <div className={styles.tokens}>
      <div className={styles.infoFirst}>
        <div className={styles.tokensTitle}>
          GRD &mdash; growth and governance token
        </div>
        <p>
          Price of GRD depends on popularity of IUSD (and therefore OUSD). As
          more IUSD tokens are issued, the price of GRD grows. When IUSD tokens
          are redeemed, GRD falls in price.
        </p>
        <p>
          GRD holders can <a href="/trade#governance">vote</a> to tune the interest rate and various parameters
          of the ecosystem that are important for keeping the peg. GRD holders
          can even vote to hire a management team tasked with promoting the use
          of OUSD &mdash; which directly affects GRD price.
        </p>
        <p>
          GRD comes from <b>gr</b>owth and <b>d</b>ollar, not from <b>gr</b>ee
          <b>d</b> as some might think.
        </p>
        <Link className={styles.btnOpen} to="/trade">
          trade
        </Link>
      </div>
      <div className={styles.illustration}>
        <img alt="Growth token" src={growthIllustration} />
      </div>
    </div>
  </div>
);
