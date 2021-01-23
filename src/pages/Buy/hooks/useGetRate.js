import { useEffect, useState } from "react";
import config from "config";
import axios from "axios";

export const useGetRate = (activeCurrency, index, amountCurrency, inited) => {
  const [rate, setRate] = useState(undefined);

  useEffect(() => {
    setRate(undefined);
    (async () => {
      if (activeCurrency !== undefined && inited) {
        if (config.oswapccCurrencies.includes(activeCurrency.toUpperCase())) {
          const rateData = await axios.get(
            `${config.oswapccRoot}/estimate?in_coin=${activeCurrency.toUpperCase()}&in_amount=${amountCurrency}`
          ).catch(() => {
            console.log("/estimate error")
          });
          if (!rateData)
            return setRate(null);
          const rate = rateData && Number(rateData.data.data) / amountCurrency;
          setRate(rate);
          return;
        }
        const rangesData = await axios.get(
          `https://api.simpleswap.io/v1/get_ranges?api_key=${config.SIMPLESWAP_API_KEY}&currency_from=${activeCurrency}&currency_to=gbyte`
        ).catch(() => {
          console.log("get_ranges error")
          setRate(null);
        });
        const ranges = rangesData && rangesData.data;
        if (activeCurrency !== "gbyte") {
          if (ranges && ranges.min) {
            const min = Number(ranges.min);
            const rateData = await axios.get(
              `https://api.simpleswap.io/v1/get_estimated?api_key=${config.SIMPLESWAP_API_KEY}&currency_from=${activeCurrency}&currency_to=gbyte&amount=${min}`
            ).catch(() => {
              console.log("get_estimated error")
            });
            const rate = rateData ? Number(rateData.data) / min : null;
            setRate(rate);
          } else {
            const rateData = await axios.get(
              `https://api.simpleswap.io/v1/get_estimated?api_key=${config.SIMPLESWAP_API_KEY}&currency_from=${activeCurrency}&currency_to=gbyte&amount=1`
            ).catch(() => {
              console.log("get_estimated error")
            });
            setRate(rateData ? Number(rateData.data) : null);
          }
        }
      }
    })();
  }, [activeCurrency, index, amountCurrency, inited]);

  return rate;
};
