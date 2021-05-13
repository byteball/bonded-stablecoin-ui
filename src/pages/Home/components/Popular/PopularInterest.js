import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import { Col, Row } from "antd";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import CoinIcon from "stablecoin-icons";

import styles from "./Popular.module.css";
import config from "config";

export const tokensList = [
  {
    name: "IUSDV2",
    address: config.TESTNET ? "2SEBEEDTEC7LTDVZ765MGQXJW33GSRUD" : "VLKI3XMMX5YULOBA6ZXBXDPI6TXF6V3D",
    pegged: "USD",
  },
  {
    name: "IBITV2",
    address: config.TESTNET ? "RWTVFCMFLI3N2G4P2YENMLKC6CY7IYT6" : "KSBNS2R5HUBN5AHYJLZVCADEQAHOLRCD",
    pegged: "BTC",
  },
  {
    name: "ITHV2",
    address: config.TESTNET ? "DM6R6EMQPUX5C4BC7XU62KEMHE4J6IFF" : "MMN3JBJWTT7ZZL7I7K66GSZQ3MHTPW47",
    pegged: "ETH",
  },
  {
    name: "IGBV2",
    address: config.TESTNET ? "KPIRFOCMNT3OPG4EIO7CAWNDEEDAR62F" : "TGEKFP4PFQT43CGUNZSM4GHRMNBWPAVE",
    pegged: "GBYTE",
  },
  {
    name: "IAUG",
    address: config.TESTNET ? "QRNUJJ6GYRXBGZXO3KCIS3CGEAMN5FA7" : "L5AZ5Q6BY5DKFL4CDMF5P6EWZ7I5KBYC",
    pegged: "GOLD",
    price: 0
  }
]

const PopularItem = ({ pegged, name, apy, link, price, showAll }) => {
  const { t } = useTranslation();
  return (
    <Col xs={{ span: 12 }} sm={{ span: 6 }} lg={{ span: 4 }} className={styles.item}>
      <div>
        <CoinIcon pegged={pegged} width="80" height="80" type={2} />
      </div>
      <div className={styles.name}>{name}</div>
      {!showAll && pegged && <div>{t("home.popular.pegged", "Pegged:")} <span>{pegged}</span></div>}
      <div>APY: <b style={{ color: "green" }}>{+Number(apy).toFixed(2)}%</b></div>
      {!showAll && <div>{t("home.popular.price", "Price:")} $<b>{+Number(price).toFixed(2)}</b></div>}
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

export const PopularInterest = ({ prices, hideTitle = false, showAll = false }) => {
  const { lang } = useSelector((state) => state.settings);
  const { data } = useSelector((state) => state.list);
  const [otherList, setOtherList] = useState([]);
  const { t } = useTranslation();
  const basename = lang && lang !== "en" ? "/" + lang : "";

  const tokensListChanged = tokensList.map((item) => {
    const address = item.address;
    const apy = ("interest_rate" in data[address].bonded_state ? data[address].bonded_state.interest_rate : data[address].params.interest_rate) * 100;
    return {
      ...item,
      apy
    }
  });

  useEffect(() => {
    if (showAll) {
      const otherList = Object.entries(data).filter((item) => item[1].fund).map(([address, { bonded_state, symbol, params }]) => {
        const apy = ("interest_rate" in bonded_state ? bonded_state.interest_rate : params.interest_rate) * 100;

        if (tokensList.findIndex((t) => symbol && (t.name === symbol)) === -1) {
          if (apy) {
            return {
              name: symbol,
              address,
              apy
            }
          }
        }
        return null
      });

      setOtherList(otherList.filter((t) => t && t.name))

      return () => {
        setOtherList([]);
      }
    }
  }, [data, showAll]);

  const allList = [...tokensListChanged, ...otherList];

  return <div className={styles.wrap}>
    {!hideTitle ? <h2 className={styles.title}>{t("home.popular.title_interest", "Most popular interest bearing tokens")}</h2> : null}
    <Row justify="center" gutter={[16, 16]}>
      {allList.map((item, index) => <PopularItem
        key={item.name + index}
        index={index}
        name={item.name}
        apy={item.apy}
        price={prices[item.pegged] || 0}
        pegged={item.pegged}
        address={item.address}
        link={`${basename}/buy/${item.address}`}
        showAll={showAll}
      />)}
    </Row>
  </div>
}