import axios from "axios";
import config from "../config";

export const getOraclePriceForBot = async (
  bonded_state,
  params,
  showOracles = false
) => {
  let oracleValue1, oracleValue2, oracleValue3;
  if ("oracles" in bonded_state) {
    const { oracles } = bonded_state;
    if (oracles[0]) {
      oracleValue1 = await axios.get(config.BUFFER_URL + "/get_data_feed/" + oracles[0].oracle + "/" + oracles[0].feed_name).then(response => response.data.data);
    }
    if (oracles[1]) {
      oracleValue2 = await axios.get(config.BUFFER_URL + "/get_data_feed/" + oracles[1].oracle + "/" + oracles[1].feed_name).then(response => response.data.data);
    }
    if (oracles[2]) {
      oracleValue3 = await axios.get(config.BUFFER_URL + "/get_data_feed/" + oracles[2].oracle + "/" + oracles[2].feed_name).then(response => response.data.data);
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
      oracleValue1 = await axios.get(config.BUFFER_URL + "/get_data_feed/" + params.oracle1 + "/" + params.feed_name1).then(response => response.data.data);
    }
    if (params.oracle2) {
      oracleValue2 = await axios.get(config.BUFFER_URL + "/get_data_feed/" + params.oracle2 + "/" + params.feed_name2).then(response => response.data.data);
    }
    if (params.oracle3) {
      oracleValue3 = await axios.get(config.BUFFER_URL + "/get_data_feed/" + params.oracle3 + "/" + params.feed_name3).then(response => response.data.data);
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
