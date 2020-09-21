import { useEffect, useState } from "react";
import config from "config";
import axios from "axios";

export const useGetCompensation = (amountCurrency, activeCurrency, rate) => {
  const [compensation, setCompensation] = useState(0);
  useEffect(() => {
    setCompensation(undefined);
    const handler =
      activeCurrency !== "gbyte" &&
      amountCurrency &&
      rate &&
      setTimeout(async () => {
        const { data } = await axios.get(
          `https://${config.TESTNET ? "testnet." : ""}${
            config.BUFFER_URL
          }/get_expected_compensation?amount_in=${amountCurrency}&currency_in=${activeCurrency}&amount_out=${
            rate * amountCurrency
          }`
        );
        if (data.status === "success" && data.data.eligible) {
          setCompensation(data.data.compensation);
        } else {
          setCompensation(0);
        }
      }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [amountCurrency, activeCurrency, rate]);

  return compensation;
};
