import React, { createRef, useEffect, useState } from "react";
import { Typography, List } from "antd";
import obyte from "obyte";
import { useSelector } from "react-redux";
import moment from 'moment';

import { getParams } from "helpers/getParams";
import { generateOraclesString } from "helpers/generateOraclesString";
import { Withdraw } from "./components/Withdraw";
import { useWindowSize } from "hooks/useWindowSize.js";
import { GovernanceItem } from "./GovernanceItem";
import { useLocation } from "react-router-dom";

const { Title, Text } = Typography;

export const Governance = ({ openWalletModal }) => {
  const {
    governance_state,
    stable_state,
    params,
    symbol1,
    symbol2,
    base_governance
  } = useSelector((state) => state.active);
  const [currentParams, setCurrentParams] = useState(undefined);
  const { activeWallet } = useSelector((state) => state.settings);
  const actualParams = getParams(params, stable_state);
  const location = useLocation();
  const [width] = useWindowSize();

  useEffect(() => {
    if (location.hash) {
      const param = location.hash.slice(1);
      setCurrentParams(param);
      goToParam(param);
    } else if (currentParams) {
      clearGoToParam(currentParams);
      setCurrentParams(undefined);
    }
  }, [location.hash, currentParams]);

  if (!activeWallet) {
    return (
      <div style={{ textAlign: "center", cursor: "pointer", color: "#1890ff" }} onClick={openWalletModal}>
        Please add the address of your wallet in order to participate in
        governance
      </div>
    );
  }

  const initParams = {
    interest_rate: {
      value: actualParams["interest_rate"],
    },
    "oracles": {
      value: generateOraclesString(actualParams, stable_state.oracles),
    },
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

        governance[param] = {
          ...governance[param],
          supports: {
            ...governance[param].supports,
            [value]: governance_state[row],
          },
        };
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

  const balance =
    (activeWallet in balances &&
      balances[activeWallet] / 10 ** actualParams.decimals1) ||
    0;

  const governanceParams = { ...initParams, ...governance };
  const governanceList = [];
  for (let param in governanceParams) {
    governanceParams[param].refEl = createRef();
    if (param === "fee_multiplier" && governanceParams[param].value < 1 && base_governance === "Y4VBXMROK5BWBKSYYAMUW7QUEZFXYBCF") continue;
    if(param === "oracles" && !actualParams.allow_oracle_change) continue;
    governanceList.push({
      ...governanceParams[param],
      name: param,
      supports: supportParamsByAddress[param],
    });
  }

  const goToParam = (param) => {
    if (param && param in governanceParams && governanceParams[param].refEl.current) {
      if (location.hash) {
        governanceParams[param].refEl.current.scrollIntoView({ behavior: "smooth" });
      }

      governanceParams[param].refEl.current.style.boxShadow = "0px 0px 21px -2px #798184";
    }
  }

  const clearGoToParam = (param) => {
    if (param && param in governanceParams && governanceParams[param].refEl.current) {
      governanceParams[param].refEl.current.style.boxShadow = "none";
    }
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
      <Title level={3} style={{ marginTop: 20 }}>Change parameters</Title>
      <div style={{ marginTop: 20 }}>
        <List
          dataSource={governanceList}
          renderItem={(item, index) => {
            const challengingStart = moment.utc(item.challenging_period_start_ts * 1000);

            challengingStart.add({
              second: params.regular_challenging_period
            });

            const challengingStartInSeconds = challengingStart.toDate();

            return (
              <GovernanceItem
                refEl={item.refEl}
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
    </div>
  );
};
