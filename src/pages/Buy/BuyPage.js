import React from "react";
import { Typography } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet";

import { ExchangeForm } from "./components/ExchangeForm";
import { ExchangeList } from "./components/ExchangeList";
import { ExchangeView } from "./components/ExchangeView";

const { Title, Text } = Typography;

export const BuyPage = () => {
  const { pendingExchanges, exchanges } = useSelector(
    (state) => state.settings
  );
  const current = exchanges.find((p) => p.id === pendingExchanges);
  const { t } = useTranslation();

  return (
    <div>
      <Helmet title="Bonded stablecoins - Buy interest tokens" />
      <Title level={1}>{t("buy.title_btc", "Buy interest tokens with BTC")}</Title>
      <Text type="secondary">
        {t("buy.desc_v2", "Buy interest earning tokens (IUSD, IBIT, etc) for BTC in one easy step.")}
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
