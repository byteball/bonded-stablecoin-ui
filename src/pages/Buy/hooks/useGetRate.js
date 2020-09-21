import { useEffect, useState } from "react";
import config from "config";
import axios from "axios";

export const useGetRate = (activeCurrency, index) => {
  const [rate, setRate] = useState(undefined);

  useEffect(() => {
    setRate(undefined);
    (async () => {
      if (activeCurrency !== undefined) {
        const rangesData = await axios.get(
          `https://api.simpleswap.io/v1/get_ranges?api_key=${config.SIMPLESWAP_API_KEY}&currency_from=${activeCurrency}&currency_to=gbyte`
        );
        const ranges = rangesData.data;
        if (activeCurrency !== "gbyte") {
          if (ranges && ranges.min) {
            const min = Number(ranges.min);
            const rateData = await axios.get(
              `https://api.simpleswap.io/v1/get_estimated?api_key=${config.SIMPLESWAP_API_KEY}&currency_from=${activeCurrency}&currency_to=gbyte&amount=${min}`
            );
            const rate = Number(rateData.data) / min;
            setRate(rate);
          } else {
            const rateData = await axios.get(
              `https://api.simpleswap.io/v1/get_estimated?api_key=${config.SIMPLESWAP_API_KEY}&currency_from=${activeCurrency}&currency_to=gbyte&amount=1`
            );
            setRate(Number(rateData.data));
          }
        }
      }
    })();
  }, [activeCurrency, index]);

  return rate;
};
