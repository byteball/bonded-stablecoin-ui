import React, { useEffect } from "react";
import { Typography } from "antd";

import graphics from "./img/graphics.svg";
import capacitor from "./img/capacitor.svg";
import agent from "./img/agent.svg";
import styles from "./HowItWorksPage.module.css";

const { Title } = Typography;

export const HowItWorksPage = () => {
  useEffect(() => {
    document.title = "Bonded stablecoins - How it works";
  }, []);

  return (
    <div>
      <div className={styles.howItWork}>
        <Title level={1}>How it works</Title>
        <div className={styles.subTitle}>
          There is some math behind all this. IUSD and GRD tokens exist on a
          bonding curve, that is a mathematical formula that connects the
          amounts of IUSD and GRD tokens issued with the amount of the reserve
          currency{" "}
          <span style={{ whiteSpace: "nowrap" }}>&mdash; Bytes &mdash;</span>{" "}
          used to issue them
        </div>
        <div className={styles.items}>
          <div className={styles.item}>
            <div className={styles.infoFirst}>
              <div>
                The formula is like:{" "}
                <span style={{ fontWeight: "bold" }}>
                  <i>r</i> = <i>S</i>
                  <sub>1</sub>
                  <sup>2</sup> <i>S</i>
                  <sub>2</sub>
                  <sup>1/2</sup>
                </span>
                ,
              </div>
              where:
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                <li>
                  r is the total amount of GBYTE reservelocked to issue both
                  tokens
                </li>
                <li>s1 is the total supply of GRD</li>
                <li>s2 is the total supply of IUSD</li>
              </ul>
              <div className={styles.image}>
                <img alt="Graphics" src={graphics} />
              </div>
            </div>
            <div className={styles.infoSecond}>
              <p>
                That is, in order to issue more GRD or IUSD tokens, one needs to
                lock some reserve in GBYTE, and when one wants to redeem GRD or
                IUSD, they get a share of the reserve back. The prices of GRD
                and IUSD, i.e. how much reserve one needs to pay per token, or
                can get back per token, depends on the current supplies of the
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
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.infoFirst}>
              This mechanism is called a capacitor. It gets “charged” with fees
              when traders move the price away from the target, and releases the
              charge to reward those who move the price closer to the target.
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
              All this is operated by several Autonomous Agents which are
              programs that run on Obyte distributed ledger, do the math quickly
              (they are good at math, unlike some people), and can never be
              changed by anybody. All transactions are transparent, quickly
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
            </div>
          </div>
        </div>

        <div className={styles.action}>
          <div>
            Read a more thorough introduction to bonded stablecoins in{" "}
            <a href="#">our blog</a>.
          </div>
        </div>
      </div>
    </div>
  );
};
