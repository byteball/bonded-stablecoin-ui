import React from "react";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import { Col, Row } from "antd";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

import usd from "./img/growth/usd.svg";
import gbyte from "./img/growth/gbyte.svg";
import btc from "./img/growth/btc.svg";
import eth from "./img/growth/eth.svg";
import gold from "./img/growth/gold.svg";
import styles from "./Popular.module.css";
import config from "config";

const PopularItem = ({ pegged, name, price, logo, link }) => {
  const { t } = useTranslation();
  return (
    <Col xs={{ span: 12 }} sm={{ span: 6 }} lg={{ span: 4 }} className={styles.item}>
      <div>
        <img src={logo} alt={name} width="80" height="80" />
      </div>
      <div className={styles.name}>{name}</div>
      <div>{t("home.popular.pegged", "Pegged:")} <span>{pegged}</span></div>
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

export const PopularGrowth = ({ prices }) => {
  const { lang } = useSelector((state) => state.settings);
  const basename = lang && lang !== "en" ? "/" + lang : "";
  const { t } = useTranslation();

  const tokensList = [
    {
      name: "GRD",
      address: config.TESTNET ? "7FSSFG2Y5QHQTKVRFB3VWL6UNX3WB36O" : "26XAPPPTTYRIOSYNCUV3NS2H57X5LZLJ",
      logo: usd,
      pegged: "USD",
      price: 0
    },
    {
      name: "GRB",
      address: config.TESTNET ? "YMH724SHU7D6ZM4DMSP5RHQYB7OII2QQ" : "Z7GNZCFDEWFKYOO6OIAZN7GH7DEKDHKA",
      logo: btc,
      pegged: "BTC",
      price: 0
    },
    {
      name: "GRETH",
      address: config.TESTNET ? "2M5WRWDNWWMQ6BTCYNIC5G5UPW23TECO" : "HXFNVF4ENNIEJZHS2MQLG4AKQ4SAXUNH",
      logo: eth,
      pegged: "ETH",
      price: 0
    },
    {
      name: "GRGB",
      address: config.TESTNET ? "UH6SNZMZKHWMRM7IQZGFPD5PQULZZSBI" : "UH6SNZMZKHWMRM7IQZGFPD5PQULZZSBI",
      logo: gbyte,
      pegged: "GBYTE",
      price: 0
    },
    {
      name: "GRAU",
      address: config.TESTNET ? "VE63FHFCPXLLXK6G6HXQDO5DVLS2IDOC" : "UCWEMOXEYFUDDBJLHIHZ3NIAX3QD2YFD",
      logo: gold,
      pegged: "GOLD",
      price: 0
    }
  ];

  return <div className={styles.wrap}>
    <h2 className={styles.title}>{t("home.popular.title_growth", "Most popular growth tokens")}</h2>
    <Row justify="center" gutter={[16, 16]}>
      {tokensList.map((item, index) => <PopularItem
        key={item.name + index}
        index={index}
        name={item.name}
        price={prices[item.pegged] || 0}
        pegged={item.pegged}
        logo={item.logo}
        address={item.address}
        link={`${basename}/trade/${item.address}/buy-redeem`}
      />)}
    </Row>
  </div>
}