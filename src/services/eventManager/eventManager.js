import i18n from "../../locale/index";
import config from "config";
import { store } from "index";
import { tokensEventManager } from "./lowerManagers/tokens";
import { bondedEventManager } from "./lowerManagers/bonded";
import { depositsEventManager } from "./lowerManagers/deposits";
import { stableEventManager } from "./lowerManagers/stable";
import { deEventManager } from "./lowerManagers/de";
import { openNotification } from "utils/openNotification";
import { reqIssueStablecoin } from "store/actions/pendings/reqIssueStablecoin";
import { resCreateStable } from "store/actions/EVENTS/stable/resCreateStable";
import { governanceEventManager } from "./lowerManagers/governance";
import { addNotStableTransaction } from "store/actions/active/addNotStableTransaction";
import { addStableTransaction } from "store/actions/active/addStableTransaction";
import { isEqual } from "lodash";
import ReactGA from "react-ga";
import { removeTrackedExchange } from "store/actions/tracked/removeTrackedExchange";

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
    bonded_state,
    deposit_state,
    stable_state,
    governance_state,
    reserve_asset_symbol,
    symbol1,
    symbol2,
    symbol3,
    symbol4,
    fund_state,
    stable_aa,
    params: paramsStablecoin
  } = state.active;
  const { activeWallet } = state.settings;
  const { trackedExchanges, lastExchange } = state.tracked;
  const { params } = state.pendings.stablecoin;
  const { aa_address } = body;

  const isReq = subject === "light/aa_request";
  const isRes = subject === "light/aa_response";

  const expiresIn = 5; // min

  if (isReq && (lastExchange > (Date.now() - 1000 * 60 * expiresIn))) {
    const author = body.unit.authors[0]?.address;
    const sentPayload = getAAPayload(body.unit.messages);

    const current = trackedExchanges.find((item) => item.created_at > (Date.now() - 1000 * 60 * expiresIn) && (item.aa === aa_address) && isEqual(item.payload, sentPayload) && (getAAPayment(body.unit.messages, [item.aa], item.fromAsset) === Number(item.amount)) && (activeWallet ? activeWallet === author : true));

    if (current) {
      const { label, action, category } = current;

      ReactGA.event({
        category: category + " request",
        action,
        label,
        value: 1,
      });

      store.dispatch(removeTrackedExchange(current));
    }

  }

  if (!address && !config.FACTORY_AAS.includes(aa_address)) return null;

  const de_aa = bonded_state?.decision_engine_aa;

  if (aa_address === config.TOKEN_REGISTRY) {
    if (isReq) {
      const { messages } = body.unit;
      const payload = getAAPayload(messages);
      const assets = [
        bonded_state.asset1,
        bonded_state.asset2,
        stable_state?.asset || deposit_state?.asset,
      ];

      if (fund_state?.shares_asset) {
        assets.push(fund_state.shares_asset);
      }

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
        if (bonded_state.asset1 in vars && !symbol1) {
          type = 1;
          symbol = vars[bonded_state.asset1];
        } else if (bonded_state.asset2 in vars && !symbol2) {
          type = 2;
          symbol = vars[bonded_state.asset2];
        } else if (deposit_state?.asset && (deposit_state.asset in vars) && !symbol3) {
          type = 3;
          symbol = vars[deposit_state.asset];
        } else if (stable_state?.asset && (stable_state.asset in vars) && !symbol3) {
          type = 3;
          symbol = vars[stable_state.asset];
        } else if (fund_state?.shares_asset && (fund_state.shares_asset in vars) && !symbol4) {
          type = 4;
          symbol = vars[fund_state.shares_asset];
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

      if (isPendingStablecoin(params, payload)) {
        openNotification(
          i18n.t("notification.create.req_author", "You have sent a request to create a new stablecoin pegged to {{feed_name}} with interest {{interest_rate}}%", { feed_name: payload.feed_name1 || reserveAsset, interest_rate: payload.interest_rate * 100 || 0 })
        )
        store.dispatch(reqIssueStablecoin());
      } else {
        openNotification(
          i18n.t("notification.create.req", "Another user sent a request to create a new stablecoin pegged to {{feed_name}} with interest {{interest_rate}}%", { feed_name: payload.feed_name1 || reserveAsset, interest_rate: payload.interest_rate * 100 || 0 })
        );
      }
    } else if (isRes) {
      const { response, bounced } = body;
      if (bounced) return null;
      const vars = response.responseVars;
      if (vars && ("address" in vars) && ("asset_1" in vars) && ("asset_2" in vars)) {
        store.dispatch(resCreateStable({ ...vars }));
      }
    }
  } else if (aa_address === address) {
    if (isReq) {
      const { messages } = body.unit;
      const payload = getAAPayload(messages);
      const { asset1, asset2 } = bonded_state;
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
        stable_aa,
        deposit_aa,
        rate_update_ts: bonded_state.rate_update_ts,
        growth_factor: bonded_state.growth_factor,
        interest_rate: paramsStablecoin.interest_rate
      });

      store.dispatch(addNotStableTransaction({ type: "curve", unit: body.unit }));
    } else if (isRes) {
      store.dispatch(addStableTransaction({ type: "curve", response: body }))
    }
  } else if (aa_address === deposit_aa) {
    if (isReq) {
      const { messages } = body.unit;
      const payload = getAAPayload(messages);
      const { asset } = deposit_state;
      const { asset2 } = bonded_state;
      depositsEventManager({
        isReq,
        payload,
        asset2,
        asset,
        messages,
        isAuthor: body.unit.authors[0].address === activeWallet,
      });

      store.dispatch(addNotStableTransaction({ type: "depositOrStable", unit: body.unit }));
    } else if (isRes) {
      store.dispatch(addStableTransaction({ type: "depositOrStable", response: body }))
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
      store.dispatch(addNotStableTransaction({ type: "governance", unit: body.unit }));
    } else if (isRes) {
      store.dispatch(addStableTransaction({ type: "governance", response: body }))
    }
  } else if (aa_address === stable_aa) {
    if (isReq) {
      const { messages } = body.unit;
      const { asset } = stable_state;
      const { asset2 } = bonded_state;
      stableEventManager({
        isReq,
        asset,
        asset2,
        messages,
        symbol3,
        stable_aa,
        decimals2: paramsStablecoin.decimals2,
        interest_rate: paramsStablecoin.interest_rate,
        rate_update_ts: bonded_state.rate_update_ts,
        growth_factor: bonded_state.growth_factor,
        isAuthor: body.unit.authors[0].address === activeWallet,
      });

      store.dispatch(addNotStableTransaction({ type: "depositOrStable", unit: body.unit }));
    } else if (isRes) {
      store.dispatch(addStableTransaction({ type: "depositOrStable", response: body }))
    }
  } else if (de_aa && aa_address === de_aa) {
    if (isReq) {
      const { messages } = body.unit;
      const payload = getAAPayload(messages);
      const { asset } = stable_state;
      const { asset2 } = bonded_state;
      deEventManager({
        isReq,
        payload,
        asset,
        asset2,
        messages,
        symbol4,
        shares_asset: fund_state?.shares_asset,
        decimals2: paramsStablecoin.decimals2,
        reserve_asset: paramsStablecoin.reserve_asset,
        decision_engine_aa: bonded_state.decision_engine_aa,
        reserve_asset_decimals: paramsStablecoin.reserve_asset_decimals,
        isAuthor: body.unit.authors[0].address === activeWallet,
        reserve_asset_symbol
      });

      store.dispatch(addNotStableTransaction({ type: "de", unit: body.unit }));
    } else if (isRes) {
      store.dispatch(addStableTransaction({ type: "de", response: body }))
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

/* eslint eqeqeq: "off" */
const isPendingStablecoin = (p, a) => {
  if (!p || !a) return false;

  if (a.decimals1 == p.decimals1 &&
    a.decimals2 == p.decimals2 &&
    a.interest_rate == p.interest_rate &&
    a.feed_name1 === p.feed_name1 &&
    a.op1 === p.op1 &&
    a.m === p.m &&
    a.n === p.n &&
    a.reserve_asset === p.reserve_asset) {
    return true
  }
}