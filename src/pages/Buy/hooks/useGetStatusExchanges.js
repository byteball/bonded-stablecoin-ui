import { useEffect, useState } from "react";
import config from "config";
import axios from "axios";

export const useGetStatusExchanges = (exchanges) => {
  const [exchangesStatusList, setExchangesStatusList] = useState([]);
  useEffect(() => {
    (async () => {
      const primiseList = exchanges.map(async (e) =>
        axios
          .get(
            `https://api.simpleswap.io/v1/get_exchange?api_key=${config.SIMPLESWAP_API_KEY}&id=${e.id}`
          )
          .then((obj) => {
            const { data } = obj;
            return {
              id: data.id,
              status: data.status,
            };
          })
      );
      const exchangesStatus = await Promise.all(primiseList);
      const statusListArray = [];
      exchangesStatus.forEach((s) => {
        statusListArray[s.id] = s.status;
      });
      setExchangesStatusList(statusListArray);
    })();
  }, [exchanges]);

  return exchangesStatusList;
};
