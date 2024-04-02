import React from "react";
import { Collapse, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Trans, useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet";

import styles from "./FaqPage.module.css";

const { Panel } = Collapse;
const { Title } = Typography;
export const FaqPage = () => {
  const { t } = useTranslation();

  return (
    <div className="faq">
      <Helmet title="Bonded stablecoins - F.A.Q." />
      <Title level={1}>F.A.Q.</Title>
      <Collapse
        accordion
        expandIconPosition="right"
        bordered={false}
        className={styles.collapse}
        expandIcon={({ isActive }) => (
          <DownOutlined rotate={isActive ? 180 : 0} className={styles.icon} />
        )}
      >
        <Panel
          header={t("faq.questions.0.question", "How do I buy/sell IUSD, OUSD, or SFUSD?")}
          key="0"
          className={styles.panel}
        >
          <Trans i18nKey="faq.questions.0.answer">
            <p>
              You can buy or sell the tokens for GBYTE on the <a href="/">home page</a>, on the more advanced <a href="/trade">trading page</a>, or buy IUSD for BTC on the <a href="/buy">Buy with Bitcoin page</a> of this website. The website helps
              you to construct a request that you send to an <a href="https://obyte.org/platform/autonomous-agents" target="_blank" rel="noopener">Autonomous Agent</a> from
              your <a href="https://obyte.org/" target="_blank" rel="noopener">Obyte</a> wallet.
            </p>
            <p>
              Some exchanges might also list the tokens to enable you to buy/sell
              them for BTC or fiat.
            </p>
          </Trans>
        </Panel>

        <Panel
          header={t("faq.questions.3.question", "Who operates the minting of all these tokens?")}
          key="3"
          className={styles.panel}
        >
          <Trans i18nKey="faq.questions.3.answer">
            <p>
              A bunch of soulless agents. They are called <a href="https://obyte.org/platform/autonomous-agents" target="_blank" rel="noopener">Autonomous Agents</a> (AAs). They
              are truly autonomous meaning that nobody can interfere with their
              work.
            </p>
          </Trans>
        </Panel>

        <Panel
          header={t("faq.questions.4.question", "Are AAs smart contracts?")}
          key="4"
          className={styles.panel}
        >
          <Trans i18nKey="faq.questions.4.answer">
            <p>
              No, they are not <a href="https://obyte.org/platform/smart-contracts" target="_blank" rel="noopener">smart contracts</a>. They are neither smart, nor
              contracts, they are dumb programs that blindly follow the immutable
              rules.
            </p>
          </Trans>
        </Panel>

        <Panel
          header={t("faq.questions.5.question", "IUSD constantly grows thanks to interest. Assuming this attracts new users, SFUSD should grow too and both token holders win, who loses then?")}
          key="5"
          className={styles.panel}
        >
          <Trans i18nKey="faq.questions.5.answer">
            <p>
              It’s not zero-sum (assuming the peg holds). In the bonding curve that is used to issue the
              tokens, the total value of the tokens is greater than the value of
              the reserve that was initially invested to create them. So, yes, it
              is possible for each group to win in terms of the value of their
              assets while the system grows, and not at the expense of the other group.
            </p>
          </Trans>
        </Panel>

        <Panel
          header={t("faq.questions.6.question", "Does this system run on a blockchain?")}
          key="6"
          className={styles.panel}
        >
          <Trans i18nKey="faq.questions.6.answer">
            <p>
              No. It runs on a DAG (Directed Acyclic Graph) based distributed
              ledger.
            </p>
            <p>
              A blockchain would be significantly less suitable for a stablecoin
              like this because blockchains have blocks and miners. Miners would
              be able to manipulate the order of transactions within a block in
              order to place their own transaction before yours so that you
              receive a worse price when buying from a bonding curve or selling to
              it. Even non-miners can affect the order of transactions within a
              block by offering a slightly higher fee to a miner (which works like
              a bribe). This could expose users to significant uncertainty, risks,
              and losses.
            </p>
            <p>
              Bonded stablecoins run on <a href="https://obyte.org/" target="_blank" rel="noopener">Obyte</a> — a blockless minerless DAG
              ledger. In a DAG these tricks don’t work. There are no miners, no
              blocks, the positions of transactions in the DAG cannot be changed
              by anybody, and it is impossible for any single actor to manipulate
              the order of transactions.
            </p>
          </Trans>
        </Panel>

        <Panel
          header={t("faq.questions.7.question", "What makes stablecoins pegged to their benchmark?")}
          key="7"
          className={styles.panel}
        >
          <Trans i18nKey="faq.questions.7.answer">
            <p>
              The price of IUSD is “attracted” to the target (benchmark) with the
              help of a so-called capacitor.
            </p>
            <p>
              Every purchase of IUSD from the bonding curve and every sale
              to the bonding curve affect the IUSD price. If a transaction pushes
              the price away from the target, it is “punished” with a fee, the
              farther away from the target, the more the fee. The collected fees
              get accumulated in a capacitor. Every transaction that corrects the
              price back to the target, is rewarded using the funds accumulated in
              the capacitor.
            </p>
            <p>
              Also, the stability fund buys or sells the other token — GRDV2 — in order to correct the price back to the peg. When and how much the fund buys or sells, is determined by an algorithm that can be changed only by governance decision of SFUSD holders.
            </p>
            <p>
              In addition to that, traders who anticipate that the fund would eventually correct the price, can profit from buying or selling IUSD before the fund intervenes. Their trades move the price closer to the peg and might make the fund's intervention unnecessary.
            </p>
            <p>
              Read the <a href="https://blog.obyte.org/using-multi-dimensional-bonding-curves-to-create-stablecoins-81e857b4355c" target="_blank" rel="noopener">blog article introducing bonded stablecoins</a> and <a href="https://blog.obyte.org/bonded-stablecoins-version-2-better-price-stability-and-stakable-tokens-ca8c900552ab" target="_blank" rel="noopener">updates introduced in version 2 stablecoins</a> for more
              details.
            </p>
          </Trans>
        </Panel>

        <Panel header={t("faq.questions.8.question", "What are the risks?")} key="8" className={styles.panel}>
          <Trans i18nKey="faq.questions.8.answer">
            <p>
              This is new unproven technology and might not work as expected.
              Although we did our best to avoid errors while implementing the
              system and to analyze the incentives of different user groups, both
              technical bugs and wrong conclusions about user behavior in some
              circumstances cannot be excluded. Nothing like this has been done
              before and we unfortunately couldn’t gain much from the experience
              of the predecessors.
            </p>
          </Trans>
        </Panel>

        <Panel
          header={t("faq.questions.9.question", "How are bonded stablecoins different from DAI, USDT, USDC, etc?")}
          key="9"
          className={styles.panel}
        >
          <Trans i18nKey="faq.questions.9.answer">
            <p>
              One can earn interest with bonded stablecoins. When OUSD stablecoins are not used, one can "stake" them by converting to IUSD whose target price constantly grows. After some time, one can convert IUSD back to OUSD and get more OUSD in exchange, which reflects the interest earned while OUSD was staked.
             </p>
          </Trans>
        </Panel>

        <Panel
          header={t("faq.questions.10.question", "How do bonded stablecoins compare against discount stablecoins?")}
          key="10"
          className={styles.panel}
        >
          <Trans i18nKey="faq.questions.10.answer">
            <p>
              Bonded stablecoins is our next generation stablecoin design and it
              improves above <a href="https://discount.ostable.org" target="_blank" rel="noopener">discount stablecoins</a> in virtually all
              dimensions. In particular:
            </p>
            <ul>
              <li>
                - bonded stablecoins do not expire any more, they are perpetual.
              </li>
              <li>
                - OUSD is truly stable, there is no appreciation, it targets the
                familiar and well-established unit of account, USD.
              </li>
              <li>
                - there are no auctions any more and users don’t need to look
                after their loans and refill collateral or risk losing their
                collateral when its price falls abruptly.
              </li>
              <li>
                - there is no overcollateralization any more, which was commonly
                misunderstood.
              </li>
              <li>
                - there is no need to balance risks against the amount of capital
                wasted in excess collateral.
              </li>
            </ul>
          </Trans>
        </Panel>

        <Panel
          header={t("faq.questions.11.question", "Can I trade with leverage?")}
          key="11"
          className={styles.panel}
        >
          <Trans i18nKey="faq.questions.11.answer">
            <p>
              Yes. You’ll need to create a leveraged stablecoin or use one that
              somebody else has already created.
            </p>
            <p>
              A leveraged stablecoin is a synthetic coin that tracks the price of
              an asset to the power of 2 (for 2x leverage), 3 (for 3x leverage),
              -1 (for a short position), -2 (for a 2x leveraged short position),
              and so on.
            </p>
            <p>
              For example, while Brent Crude is worth $40, a 2x leverage
              stablecoin BRENT2/USD is worth 1600. If Brent goes up 25% to $50,
              BRENT2/USD goes up to 2500 — a 56.25% gain.
            </p>
            <p>
              It might seem unusual to call such coins “stablecoins” but they are
              stable relative to an artificial “price” such as Brent squared.
              Everything is relative after all, including stability.
            </p>
            <p>
              When you{" "}
              <a href="create">
                create a new stablecoin
              </a>
              , you need to specify the desired leverage parameter. It is 0 by
              default which for GBYTE/USD price feed means track USD price.
              Leverage 1 would mean plain long position in GBYTE (which is
              equivalent to just holding the reserve currency GBYTE), leverage 2
              would mean 2x leveraged position in GBYTE vs USD, leverage 3 —
              3x long position in GBYTE, leverage -1 — short position in
              GBYTE, and so on.
            </p>
            <p>
              Note that with this kind of leverage, you can’t be margin called and
              liquidated.
            </p>
            <p>For details, see <a href="https://blog.obyte.org/using-multi-dimensional-bonding-curves-to-create-stablecoins-81e857b4355c" target="_blank" rel="noopener">
                our blog introducing bonded stablecoins
              </a>{" "}
              .
            </p>
          </Trans>
        </Panel>

        <Panel
          header={t("faq.questions.12.question", "I want to trade a stablecoin pegged to asset X but it doesn’t exist")}
          key="12"
          className={styles.panel}
        >
          <Trans i18nKey="faq.questions.12.answer">
            <p>
              If an oracle that posts the price of X already exists, you 
              can <a href="create">create the corresponding stablecoin</a> right away!
            </p>
            <p>
              If there is no such oracle yet - create the oracle. You have to be a
              developer though. There are sources of <a href="https://github.com/byteball/oracle-example" target="_blank" rel="noopener">example oracle</a> to help you get started. If you are not a developer and cannot hire one, signal your demand 
              in <a href="https://discord.obyte.org/" target="_blank" rel="noopener">
                Obyte discord
              </a>.
            </p>
          </Trans>
        </Panel>

        <Panel
          header={t("faq.questions.13.question", "What is the Stability Fund and Decision Engine?")}
          key="13"
          className={styles.panel}
        >
          <Trans i18nKey="faq.questions.13.answer">
            <p>In v2 stablecoins, they are used to automatically keep the price near the peg as much as possible. </p>
            <p>The Decision Engine (DE) is an Autonomous Agent that uses the funds in the Stability Fund to correct the price by buying or selling growth tokens. The Stability Fund is another AA that just holds all growth tokens and assets in the reserve currency contributed by investors. The investors get shares of the fund in exchange.</p>
            <p>Since the fund holds growth tokens as part of its assets, and they appreciate as more interest (stable+) tokens are issued, buying shares of the fund is a way to bet on growth of the companion stablecoin.</p>
            <p>The DE can be replaced by governance to optimize its behavior to both better keep the peg and generate greater shareholder value.</p>
          </Trans>
        </Panel>

        <Panel
          header={t("faq.questions.14.question", "Can OUSD be staked?")}
          key="14"
          className={styles.panel}
        >
          <Trans i18nKey="faq.questions.14.answer">
            <p>Yes, just convert it to IUSD. Any time later, you can sell IUSD back to OUSD and get more OUSD.</p>
          </Trans>
        </Panel>
      </Collapse>
      <div className={styles.action}>
        <Trans i18nKey="faq.action">
          Any other questions? Read the 
          <a 
          href="https://blog.obyte.org/using-multi-dimensional-bonding-curves-to-create-stablecoins-81e857b4355c"
          target="_blank" rel="noopener"> introductory article </a> or ask on <a href="https://discord.obyte.org/" target="_blank">Discord</a>.
        </Trans>
      </div>
    </div>
  );
};
