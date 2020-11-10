import React from "react";
import { Typography, Tabs, List } from "antd";
import obyte from "obyte";
import { useSelector } from "react-redux";
import moment from 'moment';

import { getParams } from "helpers/getParams";
import { ChangeOracles } from "./components/oracles/ChangeOracles";
import { VotedForOracle } from "./components/oracles/VotedForOracle";
import { CurrentOracles } from "./components/oracles/CurrentOracles";
import { InfoOracle } from "./components/oracles/InfoOracle";
import { generateOraclesString } from "helpers/generateOraclesString";
import { Withdraw } from "./components/Withdraw";
import { useWindowSize } from "hooks/useWindowSize.js";
import { GovernanceItem } from "./GovernanceItem";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export const Governance = ({ openWalletModal }) => {
  const {
    governance_aa,
    governance_state,
    stable_state,
    params,
    symbol1,
    symbol2,
    base_governance
  } = useSelector((state) => state.active);
  const { activeWallet } = useSelector((state) => state.settings);
  const actualParams = getParams(params, stable_state);
  const [width] = useWindowSize();
  if (!activeWallet) {
    return (
      <div style={{ textAlign: "center", cursor: "pointer", color: "#1890ff" }} onClick={openWalletModal}>
        Please add the address of your wallet in order to participate in
        governance
      </div>
    );
  }
  const initParams = {
    fee_multiplier: {
      value: actualParams["fee_multiplier"],
    },
    moved_capacity_share: {
      value: actualParams["moved_capacity_share"],
    },
    threshold_distance: {
      value: actualParams["threshold_distance"],
    },
    move_capacity_timeout: {
      value: actualParams["move_capacity_timeout"],
    },
    slow_capacity_share: {
      value: actualParams["slow_capacity_share"],
    },
    interest_rate: {
      value: actualParams["interest_rate"],
    },
    "deposits.min_deposit_term": {
      value: actualParams["min_deposit_term"],
    },
    "deposits.challenging_period": {
      value: actualParams["challenging_period"],
    },
    "deposits.challenge_immunity_period": {
      value: actualParams["challenge_immunity_period"],
    },
    "deposits.reporter_share": {
      value: actualParams["reporter_share"],
    }
  };
  let supportParamsByAddress = {};
  const governance = {};
  const balances = {};
  const supportList = {};

  for (let row in governance_state) {
    if (row.includes("challenging_period_start_ts_")) {
      const param = row.split("_").slice(4).join("_");
      if (!(param in governance)) governance[param] = {};
      governance[param] = {
        ...governance[param],
        challenging_period_start_ts: governance_state[row],
      };
    } else if (row.includes("leader_")) {
      const param = row.split("_").slice(1).join("_");
      if (!(param in governance)) governance[param] = {};
      if (param !== "oracles") {
        governance[param] = {
          ...governance[param],
          leader: governance_state[row],
          value: actualParams[param] || actualParams[param.replace("deposits.", '')]
        };
      } else {
        governance[param] = {
          ...governance[param],
          leader: governance_state[row],
          value: generateOraclesString(actualParams, stable_state.oracles),
        };
      }
    } else if (row.includes("balance_")) {
      const address = row.split("_")[1];
      balances[address] = governance_state[row];
    } else if (row.includes("choice_")) {
      const [address, ...paramArray] = row.split("_").slice(1);
      const param = paramArray.join("_");
      if (!(param in governance)) governance[param] = {};
      governance[param] = {
        ...governance[param],
        choice: {
          ...governance[param].choice,
          [address]: governance_state[row],
        },
      };
    } else if (row.includes("support_")) {
      const info = row.split("_").slice(1);
      if (obyte.utils.isValidAddress(info[info.length - 1])) {
        const address = info[info.length - 1];
        const value = info[info.length - 2];
        const param = info.slice(0, -2).join("_");
        if (!(param in supportList)) supportList[param] = []
        supportList[param] = [...supportList[param], {
          support: governance_state[row],
          value,
          address
        }];
        if (row.includes("support_oracles")) {
          const oraclesRow = info.join("_");

          const oracleList = oraclesRow.split(" ");

          oracleList[0] = oracleList[0].split("_").slice(1).join("_");

          const address = oracleList[oracleList.length - 1]
            .split("_")
            .slice(-1)[0];

          oracleList[oracleList.length - 1] = oracleList[oracleList.length - 1]
            .split("_")
            .slice(0, -1);

          const sha = oracleList[0];
          supportParamsByAddress.oracles = {
            ...supportParamsByAddress.oracles,
            [address]: {
              key: sha,
              support: governance_state[row],
            },
          };
        } else {
          supportParamsByAddress[param] = {
            ...supportParamsByAddress[param],
            [address]: { value, support: governance_state[row] },
          };
        }
      } else {
        const value = info[info.length - 1];
        const param = info.slice(0, -1).join("_");

        if (!(param in governance)) governance[param] = {};

        if (param.includes("oracles")) {
        } else {
          governance[param] = {
            ...governance[param],
            supports: {
              ...governance[param].supports,
              [value]: governance_state[row],
            },
          };
        }
      }
    } else {
    }
  }

  let choiceParams = [];
  for (const param in governance) {
    if (
      "choice" in governance[param] &&
      activeWallet in governance[param].choice
    ) {
      choiceParams.push(param);
    }
  }

  for (let address in supportParamsByAddress.oracles) {
    supportParamsByAddress.oracles[address] = {
      ...supportParamsByAddress.oracles[address],
      value: governance.oracles.choice && governance.oracles.choice[address],
    };
  }

  const choice =
    governance.oracles &&
    governance.oracles.choice &&
    governance.oracles.choice[activeWallet];

  const balance =
    (activeWallet in balances &&
      balances[activeWallet] / 10 ** actualParams.decimals1) ||
    0;

  const governanceParams = { ...initParams, ...governance };
  const governanceList = [];
  for (let param in governanceParams) {
    if (param === "oracles") continue;
    if (param === "fee_multiplier" && governanceParams[param].value < 1 && base_governance === "Y4VBXMROK5BWBKSYYAMUW7QUEZFXYBCF") continue;
    governanceList.push({
      ...governanceParams[param],
      name: param,
      supports: supportParamsByAddress[param],
    });
  }

  return (
    <div>
      <Title level={3}>Governance</Title>
      <p>
        <Text type="secondary">
          {symbol1 ? symbol1 : "Token1"} holders can vote to change various
          parameters of the stablecoin and ensure its success. <br /> The value
          of {symbol1 ? symbol1 : "token1"} grows as more{" "}
          {symbol2 ? symbol2 : "token2"} tokens are bought.
        </Text>
      </p>

      <Withdraw
        choiceParams={choiceParams}
        symbol={symbol1}
        balance={
          (activeWallet in balances &&
            balances[activeWallet] / 10 ** actualParams.decimals1) ||
          0
        }
      />

      <Tabs defaultActiveKey="1">
        <TabPane tab="Change parameters" key="1">
          <Title level={3}>Change parameters</Title>
          <div style={{ marginTop: 20 }}>
            <List
              dataSource={governanceList}
              renderItem={(item) => {
                const challengingStart = moment.utc(item.challenging_period_start_ts * 1000);

                challengingStart.add({
                  second: params.regular_challenging_period
                });

                const challengingStartInSeconds = challengingStart.toDate();

                return (
                  <GovernanceItem
                    value={item.value}
                    width={width}
                    name={item.name}
                    leader={item.leader}
                    supports={item.supports}
                    decimals={actualParams.decimals1}
                    governance_aa={stable_state.governance_aa}
                    base_governance={base_governance}
                    activeWallet={activeWallet}
                    balance={balance}
                    supportList={item.name in supportList ? supportList[item.name] : []}
                    asset={stable_state.asset1}
                    symbol={symbol1}
                    supportParamsByAddress={
                      item.name in supportParamsByAddress &&
                        activeWallet in supportParamsByAddress[item.name]
                        ? supportParamsByAddress[item.name][activeWallet]
                        : {}
                    }
                    choice={
                      activeWallet &&
                      activeWallet in
                      (governanceParams[item.name].choice || {}) &&
                      governanceParams[item.name].choice[activeWallet]
                    }
                    challengingPeriod={challengingStartInSeconds}
                    regularPeriod={params.regular_challenging_period}
                    freezePeriod={
                      item.challenging_period_start_ts
                        ? item.challenging_period_start_ts +
                        params.regular_challenging_period +
                        actualParams.freeze_period
                        : undefined
                    }
                  />
                );
              }}
            />
          </div>
        </TabPane>
        <TabPane
          tab="Change oracles"
          key="2"
          disabled={!actualParams.allow_oracle_change}
        >
          <Title level={3}>Change oracles</Title>
          <InfoOracle
            oracles={governance.oracles}
            activeWallet={activeWallet}
            governance_aa={governance_aa}
            important_challenging_period={
              actualParams.important_challenging_period
            }
          />

          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 14,
                color: "rgba(0, 0, 0, 0.45)",
                marginBottom: 5,
              }}
            >
              Current values
            </div>
            <CurrentOracles
              oracles={stable_state.oracles}
              param={actualParams}
            />
          </div>

          <ChangeOracles
            activeWallet={activeWallet}
            governance_aa={governance_aa}
            width={width}
            asset={stable_state.asset1}
            decimals={actualParams.decimals1}
            freeze_period={actualParams.freeze_period}
            important_challenging_period={
              actualParams.important_challenging_period
            }
            challenging_period_start_ts={
              governance.oracles &&
              governance.oracles.challenging_period_start_ts
            }
            balance={balance}
            choice={choice}
            symbol={symbol1}
            choiceIsEqualLeader={
              choice && governance.oracles.choice[activeWallet]
                ? choice === governance.oracles.leader
                : false
            }
          />

          <Title level={3} style={{ marginTop: 20 }}>
            List of voters
          </Title>

          <VotedForOracle
            oracles={governance.oracles}
            supports={supportParamsByAddress.oracles}
            activeWallet={activeWallet}
            governance_aa={governance_aa}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
