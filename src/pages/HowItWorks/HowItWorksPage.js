import React, { useEffect } from "react";
import { Typography } from "antd";
import { useTranslation, Trans } from 'react-i18next';

import graphics from "./img/graphics.svg";
import capacitor from "./img/capacitor.svg";
import agent from "./img/agent.svg";
import styles from "./HowItWorksPage.module.css";

const { Title } = Typography;

export const HowItWorksPage = () => {
  useEffect(() => {
    document.title = "Bonded stablecoins - How it works";
  }, []);
  const { t } = useTranslation();
  return (
    <div>
      <div className={styles.howItWork}>
        <Title level={1}>{t("how_it_works.title", "How it works")}</Title>
        <div className={styles.subTitle}>
          <Trans i18nKey="how_it_works.desc">
            There is some math behind all this. IUSD and GRD tokens exist on
            a <b>bonding curve</b>, that is a mathematical formula that connects the
            amounts of IUSD and GRD tokens issued with the amount of the reserve
            currency{" "} <span style={{ whiteSpace: "nowrap" }}>&mdash; Bytes &mdash;</span>{" "}
            used to issue them.
          </Trans>
        </div>
        <div className={styles.items}>
          <div className={styles.item}>
            <div className={styles.infoFirst}>
              <div>
                <Trans i18nKey="how_it_works.formula">
                  The formula is like:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    <i>r</i> = <i>S</i>
                    <sub>1</sub>
                    <sup>2</sup> <i>S</i>
                    <sub>2</sub>
                    <sup>1/2</sup>
                  </span>
                ,
                </Trans>
              </div>
              <Trans i18nKey="how_it_works.where">
                where:
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                  <li>
                    - <i>r</i> is the total amount of GBYTE reserve locked to issue both tokens;
                  </li>
                  <li>- <i>s</i><sub>1</sub> is the total supply of token1 — GRD;</li>
                  <li>- <i>s</i><sub>2</sub> is the total supply of token2 — IUSD.</li>
                </ul>
              </Trans>
              <div className={styles.image}>
                <img alt="Graphics" src={graphics} />
              </div>
            </div>
            <div className={styles.infoSecond}>
              <Trans i18nKey="how_it_works.curve">
                <p>
                  That is, in order to issue more GRD or IUSD tokens, one needs to
                  lock some reserve in GBYTE, and when one wants to redeem GRD or
                  IUSD, they get a share of the reserve back. The prices of GRD
                  and IUSD, i.e. how much reserve one needs to pay per token, or
                  can get back per token, depend on the current supplies of the
                  tokens.
                </p>
                <p>
                  How is the peg maintained? There is a target price of IUSD which
                  is 1 USD plus interest accrued since inception. The target price
                  is known from GBYTE/USD price reported by an oracle that feeds
                  data from cryptocurrency exchanges and the time elapsed since
                  the stablecoin was launched. Whenever someone wants to buy or
                  sell IUSD or GRD such that this transaction would push IUSD
                  price away from the target, they have to pay a fee. The farther
                  away from the target, the larger the fee gets. Conversely,
                  whenever someone pushes the price closer to the target, they get
                  a reward, which is paid from the previously accumulated fees.
                </p>
              </Trans>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.infoFirst}>
              <Trans i18nKey="how_it_works.capacitor">
                This mechanism is called a <b>capacitor</b>. It gets “charged” with fees
                when traders move the price away from the target, and releases the
                charge to reward those who move the price closer to the target.
              </Trans>
            </div>
            <div className={styles.imageSecond}>
              <img alt="Capacitor" src={capacitor} />
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.imageFirst}>
              <img alt="Autonomous agent" src={agent} />
            </div>
            <div className={styles.infoSecond}>
              <Trans i18nKey="how_it_works.agents">
                <p>
                  All this is operated by several <b><a href="https://obyte.org/platform/autonomous-agents" target="_blank" rel="noopener">Autonomous Agents</a></b> which are
                  programs that run on <a href="https://obyte.org/" target="_blank" rel="noopener">Obyte</a> distributed ledger, do the math quickly
                  (they are good at math, unlike some people), and can never be
                  changed by anybody.
                </p>
                <p>
                  All transactions are transparent, quickly
                  verified by multiple independently operated computers, and can
                  never be reversed. There are no fallible humans who could
                  interfere with the work of Autonomous Agents, no fraudulent
                  banksters who could run away with your money, lose it to a bad
                  investment, or pay it to themselves as a quarterly bonus. The
                  coins cannot be printed at will, they are issued strictly against
                  the reserve, strictly according to the above formula. The reserve
                  is stored by an Autonomous Agent and can be withdrawn only in
                  exchange for the tokens, again strictly according to the bonding
                  curve formula.
                </p>
              </Trans>
            </div>
          </div>
        </div>

        <div className={styles.action}>
          <div>
            <Trans i18nKey="how_it_works.read">
            Read a <a href="https://medium.com/obyte/using-multi-dimensional-bonding-curves-to-create-stablecoins-81e857b4355c" target="_blank" rel="noopener">more thorough introduction to bonded stablecoins</a> in our blog.
            </Trans>
          </div>
        </div>
      </div>
    </div>
  );
};
