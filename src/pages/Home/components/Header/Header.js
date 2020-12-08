import React from "react";
import ReactGA from "react-ga";
import styles from "./Header.module.css";
import { Select } from "antd";
import { Trans, useTranslation } from 'react-i18next';
import { InterestToken } from "./components/InterestToken";
import { StableToken } from "./components/StableToken";
import { GrowthToken } from "./components/GrowthToken";
import config from "config";
import { Link } from "react-router-dom";

const { Option } = Select;
const { pegged } = config;

export const Header = ({ type, setType }) => {
  const { t } = useTranslation();
  const peggedList = Object.keys(pegged);
  const otherList = peggedList.filter((p) => p !== type && ['USD', 'BTC', 'GOLD'].includes(p));
  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>{t("home.header.title", "Bonded stablecoins")}</h1>
          <h2 className={styles.subTitle}>{t("home.header.desc", "The most advanced stablecoins powered by bonding curves")}</h2>
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
                {t("home.header.stable.for", "For use in commerce and trading.")}
              </div>
              <div>
                {t("home.header.stable.info", "{{name}}: Stablecoin whose value is 1 {{target}}.", {name: pegged[type].target || type, target: pegged[type].stableName})}
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
                {t("home.header.interest.for", "For investors seeking predictable income.")}
              </div>
              <div>
                {t("home.header.interest.info", "{{name}} Interest token that earns {{percent}}% interest in {{type}} — a stable+ coin.", {name: pegged[type].interestName, percent: pegged[type].percent, type})}
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
                {t("home.header.growth.for", "For investors seeking higher income, with higher risks.")}
              </div>
              <div>
              {t("home.header.growth.info", "{{growthName}}: Growth token whose value is tied to the amount of {{interestName}} issued.", {growthName: pegged[type].growthName, interestName: pegged[type].interestName})}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.action}>
          <Trans i18nKey={"home.header.need_similar_coins"} other={otherList.join(", ")}>
          Need similar coins pegged to {{other: otherList.join(", ")}} or some other
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
          </Trans>
        </div>
      </header>
    </>
  );
};
