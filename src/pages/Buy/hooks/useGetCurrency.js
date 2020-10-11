import { useEffect, useState } from "react";
import config from "config";
import axios from "axios";

export const useGetCurrency = () => {
  const [currencies, setCurrencies] = useState([]);
  useEffect(() => {
    (async () => {
      const allCurrenciesData = await axios.get(
        `https://api.simpleswap.io/v1/get_pairs?api_key=${config.SIMPLESWAP_API_KEY}&fixed=false&symbol=gbyte`
      );
      if ("data" in allCurrenciesData) {
        setCurrencies(allCurrenciesData.data);
      }
    })();
  }, []);
  return currencies;
};
