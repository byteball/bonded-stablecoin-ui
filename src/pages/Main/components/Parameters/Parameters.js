import React from "react";
import { useSelector } from "react-redux";
import { Typography } from "antd";

import { CurveParameters } from "./components/CurveParameters";
import { CapacitorParameters } from "./components/CapacitorParameters";
import { GovernanceParameters } from "./components/GovernanceParameters";
import { AutonomusParameters } from "./components/AutonomusParameters";
import { TokensParameters } from "./components/TokensParameters";
import { DepositsParameters } from "./components/DepositsParameters";
import styles from "./Parameters.module.css";
import { getParams } from "helpers/getParams";
import config from "config";

const { Title } = Typography;

export const Parameters = () => {
  const active = useSelector((state) => state.active);
  const { activeWallet } = useSelector((state) => state.settings);
  const initialParams = active.params;
  const params = getParams(initialParams, active.stable_state);
  const {
    stable_state,
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
      <Title level={3}>Parameters of the stablecoin</Title>

      <div style={{ marginBottom: 10 }}>
        <a
          href={`https://${config.TESTNET ? "testnet" : ""
            }explorer.obyte.org/#${active.address}`}
          target="_blank"
          rel="noopener"
        >
          View on explorer
        </a>
      </div>
      <div className={styles.wrap}>
        <div style={{ paddingRight: 20 }}>
          <Title level={4} type="secondary">
            Curve
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
            Autonomous Agents
          </Title>
          <AutonomusParameters
            curve_aa={address}
            deposit_aa={deposit_aa}
            governance_aa={governance_aa}
          />

          <Title level={4} type="secondary">
            Tokens
          </Title>
          <TokensParameters
            asset1={stable_state.asset1}
            asset2={stable_state.asset2}
            asset={deposit_state.asset}
            symbol1={symbol1}
            symbol2={symbol2}
            symbol3={symbol3}
          />
        </div>
        <div className={styles.column}>
          <Title level={4} type="secondary">
            Deposits
          </Title>
          <DepositsParameters params={params} address={address} activeWallet={activeWallet} />
          <Title level={4} type="secondary">
            Capacitor
          </Title>
          <CapacitorParameters params={params} address={address} activeWallet={activeWallet} base_governance={base_governance} />
          <Title level={4} type="secondary">
            Governance
          </Title>
          <GovernanceParameters params={params} />
        </div>
      </div>
    </div>
  );
};
