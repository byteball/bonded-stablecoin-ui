import { useEffect, useState } from "react";
import config from "config";
import axios from "axios";

export const useGetStatusExchanges = (exchanges) => {
  const [exchangesStatusList, setExchangesStatusList] = useState({});
  useEffect(() => {
    (async () => {
      const promiseList = exchanges.map(async (e) =>
        axios
          .get(
            e.provider === "oswapcc"
              ? `${config.oswapccRoot}/get_status/${e.id}`
              : `https://api.simpleswap.io/v1/get_exchange?api_key=${config.SIMPLESWAP_API_KEY}&id=${e.id}`
          )
          .then((obj) => {
            const { data } = obj;
            return {
              id: e.id,
              status: e.provider === "oswapcc" ? (data.data ? data.data.status : data.status) : data.status,
            };
          })
      );
      const exchangesStatus = await Promise.all(promiseList);
      const statusList = {};
      exchangesStatus.forEach((s) => {
        statusList[s.id] = s.status;
      });
      setExchangesStatusList(statusList);
    })();
  }, [exchanges]);

  return exchangesStatusList;
};
