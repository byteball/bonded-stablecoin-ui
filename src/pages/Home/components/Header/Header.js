import React from "react";
import ReactGA from "react-ga";
import styles from "./Header.module.css";
import { Select } from "antd";
import { InterestToken } from "./components/InterestToken";
import { StableToken } from "./components/StableToken";
import { GrowthToken } from "./components/GrowthToken";
import config from "config";
import { Link } from "react-router-dom";

const { Option } = Select;
const { pegged } = config;

export const Header = ({ type, setType }) => {
  const peggedList = Object.keys(pegged);
  const otherList = peggedList.filter((p) => p !== type && ['USD', 'BTC', 'GOLD'].includes(p));
  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>Bonded stablecoins</h1>
          <h2 className={styles.subTitle}>The most advanced stablecoins powered by bonding curves</h2>
        </div>
        <div style={{ marginBottom: 40 }}>
          <div className={styles.tokenItem}>
            <div className={styles.tokenItemGraph}>
              <Link to={pegged[type].nonGbyteReserve ? `/trade/${pegged[type].address}` : `/buy/${pegged[type].address}`}
                onClick={() => ReactGA.event({
                  category: "Stablecoin",
                  action: "Click to stable graph",
                  label: pegged[type].stableName
                })}>
                <StableToken name={pegged[type].stableName} />
              </Link>
            </div>
            <div className={styles.tokenItemTitle}>
              <div className={styles.tokenItemSubTitle}>
                For use in commerce and trading.
              </div>
              <div>
                {pegged[type].stableName}: Stablecoin whose value is 1 {pegged[type].target || type}.
              </div>
            </div>
          </div>
        </div>

        {pegged[type].percent && <div style={{ marginBottom: 40 }}>
          <div className={styles.tokenItem}>
            <div className={styles.tokenItemGraph}>
              <Link to={`/buy/${pegged[type].address}`}
                onClick={() => ReactGA.event({
                  category: "Stablecoin",
                  action: "Click to interest graph",
                  label: pegged[type].interestName
                })}>
                <InterestToken name={pegged[type].interestName} />
              </Link>
            </div>
            <div className={styles.tokenItemTitle}>
              <div className={styles.tokenItemSubTitle}>
                For investors seeking predictable income.
              </div>
              <div>
                {pegged[type].interestName}: Interest token that earns{" "}
                {pegged[type].percent}% interest in {type} &mdash; a stable+
                coin.
              </div>
            </div>
          </div>
        </div>}

        <div style={{ marginBottom: 40 }}>
          <div className={styles.tokenItem}>
            <div className={styles.tokenItemGraph}>
              <Link to={`/trade/${pegged[type].address}`}
                onClick={() => ReactGA.event({
                  category: "Stablecoin",
                  action: "Click to growth graph",
                  label: pegged[type].growthName
                })}>
                <GrowthToken name={pegged[type].growthName} />
              </Link>
            </div>
            <div className={styles.tokenItemTitle}>
              <div className={styles.tokenItemSubTitle}>
                For investors seeking higher income, with higher risks.
              </div>
              <div>
                {pegged[type].growthName}: Growth token whose value is tied to the
                amount of {pegged[type].interestName} issued.
              </div>
            </div>
          </div>
        </div>
        <div className={styles.action}>
          Need similar coins pegged to {otherList.join(", ")} or some other
          asset? <br />
          Select yours:{" "}
          <Select
            style={{ width: 100 }}
            dropdownMatchSelectWidth={false}
            value={type}
            onChange={(value) => setType(value)}
          >
            {peggedList.map((p) => (
              <Option key={p} value={p}>
                {p}
              </Option>
            ))}
          </Select>{" "}
          or{" "}
          <a href="/create">
            create new ones
          </a>
          .
        </div>
      </header>
    </>
  );
};
