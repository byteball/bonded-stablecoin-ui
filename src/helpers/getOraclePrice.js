import socket from "services/socket";

import { getOraclePriceForBot } from "./getOraclePriceForBot";

export const getOraclePrice = async (
  bonded_state,
  params,
  showOracles = false
) => {
  let oracleValue1, oracleValue2, oracleValue3;

  if (!socket) return getOraclePriceForBot(bonded_state, params, showOracles);

  if ("oracles" in bonded_state) {
    const { oracles } = bonded_state;
    if (oracles[0]) {
      oracleValue1 = await socket.api.getDataFeed({
        oracles: [oracles[0].oracle],
        feed_name: oracles[0].feed_name,
        ifnone: "none",
      });
    }
    if (oracles[1]) {
      oracleValue2 = await socket.api.getDataFeed({
        oracles: [oracles[1].oracle],
        feed_name: oracles[1].feed_name,
        ifnone: "none",
      });
    }
    if (oracles[2]) {
      oracleValue3 = await socket.api.getDataFeed({
        oracles: [oracles[2].oracle],
        feed_name: oracles[2].feed_name,
        ifnone: "none",
      });
    }
    const oraclesValues = [oracleValue1, oracleValue2, oracleValue3].filter(
      (v) => !!v
    );

    const price = oraclesValues.reduce((result, current, index) => {
      return oracles[index].op === "/"
        ? result / current
        : result * (current || 1);
    }, 1);

    if (showOracles) {
      return [price, oracleValue1, oracleValue2, oracleValue3];
    } else {
      return price;
    }

  } else {
    if (params.oracle1) {
      oracleValue1 = await socket.api.getDataFeed({
        oracles: [params.oracle1],
        feed_name: params.feed_name1,
        ifnone: "none",
      });
    }
    if (params.oracle2) {
      oracleValue2 = await socket.api.getDataFeed({
        oracles: [params.oracle2],
        feed_name: params.feed_name2,
        ifnone: "none",
      });
    }
    if (params.oracle3) {
      oracleValue3 = await socket.api.getDataFeed({
        oracles: [params.oracle3],
        feed_name: params.feed_name3,
        ifnone: "none",
      });
    }
  }

  const oraclesValues = [oracleValue1, oracleValue2, oracleValue3].filter(
    (v) => !!v
  );
  const price = oraclesValues.reduce((price, current, index) => {
    return params["op" + (index + 1)] === "*"
      ? price * current
      : price / current;
  }, 1);
  if (showOracles) {
    return [price, oracleValue1, oracleValue2, oracleValue3];
  } else {
    return price;
  }
};
