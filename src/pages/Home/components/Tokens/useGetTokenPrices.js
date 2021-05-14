import config from "../../../../config";
import { useEffect, useState } from "react";
import axios from "axios";
import socket from "services/socket";
import { tokensList } from "pages/Home/components/Popular/PopularInterest";
import { botCheck } from "utils/botCheck";
import { $get_growth_factor } from "helpers/bonded.js";

export const useGetTokenPrices = (list, data, balances) => {
  const [interest, setInterest] = useState({});
  const [stable, setStable] = useState({});
  const [fund, setFund] = useState({});

  let info = {};
  list && data && tokensList.forEach((item) => {
    info = {
      ...info, [item.pegged]: {
        bonded_state: item.address in data ? data[item.address] : {},
        fund_state: list[item.address].fund in data ? data[list[item.address].fund] : {},
        fund_balance: list[item.address].fund in balances ? balances[list[item.address].fund] : {},
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

      const now = Date.now() / 1000;

      for (const pegged in info) {
        const { params, bonded_state, fund_state, fund_balance } = info[pegged];
        const shares_supply = fund_state.shares_supply || 0;

        const s1 = bonded_state.supply1 / 10 ** params.decimals1;
        const s2 = bonded_state.supply2 / 10 ** params.decimals2;

        const p1 = params.m * s1 ** (params.m - 1) * s2 ** params.n;
        const t1Balance = fund_balance?.[bonded_state.asset1] || 0;
        const reserveBalance = fund_balance?.[params.reserve_asset] || 0;
        const balance = reserveBalance + p1 * 10 ** (params.reserve_asset_decimals - params.decimals1) * (t1Balance);
        const share_price = shares_supply ? balance / shares_supply : 1;

        const reserveAsset = config.reserves[info[pegged].params.reserve_asset] || null;

        const growth_factor = $get_growth_factor (
          bonded_state.interest_rate || params.interest_rate,
          now,
          bonded_state.rate_update_ts,
          bonded_state.growth_factor
        );

        info[pegged].p3InReserve = info[pegged].bonded_state.p2 / growth_factor;
        info[pegged].p2InReserve = info[pegged].bonded_state.p2;
        info[pegged].pFundInReserve = share_price;
        info[pegged].reserve = reserveAsset ? reserveAsset.name : info[pegged].params.reserve_asset;
      }

      const newInterest = {};
      const newStable = {};
      const newFund = {};

      for (const pegged in info) {
        if (info[pegged].reserve === "GBYTE") {
          newFund[pegged] = info[pegged].pFundInReserve * GBYTE_USD;
          newInterest[pegged] = info[pegged].p2InReserve * GBYTE_USD;
          newStable[pegged] = info[pegged].p3InReserve * GBYTE_USD;
        } else if (info[pegged].reserve === "OBIT") {
          newFund[pegged] = info[pegged].pFundInReserve * BTC_USD;
          newInterest[pegged] = info[pegged].p2InReserve * BTC_USD;
          newStable[pegged] = (1 / info[pegged].p3InReserve) * BTC_USD;
        }
      }

      setInterest(newInterest);
      setStable(newStable);
      setFund(newFund);
    })();
  }, [])
  return [interest, stable, fund]
}