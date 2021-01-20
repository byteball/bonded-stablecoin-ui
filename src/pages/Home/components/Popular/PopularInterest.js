import React from "react";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import { Col, Row } from "antd";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

import usd from "./img/interest/usd.svg";
import gbyte from "./img/interest/gbyte.svg";
import btc from "./img/interest/btc.svg";
import eth from "./img/interest/eth.svg";
import gold from "./img/interest/gold.svg";
import styles from "./Popular.module.css";
import config from "config";

export const tokensList = [
  {
    name: "IUSD",
    address: config.TESTNET ? "7FSSFG2Y5QHQTKVRFB3VWL6UNX3WB36O" : "26XAPPPTTYRIOSYNCUV3NS2H57X5LZLJ",
    logo: usd,
    pegged: "USD",
    apy: 16
  },
  {
    name: "IBIT",
    address: config.TESTNET ? "YMH724SHU7D6ZM4DMSP5RHQYB7OII2QQ" : "Z7GNZCFDEWFKYOO6OIAZN7GH7DEKDHKA",
    logo: btc,
    pegged: "BTC",
    apy: 11
  },
  {
    name: "ITH",
    address: config.TESTNET ? "2M5WRWDNWWMQ6BTCYNIC5G5UPW23TECO" : "HXFNVF4ENNIEJZHS2MQLG4AKQ4SAXUNH",
    logo: eth,
    pegged: "ETH",
    apy: 64
  },
  {
    name: "IGB",
    address: config.TESTNET ? "UH6SNZMZKHWMRM7IQZGFPD5PQULZZSBI" : "UH6SNZMZKHWMRM7IQZGFPD5PQULZZSBI",
    logo: gbyte,
    pegged: "GBYTE",
    apy: 16
  },
  {
    name: "IAU",
    address: config.TESTNET ? "VE63FHFCPXLLXK6G6HXQDO5DVLS2IDOC" : "UCWEMOXEYFUDDBJLHIHZ3NIAX3QD2YFD",
    logo: gold,
    pegged: "GOLD",
    apy: 8
  }
]

const PopularItem = ({ pegged, name, apy, logo, link, price }) => {
  const { t } = useTranslation();
  return (
    <Col xs={{ span: 12 }} sm={{ span: 6 }} lg={{ span: 4 }} className={styles.item}>
      <div>
        <img src={logo} alt={name} width="80" height="80" />
      </div>
      <div className={styles.name}>{name}</div>
      <div>{t("home.popular.pegged", "Pegged:")} <span>{pegged}</span></div>
      <div>APY: <b style={{ color: "green" }}>{apy}%</b></div>
      <div>{t("home.popular.price", "Price:")} $<b>{Number(price).toFixed(2)}</b></div>
      <div>
        <Link to={link} onClick={() => ReactGA.event({
          category: "Stablecoin",
          action: "Popular: Click to buy button",
          label: name
        })} className={styles.btnOpen}>{t("home.popular.buy", "buy")}</Link>
      </div>
    </Col>
  )
}

export const PopularInterest = ({ prices }) => {
  const { lang } = useSelector((state) => state.settings);
  const { t } = useTranslation();
  const basename = lang && lang !== "en" ? "/" + lang : "";

  return <div className={styles.wrap}>
    <h2 className={styles.title}>{t("home.popular.title_interest", "Most popular interest bearing tokens")}</h2>
    <Row justify="center" gutter={[16, 16]}>
      {tokensList.map((item, index) => <PopularItem
        key={item.name + index}
        index={index}
        name={item.name}
        apy={item.apy}
        price={prices[item.pegged] || 0}
        pegged={item.pegged}
        logo={item.logo}
        address={item.address}
        link={`${basename}/buy/${item.address}`}
      />)}
    </Row>
  </div>
}