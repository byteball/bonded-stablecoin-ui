import Decimal from "decimal.js";
import { isEmpty } from "lodash";
import { getAAPayload, getAAPayment, getAAPaymentsSum } from "services/eventManager/eventManager";

import i18n from "../locale/index";

export const eventIdentification = (type, unit, params, _, active) => {

  if (!unit) return null

  const { symbol1, symbol2, symbol3, stable_state, governance_state, reserve_asset_symbol, address,
    deposit_aa,
    governance_aa, deposit_state } = active;
  const { asset1, asset2 } = stable_state;
  const { asset } = deposit_state;

  const { messages } = unit;

  const payload = getAAPayload(messages);
  const name = "name" in payload ? payload.name.replace("deposits.", "") : undefined;

  const { decimals1, decimals2, reserve_asset_decimals, reserve_asset } = params;
  if (type === "curve") {
    if ("tokens1" in payload || "tokens2" in payload) {
      const amount = getAAPayment(unit.messages, [address, deposit_aa, governance_aa]);
      const T1 = payload.tokens1 ? payload.tokens1 / 10 ** decimals1 : 0;
      const T2 = payload.tokens2 ? payload.tokens2 / 10 ** decimals2 : 0;
      const tokens1 = T1 ? (T1 + " " + (symbol1 || "T1")) : "";
      const tokens2 = T2 ? (T2 + " " + (symbol2 || "T2")) : "";

      return [
        i18n.t("trade.tabs.transactions.events.buy", "Buy tokens"),
        +Number(amount / (10 ** reserve_asset_decimals)).toFixed(reserve_asset_decimals),
        reserve_asset_symbol,
        `${tokens1} ${tokens2}`
      ]
    } else if ("move_capacity" in payload) {
      return [
        i18n.t("trade.tabs.transactions.events.move_capacity", "Move capacity from slow pool to fast one"),
        undefined,
        undefined
      ]
    } else if (isEmpty(payload) || "max_fee_percent" in payload) {

      let type;
      let pendingAmount = "[loading]";

      for (const message in messages) {
        const msg = messages[message];

        if (msg.app === "payment" && "asset" in msg.payload) {
          const asset = msg.payload.asset;
          if (asset === asset1) {
            type = 1;
          } else if (asset === asset2) {
            type = 2;
          }
        }
      }
      if (type) {
        const amount = getAAPayment(unit.messages, [address, deposit_aa, governance_aa], type === 1 ? asset1 : asset2);

        if (unit.objResponseUnit) {
          pendingAmount = getAAPayment(unit.objResponseUnit.messages, [address, deposit_aa, governance_aa], reserve_asset !== "base" ? reserve_asset : undefined) / (10 ** reserve_asset_decimals);
        }

        return [
          i18n.t("trade.tabs.transactions.events.redeem", "Redeem {{tokens}}", { tokens: type === 1 ? symbol1 || "T1" : symbol2 || "T2" }),
          amount / (10 ** (type === 1 ? decimals1 : decimals2)),
          type === 1 ? symbol1 : symbol2,
          pendingAmount + " " + reserve_asset_symbol
        ]
      }
    } else if ("name" in payload && "value" in payload) {
      return [
        i18n.t("trade.tabs.transactions.events.change_param_auto", "Change {{name}} to {{value}}", { name, value: payload.value })
      ]
    }
  } else if (type === "deposit") {
    const amount = getAAPayment(unit.messages, [address, deposit_aa, governance_aa]);
    if ("id" in payload && "change_interest_recipient" in payload) {
      return [
        i18n.t("trade.tabs.transactions.events.change_recipient", "Change the interest recipient"),
      ]
    } else if ("id" in payload && "add_protection" in payload) {
      return [
        i18n.t("trade.tabs.transactions.events.add_protection", "Add protection"),
        amount / 10 ** reserve_asset_decimals,
        reserve_asset_symbol
      ]
    } else if ("id" in payload && "withdraw_protection" in payload) {
      const output = getAAPayment(unit.objResponseUnit.messages, [unit.trigger_address], reserve_asset === "base" ? undefined : reserve_asset) / (10 ** reserve_asset_decimals);
      return [
        i18n.t("trade.tabs.transactions.events.withdraw_protection", "Withdraw protection"),
        undefined,
        undefined,
        `${output} ${reserve_asset_symbol}`
      ]
    } else if (
      "id" in payload &&
      "challenge_force_close" in payload &&
      "weaker_id" in payload
    ) {
      const outputs = getAAPaymentsSum(unit.objResponseUnit.messages, [], asset, true) / (10 ** decimals2);

      return [
        i18n.t("trade.tabs.transactions.events.challenged_force_close", "Challenged a force-close"),
        undefined,
        undefined,
        `${outputs} ${symbol3}`
      ]
    } else if ("id" in payload && "commit_force_close" in payload) {
      const output = getAAPaymentsSum(unit.objResponseUnit.messages, [], asset, true) / (10 ** decimals2);

      return [
        i18n.t("trade.tabs.transactions.events.commit_force_close", "Commit a force close"),
        undefined,
        undefined,
        `${output} ${symbol3}`
      ]
    } else if ("id" in payload) {
      let type;
      for (const message in messages) {
        const msg = messages[message];
        if (msg.app === "payment" && "asset" in msg.payload) {
          type = 1;
        }
      }
      if (type === 1) {
        const amount = getAAPayment(unit.messages, [address, deposit_aa, governance_aa], asset);
        const output = getAAPayment(unit.objResponseUnit.messages, [unit.trigger_address], asset2) / (10 ** decimals2);

        return [
          i18n.t("trade.tabs.transactions.events.close_deposit", "Close a Deposit"),
          amount / 10 ** decimals2,
          symbol3,
          output ? `${output} ${symbol2}` : undefined
        ];
      } else {
        const output = getAAPayment(unit.objResponseUnit.messages, [unit.trigger_address], asset) / (10 ** decimals2);
        return [
          i18n.t("trade.tabs.transactions.events.withdraw_interest", "Withdraw interest"),
          undefined,
          undefined,
          `${output} ${symbol3}`
        ];
      }

    } else if (isEmpty(payload) || "interest_recipient" in payload || "to" in payload) {
      let isInterestAsset = false;
      for (const message in messages) {
        const msg = messages[message];
        if (msg.app === "payment" && "asset" in msg.payload) {
          const asset = msg.payload.asset;
          if (asset === asset2) {
            isInterestAsset = true;
          }
        }
      }
      if (isInterestAsset) {
        const amount = getAAPayment(unit.messages, [address, deposit_aa, governance_aa], asset2);
        const output = getAAPayment(unit.objResponseUnit.messages, [payload.to || unit.trigger_address], asset) / 10 ** decimals2;

        return [
          i18n.t("trade.tabs.transactions.events.open", "Open a Deposit"),
          amount / 10 ** decimals2,
          symbol2,
          `${output} ${symbol3}`
        ];
      }
    }
  } else if (type === "governance") {
    const asPercentage = payload.name === "interest_rate" || payload.name === "reporter_share";

    if ("commit" in payload && "name" in payload) {
      const leader = governance_state["leader_" + payload.name];
      if (leader) {
        return [
          i18n.t("trade.tabs.transactions.events.commit_new_value", "Commit the new value of {{name}}: {{value}}", { name, value: asPercentage ? leader * 100 + "%" : leader }),
        ]
      }
    } else if ("name" in payload && "value" in payload) {
      const amount = getAAPayment(unit.messages, [governance_aa], asset1);
      return [
        i18n.t("trade.tabs.transactions.events.add_support_param", "Add support for the {{name}} value of {{value}}", { name, value: asPercentage ? Decimal(payload.value).mul(100).toNumber() + "%" : payload.value }),
        amount / 10 ** decimals1,
        amount && symbol1
      ]
    } else if ("withdraw" in payload) {
      const output = getAAPayment(unit.objResponseUnit.messages, [unit.trigger_address], asset1) / (10 ** decimals1);
      return [
        i18n.t("trade.tabs.transactions.events.withdraw_balance", "Withdraw balance from governance"),
        undefined,
        undefined,
        `${output} ${symbol1}`
      ]
    } else if ("name" in payload) {
      return [
        i18n.t("trade.tabs.transactions.events.remove_support_param", "Remove support for the {{name}}", { name }),
      ]
    }
  }

  if ("factory" in payload && "define" in payload) {
    return [i18n.t("trade.tabs.transactions.events.conf", "Configuration")]
  } else {
    return [i18n.t("trade.tabs.transactions.events.not_indent", "Unidentified")]
  }

}
