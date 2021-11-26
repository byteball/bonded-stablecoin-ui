import React from "react";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import { Col, Row } from "antd";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import CoinIcon from "stablecoin-icons";

import styles from "./Popular.module.css";
import config from "config";

const PopularItem = ({ pegged, name, price, logo, link }) => {
  const { t } = useTranslation();
  return (
    <Col xs={{ span: 12 }} sm={{ span: 6 }} lg={{ span: 4 }} className={styles.item}>
      <div>
        <CoinIcon pegged={pegged} width="80" height="80" type={3} />
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

export const PopularStable = ({ prices }) => {
  const { lang } = useSelector((state) => state.settings);
  const { t } = useTranslation();
  const basename = lang && lang !== "en" ? "/" + lang : "";

  const tokensList = [
    {
      name: "OUSDV2",
      address: config.TESTNET ? "2SEBEEDTEC7LTDVZ765MGQXJW33GSRUD" : "VLKI3XMMX5YULOBA6ZXBXDPI6TXF6V3D",
      pegged: "USD",
      price: 1
    },
    {
      name: "OBIT",
      address: config.TESTNET ? "RWTVFCMFLI3N2G4P2YENMLKC6CY7IYT6" : "KSBNS2R5HUBN5AHYJLZVCADEQAHOLRCD",
      pegged: "BTC",
      price: 0
    },
    {
      name: "OETH",
      address: config.TESTNET ? "DM6R6EMQPUX5C4BC7XU62KEMHE4J6IFF" : "MMN3JBJWTT7ZZL7I7K66GSZQ3MHTPW47",
      pegged: "ETH",
      price: 0
    },
    {
      name: "OGBV2",
      address: config.TESTNET ? "KPIRFOCMNT3OPG4EIO7CAWNDEEDAR62F" : "TGEKFP4PFQT43CGUNZSM4GHRMNBWPAVE",
      pegged: "GBYTE",
      price: 0
    },
    {
      name: "OAUG",
      address: config.TESTNET ? "QRNUJJ6GYRXBGZXO3KCIS3CGEAMN5FA7" : "L5AZ5Q6BY5DKFL4CDMF5P6EWZ7I5KBYC",
      pegged: "GOLD",
      price: 0
    }
  ];

  return <div className={styles.wrap}>
    <h2 className={styles.title}>{t("home.popular.title_stable", "Most popular stable tokens")}</h2>
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