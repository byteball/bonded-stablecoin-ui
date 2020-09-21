import { isEqual } from "lodash";

import config from "config";
import { store } from "index";
import { tokensEventManager } from "./lowerManagers/tokens";
import { changeStableState } from "store/actions/state/changeStableState";
import { changeDepositState } from "store/actions/state/changeDepositState";
import { changeGovernanceState } from "store/actions/state/changeGovernanceState";
import { bondedEventManager } from "./lowerManagers/bonded";
import { depositsEventManager } from "./lowerManagers/deposits";
import { openNotification } from "utils/openNotification";
import { reqIssueStablecoin } from "store/actions/pendings/reqIssueStablecoin";
import { resCreateStable } from "store/actions/EVENTS/stable/resCreateStable";
import { governanceEventManager } from "./lowerManagers/governance";

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
    symbol1,
    symbol2,
    symbol3,
  } = state.active;
  const { activeWallet } = state.settings;
  const { params } = state.pendings.stablecoin;

  if (!address) return null;
  const isReq = subject === "light/aa_request";
  const isRes = subject === "light/aa_response";
  const { aa_address, updatedStateVars } = body;
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
  } else if (aa_address === config.FACTORY_AA) {
    if (isReq) {
      const { messages } = body.unit;
      const payload = getAAPayload(messages);
      if (isEqual(params, payload)) {
        openNotification(`You have sent a request to create a new stablecoin pegged to ${payload.feed_name1} with interest ${payload.interest_rate}%
        `);

        store.dispatch(reqIssueStablecoin());
      } else {
        openNotification(
          `Another user sent a request to create a new stablecoin pegged to ${payload.feed_name1} with interest ${payload.interest_rate}%`
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
    if (isRes) {
      if (updatedStateVars && address in updatedStateVars) {
        updatedState({
          updatedStateVars,
          governance_aa,
          stable_aa: address,
          deposit_aa,
        });
      }
    } else if (isReq) {
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
      });
    }
  } else if (aa_address === deposit_aa) {
    if (isRes) {
      if (updatedStateVars && deposit_aa in updatedStateVars) {
        updatedState({
          updatedStateVars,
          governance_aa,
          stable_aa: address,
          deposit_aa,
        });
      }
    } else if (isReq) {
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
    }
  } else if (aa_address === governance_aa) {
    if (isRes) {
      if (updatedStateVars && governance_aa in updatedStateVars) {
        updatedState({
          updatedStateVars,
          governance_aa,
          stable_aa: address,
          deposit_aa,
        });
      }
    } else if (isReq) {
      const { messages } = body.unit;
      const payload = getAAPayload(messages);
      governanceEventManager({
        isReq,
        payload,
        isAuthor: body.unit.authors[0].address === activeWallet,
        governance_state,
      });
    }
  }
};

const getAAPayload = (messages) => {
  /* eslint array-callback-return: "off" */
  const payloads = messages.map((message) => {
    if (message.app === "data") {
      return message.payload || {};
    }
  });

  return payloads[0] || {};
};

const updatedState = ({
  updatedStateVars,
  governance_aa,
  stable_aa,
  deposit_aa,
}) => {
  let changeState = {};

  if (updatedStateVars) {
    for (let address in updatedStateVars) {
      changeState[address] = {};
      for (let vars in updatedStateVars[address]) {
        const value =
          updatedStateVars[address][vars].value !== false
            ? updatedStateVars[address][vars].value
            : undefined;
        changeState[address][vars] = value;
      }
    }
  }

  if (governance_aa in changeState) {
    store.dispatch(changeGovernanceState(changeState[governance_aa]));
  }
  if (stable_aa in changeState) {
    store.dispatch(changeStableState(changeState[stable_aa]));
  }
  if (deposit_aa in changeState) {
    store.dispatch(changeDepositState(changeState[deposit_aa]));
  }
};
