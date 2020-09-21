import React, { useEffect } from "react";
import { Collapse, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import styles from "./FaqPage.module.css";

const { Panel } = Collapse;
const { Title } = Typography;
export const FaqPage = () => {
  useEffect(() => {
    document.title = "Bonded stablecoins - F.A.Q.";
  }, []);

  return (
    <div className="faq">
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
          header="How do I buy/sell IUSD or GRD?"
          key="1"
          className={styles.panel}
        >
          <p>
            You can buy the tokens for GBYTE on this website. The website helps
            you to construct a request that you send to an Autonomous Agent from
            your Obyte wallet.
          </p>
          <p>
            Some exchanges might also list the tokens to enable you to buy/sell
            them for BTC or fiat.
          </p>
        </Panel>

        <Panel
          header="How do I buy/sell OUSD?"
          key="2"
          className={styles.panel}
        >
          <p>
            You can buy IUSD first, then open a deposit to receive the
            equivalent amount of OUSD. While the deposit is open, you can also
            periodically withdraw the accrued interest (14% p.a.) or choose a
            charity or your friend or relative who will receive the interest.
            When you don’t need OUSD any more, you can close the deposit,
            receive your IUSD back, then sell IUSD.
          </p>
          <p>
            Some exchanges might also list OUSD to enable you to buy/sell the
            token for BTC or fiat.
          </p>
        </Panel>

        <Panel
          header="Who operates the minting of all these tokens?"
          key="3"
          className={styles.panel}
        >
          <p>
            A bunch of soulless agents. They are called Autonomous Agents. They
            are truly autonomous meaning that nobody can interfere with their
            work.
          </p>
        </Panel>

        <Panel
          header="Are AAs smart contracts?"
          key="4"
          className={styles.panel}
        >
          <p>
            No, they are not smart contracts. They are neither smart, nor
            contracts, they are dumb programs that blindly follow the immutable
            rules.
          </p>
        </Panel>

        <Panel
          header="IUSD constantly grows thanks to interest. Assuming this attracts new users, GRD should grow too and both token holders win, who loses then?"
          key="5"
          className={styles.panel}
        >
          <p>
            It’s not zero-sum. In the bonding curve that is used to issue the
            tokens, the total value of the tokens is greater than the value of
            the reserve that was initially invested to create them. So, yes, it
            is possible for each group to win in terms of the value of their
            assets, and not at the expense of the other group.
          </p>
        </Panel>

        <Panel
          header="Does this system run on a blockchain?"
          key="6"
          className={styles.panel}
        >
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
            Bonded stablecoins run on Obyte &mdash; a blockless minerless DAG
            ledger. In a DAG these tricks don’t work. There are no miners, no
            blocks, the positions of transactions in the DAG cannot be changed
            by anybody, and it is impossible for any single actor to manipulate
            the order of transactions.
          </p>
        </Panel>

        <Panel
          header="What makes stablecoins pegged to their benchmark?"
          key="7"
          className={styles.panel}
        >
          <p>
            The price of IUSD is “attracted” to the target (benchmark) with the
            help of a so-called capacitor.
          </p>
          <p>
            Every purchase of IUSD or GRD from the bonding curve and every sale
            to the bonding curve affect the IUSD price. If a transaction pushes
            the price away from the target, it is “punished” with a fee, the
            farther away from the target, the more the fee. The collected fees
            get accumulated in a capacitor. Every transaction that corrects the
            price back to the target, is rewarded using the funds accumulated in
            the capacitor.
          </p>
          <p>
            Due to the type of the bonding curve chosen, it is the holders of
            GRD who are the first to react to any deviations of the price from
            the target and correct them. For example, when too many people buy
            IUSD, they pull the price of IUSD below the peg (because IUSD
            token’s power in the curve formula is ½, i.e. less than 1, hence its
            partial derivative has negative power). There are two ways to
            correct the deviation: sell IUSD back to the curve, which is not a
            good idea because its price is currently below the fair price; or
            buy more GRD tokens. By buying more GRD tokens, traders push GRD
            price up (because the power in the curve formula is 2, i.e. more
            than 1, hence its partial derivative has positive power), therefore
            one who buys earlier gets a better price and traders rush to be the
            first to buy while the price is still below equilibrium.
          </p>
          <p>
            Read the blog article introducing bonded stablecoins (link) for more
            details.
          </p>
        </Panel>

        <Panel header="What are the risks?" key="8" className={styles.panel}>
          <p>
            This is new unproven technology and might not work as expected.
            Although we did our best to avoid errors while implementing the
            system and to analyze the incentives of different user groups, both
            technical bugs and wrong conclusions about user behavior in some
            circumstances cannot be excluded. Nothing like this has been done
            before and we unfortunately couldn’t gain much from the experience
            of the predecessors.
          </p>
        </Panel>

        <Panel
          header="How are bonded stablecoins different from DAI, USDT, USDC, etc?"
          key="9"
          className={styles.panel}
        >
          <p>
            One can earn interest with bonded stablecoins. One can get IUSD,
            immediately put it on a deposit, get OUSD in exchange, use it for
            payments in a stable currency while interest payments accumulate,
            and withdraw interest from time to time.
          </p>
          <p>
            One can also redirect interest to a good cause, e.g. to a charity.
          </p>
        </Panel>

        <Panel
          header="How do bonded stablecoins compare against discount stablecoins?"
          key="10"
          className={styles.panel}
        >
          <p>
            Bonded stablecoins is our next generation stablecoin design and it
            improves above discount stablecoins (link) in virtually all
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
              misunderstoo.
            </li>
            <li>
              - there is no need to balance risks against the amount of capital
              wasted in excess collateral.
            </li>
          </ul>
        </Panel>

        <Panel
          header="Can I trade with leverage?"
          key="11"
          className={styles.panel}
        >
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
            BRENT2/USD goes up to 2500, i.e. 56.25% gain.
          </p>
          <p>
            It might seem unusual to call such coins “stablecoins” but they are
            stable relative to an artificial “price” such as Brent squared.
            Everything is relative after all, including stability.
          </p>
          <p>
            When you{" "}
            <a href="create" target="_blank" rel="noopener">
              create a new stablecoin
            </a>
            , you need to specify the desired leverage parameter. It is 0 by
            default which for GBYTE/USD price feed means track USD price.
            Leverage 1 would mean plain long position in GBYTE (which is
            equivalent to just holding the reserve currency GBYTE), leverage 2
            would mean 2x leveraged position in GBYTE vs USD, leverage 3 &mdash;
            3x long position in GBYTE, leverage -1 &mdash; short position in
            GBYTE, and so on.
          </p>
          <p>
            Note that with this kind of leverage, you can’t be margin called and
            liquidated. For details, see{" "}
            <a href="#" target="_blank" rel="noopener">
              our blog introducing bonded stablecoins
            </a>{" "}
            .
          </p>
        </Panel>

        <Panel
          header="I want to trade a stablecoin pegged to asset X but it doesn’t exist"
          key="12"
          className={styles.panel}
        >
          <p>
            If an oracle that posts the price of X already exists, you can
            create the{" "}
            <a href="create" target="_blank" rel="noopener">
              corresponding stablecoin
            </a>{" "}
            right away!
          </p>
          <p>
            If there is no such oracle yet — create the oracle. You have to be a
            developer though. There are sources of{" "}
            <a href="#" target="_blank" rel="noopener">
              {" "}
              example oracle{" "}
            </a>{" "}
            to help you get started. If you are not a developer and cannot hire
            one, signal your demand in{" "}
            <a href="http://discord.obyte.org/" target="_blank" rel="noopener">
              Obyte discord
            </a>
            .
          </p>
        </Panel>
      </Collapse>
      <div className={styles.action}>
        Any other questions? Read the{" "}
        <a href="#" target="_blank" rel="noopener">
          introductory article
        </a>{" "}
        or ask on{" "}
        <a href="https://discord.obyte.org/" target="_blank">
          discord
        </a>
        .
      </div>
    </div>
  );
};
