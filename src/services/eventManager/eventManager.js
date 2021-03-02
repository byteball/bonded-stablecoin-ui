import { isEqual } from "lodash";
import i18n from "../../locale/index";
import config from "config";
import { store } from "index";
import { tokensEventManager } from "./lowerManagers/tokens";
import { bondedEventManager } from "./lowerManagers/bonded";
import { depositsEventManager } from "./lowerManagers/deposits";
import { openNotification } from "utils/openNotification";
import { reqIssueStablecoin } from "store/actions/pendings/reqIssueStablecoin";
import { resCreateStable } from "store/actions/EVENTS/stable/resCreateStable";
import { governanceEventManager } from "./lowerManagers/governance";
import { addTransaction } from "store/actions/active/addTransaction";

const importantSubject = ["light/aa_request", "light/aa_response"];

export const eventManager = (err, result) => {
  if (err) return null;
  const { subject, body } = result[1];
  if (!subject || !importantSubject.includes(subject)) {
    return null;
  }
  const state = store.getState();
  const {
    address,
    deposit_aa,
    governance_aa,
    stable_state,
    deposit_state,
    governance_state,
    reserve_asset_symbol,
    symbol1,
    symbol2,
    symbol3,
  } = state.active;
  const { activeWallet } = state.settings;
  const { params } = state.pendings.stablecoin;

  if (!address) return null;
  const isReq = subject === "light/aa_request";
  const isRes = subject === "light/aa_response";
  const { aa_address } = body;
  if (aa_address === config.TOKEN_REGISTRY) {
    if (isReq) {
      const { messages } = body.unit;
      const payload = getAAPayload(messages);
      const assets = [
        stable_state.asset1,
        stable_state.asset2,
        deposit_state.asset,
      ];
      if ("asset" in payload && assets.includes(payload.asset))
        tokensEventManager({
          isReq,
          payload,
          isAuthor: body.unit.authors[0].address === activeWallet,
          type: assets.findIndex((current) => current === payload.asset) + 1,
        });
    } else if (isRes) {
      const { response, bounced } = body;
      if (bounced) return null;
      if ("responseVars" in response) {
        const vars = response.responseVars;
        let symbol;
        let type;
        if (stable_state.asset1 in vars && !symbol1) {
          type = 1;
          symbol = vars[stable_state.asset1];
        } else if (stable_state.asset2 in vars && !symbol2) {
          type = 2;
          symbol = vars[stable_state.asset2];
        } else if (deposit_state.asset in vars && !symbol3) {
          type = 3;
          symbol = vars[deposit_state.asset];
        }
        if (type !== undefined) {
          tokensEventManager({
            isRes,
            response: { symbol },
            type,
            isAuthor: body.trigger_address === activeWallet,
          });
        }
      }
    }
  } else if (config.FACTORY_AAS.includes(aa_address)) {
    if (isReq) {
      const { messages } = body.unit;
      const payload = getAAPayload(messages);
      const reserveAsset = payload.reserve_asset in config.reserves ? config.reserves[payload.reserve_asset].name : reserve_asset_symbol || payload.reserve_asset.slice(0, 6) + "...";
      if (isEqual(params, payload)) {
        openNotification(
          i18n.t("notification.create.req_author", "You have sent a request to create a new stablecoin pegged to {{feed_name}} with interest {{interest_rate}}%", {feed_name: payload.feed_name1 || reserveAsset, interest_rate: payload.interest_rate * 100 || 0})
        )
        store.dispatch(reqIssueStablecoin());
      } else {
        openNotification(
          i18n.t("notification.create.req", "Another user sent a request to create a new stablecoin pegged to {{feed_name}} with interest {{interest_rate}}%", {feed_name: payload.feed_name1 || reserveAsset, interest_rate: payload.interest_rate * 100 || 0})
        );
      }
    } else if (isRes) {
      const { response, bounced } = body;
      if (bounced) return null;
      const vars = response.responseVars;
      if (vars && "address" in vars && "asset_1" in vars && "asset_2" in vars) {
        store.dispatch(resCreateStable({ ...vars }));
      }
    }
  } else if (aa_address === address) {
    if (isReq) {
      const { messages } = body.unit;
      const payload = getAAPayload(messages);
      const { asset1, asset2 } = stable_state;
      bondedEventManager({
        isReq,
        payload,
        isAuthor: body.unit.authors[0].address === activeWallet,
        messages,
        asset1,
        asset2,
        params: state.active.params,
        symbol1,
        symbol2,
        symbol3,
      });

      store.dispatch(addTransaction({ type: "curve", isStable: false, AAReqOrRes: body.unit }))
    } else if (isRes) {
      store.dispatch(addTransaction({ type: "curve", isStable: true, AAReqOrRes: body }))
    }
  } else if (aa_address === deposit_aa) {
    if (isReq) {
      const { messages } = body.unit;
      const payload = getAAPayload(messages);
      const { asset } = deposit_state;
      const { asset2 } = stable_state;
      depositsEventManager({
        isReq,
        payload,
        asset2,
        asset,
        messages,
        isAuthor: body.unit.authors[0].address === activeWallet,
      });

      store.dispatch(addTransaction({ type: "deposit", isStable: false, AAReqOrRes: body.unit }))
    } else if (isRes) {
      store.dispatch(addTransaction({ type: "deposit", isStable: true, AAReqOrRes: body }))
    }
  } else if (aa_address === governance_aa) {
    if (isReq) {
      const { messages } = body.unit;
      const payload = getAAPayload(messages);
      governanceEventManager({
        isReq,
        payload,
        isAuthor: body.unit.authors[0].address === activeWallet,
        governance_state,
      });

      store.dispatch(addTransaction({ type: "governance", isStable: false, AAReqOrRes: body.unit }))
    } else if (isRes) {
      store.dispatch(addTransaction({ type: "governance", isStable: true, AAReqOrRes: body }))
    }
  }
};

export const getAAPayload = (messages = []) => messages.find(m => m.app === 'data')?.payload || {};

export const getAAPayment = (messages = [], list = [], asset, isExclude = false) => messages.find(m => (m.app === 'payment') && (m?.payload?.asset === asset || !asset || (asset === "base" && !m?.payload?.asset)))?.payload?.outputs.find((o) => {
  if (!isExclude) {
    return list.includes(o.address)
  } else {
    return !list.includes(o.address)
  }
})?.amount || 0;

export const getAAPaymentsSum = (messages = [], list = [], asset, isExclude = false) => messages.find(m => (m.app === 'payment') && (m?.payload?.asset === asset || (asset === "base" && !m?.payload?.asset)))?.payload?.outputs.filter((o) => {
  if (!isExclude) {
    return list.includes(o.address)
  } else {
    return !list.includes(o.address)
  }
}).reduce((accumulator, current) => {
  return accumulator + current.amount;
}, 0);