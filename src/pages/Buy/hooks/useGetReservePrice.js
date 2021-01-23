import { useEffect, useState } from "react";
import config from "config";
import socket from "services/socket";

export const useGetReservePrice = (reserve_asset) => {
  const [rate, setRate] = useState(undefined);

  useEffect(() => {
    setRate(undefined);
    (async () => {
      const reserveProperties = config.reserves[reserve_asset];
      const reservePrice = reserveProperties && reserveProperties.oracle && reserveProperties.feed_name ? await socket.api.getDataFeed({
        oracles: [reserveProperties.oracle],
        feed_name: reserveProperties.feed_name,
        ifnone: "none",
      }) : 1;
      setRate(reservePrice);
    })();
  }, [reserve_asset]);

  return rate;
};
