import config from "../../../../config";
import { useEffect, useState } from "react";
import axios from "axios";
import socket from "services/socket";
import { tokensList } from "pages/Home/components/Popular/PopularInterest";
import { getOraclePrice } from "helpers/getOraclePrice";
import { getOraclePriceForBot } from "helpers/getOraclePriceForBot";
import { botCheck } from "utils/botCheck";

export const useGetTokenPrices = (list) => {
  const [interest, setInterest] = useState({});
  const [stable, setStable] = useState({});
  const [growth, setGrowth] = useState({});

  let info = {};
  list && tokensList.forEach((item) => {
    info = {
      ...info, [item.pegged]: {
        stable_state: item.address in list ? list[item.address].stable_state : {},
        params: item.address in list ? list[item.address].params : {},
        address: item.address,
      }
    }
  });
  useEffect(() => {
    (async () => {
      const isBot = botCheck(navigator.userAgent);
      const GBYTE_USD = isBot ? await axios.get(config.BUFFER_URL + "/get_data_feed/" + config.RATE_ORACLE + "/GBYTE_USD").then(response => response.data.data)
        : await socket.api.getDataFeed({
          oracles: [config.RATE_ORACLE],
          feed_name: "GBYTE_USD",
          ifnone: "none",
        });

      const BTC_USD = isBot ? await axios.get(config.BUFFER_URL + "/get_data_feed/" + config.RATE_ORACLE + "/BTC_USD").then(response => response.data.data)
        : await socket.api.getDataFeed({
          oracles: [config.RATE_ORACLE],
          feed_name: "BTC_USD",
          ifnone: "none",
        });


      for (const pegged in info) {
        const { params, stable_state } = info[pegged];
        const s1 = stable_state.supply1 / 10 ** params.decimals1;
        const s2 = stable_state.supply2 / 10 ** params.decimals2;
        const oraclePrice = isBot ? await getOraclePriceForBot(info[pegged].stable_state, info[pegged].params) : await getOraclePrice(info[pegged].stable_state, info[pegged].params);
        const bPriceInversed = "oracles" in params ? params.oracles[0].op === "*" && !params.leverage : params.op1 === "*" && !params.leverage;

        info[pegged].p3InReserve = bPriceInversed ? 1 / oraclePrice : oraclePrice;
        info[pegged].p2InReserve = info[pegged].stable_state.p2;
        info[pegged].p1InReserve = params.m * s1 ** (params.m - 1) * s2 ** params.n * stable_state.dilution_factor;
        info[pegged].reserve = config.reserves[info[pegged].params.reserve_asset].name;
      }

      const newInterest = {};
      const newStable = {};
      const newGrowth = {};

      for (const pegged in info) {
        if (info[pegged].reserve === "GBYTE") {
          newGrowth[pegged] = info[pegged].p1InReserve * GBYTE_USD;
          newInterest[pegged] = info[pegged].p2InReserve * GBYTE_USD;
          newStable[pegged] = info[pegged].p3InReserve * GBYTE_USD;
        } else if (info[pegged].reserve === "OBIT") {
          newGrowth[pegged] = info[pegged].p1InReserve * BTC_USD;
          newInterest[pegged] = info[pegged].p2InReserve * BTC_USD;
          newStable[pegged] = (1 / info[pegged].p3InReserve) * BTC_USD;
        }
      }

      setInterest(newInterest);
      setStable(newStable);
      setGrowth(newGrowth);
    })();
  }, [])
  return [interest, stable, growth]
}