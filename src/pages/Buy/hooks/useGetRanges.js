import { useEffect, useState } from "react";
import config from "config";
import axios from "axios";

export const useGetRanges = (activeCurrency) => {
  const [ranges, setRanges] = useState({ min: 0 });

  useEffect(() => {
    setRanges({ min: undefined });
    (async () => {
      if (activeCurrency !== undefined && activeCurrency !== "gbyte") {
        const rangesData = await axios.get(
          `https://api.simpleswap.io/v1/get_ranges?api_key=${config.SIMPLESWAP_API_KEY}&currency_from=${activeCurrency}&currency_to=gbyte`
        );
        setRanges({ min: Number(rangesData.data.min) });
      } else {
        setRanges({ min: undefined });
      }
    })();
  }, [activeCurrency]);

  return ranges;
};
