import Decimal from "decimal.js";
import { isEmpty } from "lodash";
import { getAAPayload, getAAPayment, getAAPaymentsSum } from "services/eventManager/eventManager";

import i18n from "../locale/index";

export const eventIdentification = (type, unit, params, _, active) => {

  if (!unit) return null

  const { symbol1, symbol2, symbol3, symbol4, bonded_state, governance_state, reserve_asset_symbol, address,
    deposit_aa, governance_aa, deposit_state, stable_state, stable_aa, fund_state } = active;
  const { asset1, asset2 } = bonded_state;
  
  const asset = stable_state?.asset || deposit_state?.asset
  const de = bonded_state?.decision_engine_aa;

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
    } else if (isEmpty(payload) || "to" in payload || "max_fee_percent" in payload || "notifyDE" in payload) {

      let inputT1;
      let inputT2;
      let pendingAmount = "[pending]";

      for (const message in messages) {
        const msg = messages[message];

        if (msg.app === "payment" && "asset" in msg.payload) {
          const asset = msg.payload.asset;
          if (asset === asset1) {
            inputT1 = getAAPayment(unit.messages, [address, deposit_aa, governance_aa], asset1);
          } else if (asset === asset2) {
            inputT2 = getAAPayment(unit.messages, [address, deposit_aa, governance_aa], asset2);
          }
        }
      }
      if (inputT1 || inputT2) {

        if (unit.objResponseUnit) {
          pendingAmount = getAAPayment(unit.objResponseUnit.messages, [payload.to || unit.trigger_address], reserve_asset) / (10 ** reserve_asset_decimals);
        }

        return [
          i18n.t("trade.tabs.transactions.events.redeem", "Redeem tokens"),
          `${inputT1 ? (inputT1 / 10 ** decimals1) + " " + symbol1 : ""} ${inputT2 ? (inputT2 / 10 ** decimals2) + " " + symbol2 : ""}`,
          "",
          pendingAmount + " " + reserve_asset_symbol,
          payload.to || unit.trigger_address
        ]
      }
    } else if ("name" in payload && "value" in payload) {
      return [
        i18n.t("trade.tabs.transactions.events.change_param_auto", "Change {{name}} to {{value}}", { name, value: payload.value })
      ]
    } else if ("notifyDE" in payload) {
      return [
        i18n.t("trade.tabs.transactions.events.notifyDE", "Notify Decision Engine")
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
          `${output} ${symbol3}`,
          payload.to
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
  } else if (type === "stable") {
    let action; // "buy" or "sell"
    for (const message in messages) {
      const msg = messages[message];
      if (msg.app === "payment" && "asset" in msg.payload) {
        const assetInPayload = msg.payload.asset;
        if (assetInPayload === asset2) {
          action = "buy"
        } else if (assetInPayload === asset) {
          action = "sell"
        }
      }
    }
    if (action === "buy") {
      const amount = getAAPayment(unit.messages, payload.to ? [stable_aa] : [address, stable_aa, governance_aa], asset2) / 10 ** decimals2;
      const output = unit?.objResponseUnit?.messages ? getAAPayment(unit.objResponseUnit.messages, [payload.to || unit.trigger_address], asset) / 10 ** decimals2 : "[pending]";

      return [
        i18n.t("trade.tabs.transactions.events.buy_stable", "Buy {{symbol}}", { symbol: symbol3 }),
        amount,
        symbol2,
        `${output} ${symbol3}`,
        payload.to
      ];
    } else if (action === "sell") {
      const amount = getAAPayment(unit.messages, [address, stable_aa, governance_aa], asset);
      const output = unit?.objResponseUnit?.messages ? getAAPayment(unit.objResponseUnit.messages, [unit.trigger_address], asset2) / (10 ** decimals2) : "[pending]";
      const forwardOutput = !output && getAAPayment(unit.objResponseUnit.messages, [address], asset2) / 10 ** decimals2;
      return [
        i18n.t("trade.tabs.transactions.events.sell_stable", "Sell {{symbol}}", { symbol: symbol3 }),
        amount / 10 ** decimals2,
        symbol3,
        `${forwardOutput || output} ${symbol2}`
      ];
    }
  } else if (type === "de") {
    if (("act" in payload)) {
      return [i18n.t("trade.tabs.transactions.events.fix_price", "Fix price")]
    } if ("tx" in payload && unit.trigger_address === address){
      return [i18n.t("trade.tabs.transactions.events.notifyDE", "Notify Decision Engine")]
    }
    else {
      let action; // "buy" or "redeem"
      for (const message in messages) {
        const msg = messages[message];
        if (msg.app === "payment" && "asset" in msg.payload) {
          const assetInPayload = msg.payload.asset;
          if (assetInPayload === fund_state.shares_asset) {
            action = "redeem"
          }
        } else {
          action = "buy"
        }
      }

      const info = unit?.objResponseUnit?.messages?.find((m) => m.app === "data")?.payload?.payments[0];

      if (action === "buy") {
        const amount = getAAPaymentsSum(unit.messages, [de], reserve_asset);

        let output = info ? info.amount / 10 ** reserve_asset_decimals : undefined;
        return [
          i18n.t("trade.tabs.transactions.events.buy_shares", "Buy {{symbol}}", { symbol: symbol4 }),
          amount / 10 ** reserve_asset_decimals,
          reserve_asset_symbol,
          output ? `${output} ${symbol4}` : "[pending]"
        ];

      } else if (action === "redeem") {
        const amount = getAAPayment(unit.messages, [de], fund_state.shares_asset);
        const outputResponse = unit?.other?.chain ? unit?.other?.chain.find((item)=>item.objResponseUnit?.messages?.[0]?.payload?.payments?.[0].asset === "base") : undefined;
        const output = outputResponse && outputResponse.objResponseUnit.messages[0].payload.payments[0].amount / 10 ** reserve_asset_decimals;

        return [
          i18n.t("trade.tabs.transactions.events.sell_shares", "Sell {{symbol}}", { symbol: symbol4 }),
          amount / 10 ** reserve_asset_decimals,
          symbol4,
          output ? `${output} ${reserve_asset_symbol}` : "[pending]",
        ]
      }
    }
  }

  if ("factory" in payload && "define" in payload) {
    return [i18n.t("trade.tabs.transactions.events.conf", "Configuration")]
  } else {
    return [i18n.t("trade.tabs.transactions.events.not_indent", "Unidentified")]
  }

}
