import React from "react";
import { useSelector } from "react-redux";
import { Typography } from "antd";
import { useTranslation } from 'react-i18next';

import { CurveParameters } from "./components/CurveParameters";
import { CapacitorParameters } from "./components/CapacitorParameters";
import { GovernanceParameters } from "./components/GovernanceParameters";
import { AutonomousParameters } from "./components/AutonomousParameters";
import { TokensParameters } from "./components/TokensParameters";
import { DepositsParameters } from "./components/DepositsParameters";
import styles from "./Parameters.module.css";
import { getParams } from "helpers/getParams";
import config from "config";

const { Title } = Typography;

export const Parameters = () => {
  const active = useSelector((state) => state.active);
  const { activeWallet } = useSelector((state) => state.settings);
  const { t } = useTranslation();
  const initialParams = active.params;
  const params = getParams(initialParams, active.bonded_state);
  const {
    bonded_state,
    deposit_state,
    oracleValue1,
    oracleValue2,
    oracleValue3,
    symbol1,
    symbol2,
    symbol3,
    reserve_asset_symbol,
    deposit_aa,
    governance_aa,
    address,
    base_governance
  } = active;
  return (
    <div>
      <Title level={3}>{t("trade.tabs.parameters.title", "Parameters of the stablecoin")}</Title>

      <div style={{ marginBottom: 10 }}>
        <a
          href={`https://${config.TESTNET ? "testnet" : ""
            }explorer.obyte.org/#${active.address}`}
          target="_blank"
          rel="noopener"
        >
          {t("trade.tabs.parameters.view", "View on explorer")}
        </a>
      </div>
      <div className={styles.wrap}>
        <div style={{ paddingRight: 20 }}>
          <Title level={4} type="secondary">
            {t("trade.tabs.parameters.title_curve", "Curve")}
          </Title>
          <CurveParameters
            params={params}
            oracleValue1={oracleValue1}
            oracleValue2={oracleValue2}
            oracleValue3={oracleValue3}
            reserve_asset_symbol={reserve_asset_symbol}
            address={address}
            activeWallet={activeWallet}
          />
          <Title level={4} type="secondary">
            {t("trade.tabs.parameters.title_autonomous_agents", "Autonomous Agents")}
          </Title>
          <AutonomousParameters
            curve_aa={address}
            deposit_aa={deposit_aa}
            governance_aa={governance_aa}
          />

          <Title level={4} type="secondary">
            {t("trade.tabs.parameters.title_tokens", "Tokens")}
          </Title>
          <TokensParameters
            asset1={bonded_state.asset1}
            asset2={bonded_state.asset2}
            asset={deposit_state.asset}
            symbol1={symbol1}
            symbol2={symbol2}
            symbol3={symbol3}
          />
        </div>
        <div className={styles.column}>
          <Title level={4} type="secondary">
            {t("trade.tabs.parameters.title_deposits", "Deposits")}
          </Title>
          <DepositsParameters params={params} address={address} activeWallet={activeWallet} />
          <Title level={4} type="secondary">
            {t("trade.tabs.parameters.title_capacitor", "Capacitor")}
          </Title>
          <CapacitorParameters params={params} address={address} activeWallet={activeWallet} base_governance={base_governance} />
          <Title level={4} type="secondary">
            {t("trade.tabs.parameters.title_governance", "Governance")}
          </Title>
          <GovernanceParameters params={params} />
        </div>
      </div>
    </div>
  );
};
