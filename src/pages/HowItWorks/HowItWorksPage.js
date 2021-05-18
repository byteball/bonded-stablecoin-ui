import React, { useEffect, useState, Suspense } from "react";
import { Typography } from "antd";
import { useTranslation, Trans } from 'react-i18next';
import { Helmet } from "react-helmet";

import capacitor from "./img/capacitor.svg";
import agent from "./img/agent.svg";
import trade from "./img/trade.svg";
import fund from "./img/fund_desc.svg";
import styles from "./HowItWorksPage.module.css";
import { useWindowSize } from "hooks/useWindowSize";

const Graph3D = React.lazy(() => import('react-graph3d-vis'));

const { Title } = Typography;

export const HowItWorksPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([])
  const [width] = useWindowSize();
  useEffect(() => {
    const data = [];
    for (let i = 0; i <= 0.0005; i = i + 0.0001) {
      for (let j = 0; j <= 200000; j = j + 10000) {
        data.push({ x: i, y: j, z: Math.ceil(i ** 2 * j ** 2) });
      }
    }
    setData(data)
  }, [])

  return (
    <div>
      <Helmet title="Bonded stablecoins - How it works" />
      <div className={styles.howItWork}>
        <Title level={1}>{t("how_it_works.title", "How it works")}</Title>
        <div className={styles.subTitle}>
          <Trans i18nKey="how_it_works_v2.desc">
            There is some math behind all this. The USD-pegged stablecoin operates based on two main tokens — IUSDV2 and GRDV2 — that exist on
            a <b>bonding curve</b>, that is a mathematical formula that connects the
            amounts of IUSDV2 and GRDV2 tokens issued with the amount of the reserve
            currency{" "} <span style={{ whiteSpace: "nowrap" }}>— Bytes —</span>{" "}
            used to issue them.
          </Trans>
        </div>
        <div className={styles.items}>
          <div className={styles.item}>
            <div className={styles.infoFirst}>
              <div>
                <Trans i18nKey="how_it_works_v2.formula">
                  The formula is like:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    <i>r</i> = <i>s</i>
                    <sub>1</sub>
                    <sup>2</sup> <i>s</i>
                    <sub>2</sub>
                    <sup>2</sup>
                  </span>
                ,
                </Trans>
              </div>
              <Trans i18nKey="how_it_works_v2.where">
                where:
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                  <li>
                    - <i>r</i> is the total amount of GBYTE reserve locked to issue both tokens;
                  </li>
                  <li>- <i>s</i><sub>1</sub> is the total supply of token1 — GRDV2;</li>
                  <li>- <i>s</i><sub>2</sub> is the total supply of token2 — IUSDV2.</li>
                </ul>
              </Trans>
              <Suspense fallback={<div>Loading...</div>}>
                <div className={styles.image} style={{marginTop: width > 1100 ? "-100px" : 0}}>
                  {data.length > 0 && <Graph3D
                    data={data}
                    options={{
                      width: "100%",
                      height: width > 1100 ? "690px" : "500px",
                      style: "surface",
                      keepAspectRatio: false,
                      showPerspective: true,
                      showGrid: true,
                      verticalRatio: 0.8,
                      showShadow: false,
                      xLabel: "s1 (GRDV2)",
                      yLabel: "s2 (IUSDV2)",
                      zLabel: "Reserve",
                      zValueLabel: (z) => z / 1e3 + "k",
                      yValueLabel: (y) => y / 1e3 + "k",
                      tooltip: ({ x, y, z }) => `
                      <div style="text-align: left;">
                        s<sub>1</sub> (GRDV2): ${x} <br/>
                        s<sub>2</sub> (IUSDV2): ${y} <br/>
                        Reserve (GBYTE): ${z}
                      </div>
                      `,
                      cameraPosition: {
                        distance: width > 1340 ? 1.8 : (width < 1140 ? 2.2 : 2),
                        vertical: 0
                      }
                    }}
                  />}
                </div>
              </Suspense>
            </div>
            <div className={styles.infoSecond}>
              <Trans i18nKey="how_it_works_v2.curve">
                <p>
                  That is, in order to issue more GRDV2 or IUSDV2 tokens, one needs to
                  lock some reserve in GBYTE, and when one wants to redeem GRDV2 or
                  IUSDV2, they get a share of the reserve back. The prices of GRDV2
                  and IUSDV2, i.e. how much reserve one needs to pay per token, or
                  can get back per token, depend on the current supplies of the
                  tokens.
                </p>
                <p>The price of token1 (GRDV2) is <span style={{ fontWeight: "bold" }}>
                  <i>p</i><sub>1</sub> =  <span style={{ fontWeight: "500" }}>2</span> <i>s</i>
                  <sub>1</sub> <i>s</i>
                  <sub>2</sub>
                  <sup>2</sup>
                </span></p>
                <p>The price of token2 (IUSDV2) is <span style={{ fontWeight: "bold" }}>
                  <i>p</i><sub>2</sub> = <span style={{ fontWeight: "500" }}>2</span> <i>s</i>
                  <sub>1</sub>
                  <sup>2</sup> <i>s</i>
                  <sub>2</sub>
                </span></p>
                <p>
                  The stability mechanisms are designed to keep the price <i>p</i><sub>2</sub> of IUSDV2
                  near its target price which is 1 USD plus interest accrued since inception.
                  The target price is known from GBYTE/USD price reported by an oracle that
                  feeds data from cryptocurrency exchanges and the time elapsed since the
                  stablecoin was launched.
                </p>
              </Trans>
            </div>
          </div>
          <div style={{ marginTop: 100, marginBottom: 70 }}>
            <div style={{ textAlign: "center" }}>
              <Title level={2}><Trans i18nKey="how_it_works_v2.mechanisms">There are 3 mechanisms that keep the price near the target:</Trans></Title>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.infoFirst}>
              <div style={{ fontWeight: "bold", fontSize: 24, marginBottom: 5 }}><Trans i18nKey="how_it_works_v2.title_capacitor">1. The capacitor</Trans></div>
              <Trans i18nKey="how_it_works_v2.capacitor">
                Whenever someone wants to buy or sell IUSDV2 such that this transaction
                would push the IUSDV2 price away from the target, they have to pay a fee.
                The farther away from the target, the larger the fee gets. The fees get
                accumulated in a special reserve which is called a capacitor.
                Whenever someone pushes the price closer to the target, they get a reward,
                which is paid from the capacitor.
                This way, the capacitor incentivizes the trades that correct the price, and disincentivizes the trades that push the price away from the target.
              </Trans>
            </div>
            <div className={styles.imageSecond}>
              <img alt="Capacitor" src={capacitor} />
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.imageFirstFull}>
              <img alt="Stability Fund" src={fund} />
            </div>
            <div className={styles.infoSecond}>
              <div style={{ fontWeight: "bold", fontSize: 24, marginBottom: 5 }}><Trans i18nKey="how_it_works_v2.title_fund">2. Stability Fund</Trans></div>
              <Trans i18nKey="how_it_works_v2.fund">
                The fund holds the entire supply of GRDV2 and some amount of the reserve currency GBYTE that was contributed by investors.
                The fund is algorithmically managed by an Autonomous Agent called <b>Decision Engine</b>, which can use the fund’s GBYTE and GRDV2
                to buy or redeem GRDV2 in order to change its supply <i>s</i><sub>1</sub> and thus change the price <i>p</i><sub>2</sub> back to the target. Investors buy shares
                SFUSD in the fund by contributing GBYTE into its reserves. They do so anticipating that the shares would appreciate thanks
                to the growth of IUSDV2 issuance which raises the worth of the fund’s GRDV2 holdings.
              </Trans>
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.infoFirst}>
              <div style={{ fontWeight: "bold", fontSize: 24, marginBottom: 5 }}><Trans i18nKey="how_it_works_v2.title_trader">3. Trader Incentives</Trans></div>
              <Trans i18nKey="how_it_works_v2.trader_incentives">
                Knowing that the Stability Fund would eventually intervene and correct
                the price back to the target, traders can make a profit by buying or
                selling before the Fund. For example, they can buy IUSDV2 when it trades
                below the target anticipating that the price will soon rise to the target
                and they’ll have an opportunity to sell higher. By buying or selling
                before the Fund, they move the price to the target and make the Fund’s
                intervention unnecessary.
              </Trans>
            </div>
            <div className={styles.imageSecond}>
              <img alt="Trader Incentives" src={trade} />
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
            <Trans i18nKey="how_it_works_v2.read">
              Read a <a href="https://medium.com/obyte/using-multi-dimensional-bonding-curves-to-create-stablecoins-81e857b4355c" target="_blank" rel="noopener">more thorough introduction to bonded stablecoins</a> in our blog and <a href="https://blog.obyte.org/bonded-stablecoins-version-2-better-price-stability-and-stakable-tokens-ca8c900552ab" target="_blank" rel="noopener">updates introduced in version 2 stablecoins</a>.
            </Trans>
          </div>
        </div>
      </div>
    </div>
  );
};
