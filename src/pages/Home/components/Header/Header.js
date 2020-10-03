import React from "react";
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
  const otherList = peggedList.filter((p) => p !== type);
  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>Bonded stablecoins</h1>
          <h2 className={styles.subTitle}>Choose your crypto:</h2>
        </div>
        <div style={{ marginBottom: 40 }}>
          <div className={styles.tokenItem}>
            <div className={styles.tokenItemGraph}>
              <Link to={`/trade/${pegged[type].address}`}>
                <StableToken name={pegged[type].stableName} />
              </Link>
            </div>
            <div className={styles.tokenItemTitle}>
              {pegged[type].stableName}: Stablecoin whose value is 1 {type}.
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <div className={styles.tokenItem}>
            <div className={styles.tokenItemGraph}>
              <Link to={`/trade/${pegged[type].address}`}>
                <InterestToken name={pegged[type].interestName} />
              </Link>
            </div>
            <div className={styles.tokenItemTitle}>
              <div>
                {pegged[type].interestName}: Interest token that earns{" "}
                {pegged[type].percent}% interest in {type} &mdash; a stable+
                coin.
              </div>
              <div className={styles.tokenItemSubTitle}>
                You can also buy {pegged[type].interestName} and redirect
                interest to a charity.
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <div className={styles.tokenItem}>
            <div className={styles.tokenItemGraph}>
              <Link to={`/trade/${pegged[type].address}`}>
                <GrowthToken name={pegged[type].growthName} />
              </Link>
            </div>
            <div className={styles.tokenItemTitle}>
              {pegged[type].growthName}: Growth token whose value is tied to the
              amount of {pegged[type].interestName} issued.
            </div>
          </div>
        </div>
        <div className={styles.action}>
          Need similar coins pegged to {otherList.join(", ")} or some other
          asset? <br />
          Select yours:{" "}
          <Select
            style={{ width: 100 }}
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
