import React, { useEffect } from "react";
import { Typography } from "antd";
import { useSelector } from "react-redux";

import { ExchangeForm } from "./components/ExchangeForm";
import { ExchangeList } from "./components/ExchangeList";
import { ExchangeView } from "./components/ExchangeView";

const { Title, Text } = Typography;

export const BuyPage = () => {
  const { pendingExchanges, exchanges } = useSelector(
    (state) => state.settings
  );
  const current = exchanges.find((p) => p.id === pendingExchanges);
  useEffect(() => {
    document.title = "Bonded stablecoins - Buy interest tokens";
  }, []);
  return (
    <div>
      <Title level={2}>Buy interest tokens</Title>
      <Text type="secondary">
        Buy interest earning tokens (IUSD, IBIT, etc) for any crypto in one easy
        step.
      </Text>
      {pendingExchanges && current ? (
        <ExchangeView current={current} />
      ) : (
        <ExchangeForm />
      )}

      <ExchangeList />
    </div>
  );
};
