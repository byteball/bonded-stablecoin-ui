import { CHANGE_ACTIVE, REQ_CHANGE_ACTIVE, UPDATE_ORACLES, LOAD_PREV_TRANSACTIONS, ADD_NEW_TRANSACTION, UPDATE_TRANSACTION, ADD_STABLE_TRANSACTION } from "../types";
import { EVENT_CREATE_TOKEN } from "../types/events";
import {
  CHANGE_STABLE_STATE,
  CHANGE_DEPOSIT_STATE,
  CHANGE_GOVERNANCE_STATE,
} from "../types/state";

const initialState = {
  address: undefined,
  deposit_aa: undefined,
  governance_aa: undefined,
  params: {},
  stable_state: {},
  deposit_state: {},
  governance_state: {},
  oracleValue1: 0,
  oracleValue2: 0,
  oracleValue3: 0,
  reservePrice: 0,
  symbol1: false,
  symbol2: false,
  symbol3: false,
  loading: false,
  transactions: {
    curve: {},
    deposit: {},
    governance: {}
  }
};

export const activeReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQ_CHANGE_ACTIVE: {
      return {
        ...state,
        loading: true
      }
    }
    case CHANGE_ACTIVE: {
      return {
        ...state,
        address: action.payload.address,
        params: action.payload.params,
        stable_state: action.payload.stable_state,
        deposit_state: action.payload.deposit_state,
        governance_state: action.payload.governance_state,
        deposit_aa: action.payload.deposit_aa,
        governance_aa: action.payload.governance_aa,
        base_governance: action.payload.base_governance,
        symbol1: action.payload.symbol1,
        symbol2: action.payload.symbol2,
        symbol3: action.payload.symbol3,
        reserve_asset_symbol: action.payload.reserve_asset_symbol,
        reservePrice: action.payload.reservePrice,
        oraclePrice: action.payload.oraclePrice,
        oracleValue1: action.payload.oracleValue1,
        oracleValue2: action.payload.oracleValue2,
        oracleValue3: action.payload.oracleValue3,
        transactions: initialState.transactions,
        loading: false
      };
    }
    case EVENT_CREATE_TOKEN: {
      return {
        ...state,
        ["symbol" + action.payload.type]: action.payload.symbol,
      };
    }
    case CHANGE_STABLE_STATE: {
      return {
        ...state,
        stable_state: action.payload,
      };
    }
    case CHANGE_DEPOSIT_STATE: {
      return {
        ...state,
        deposit_state: action.payload,
      };
    }
    case CHANGE_GOVERNANCE_STATE: {
      return {
        ...state,
        governance_state: action.payload,
      };
    }
    case UPDATE_ORACLES: {
      return {
        ...state,
        oraclePrice: action.payload,
      };
    }
    case LOAD_PREV_TRANSACTIONS: {
      const { payload } = action;
      
      return {
        ...state,
        transactions: {
          curve: {
            ...state.transactions.curve,
            ...payload.curveUnits
          },
          deposit: {
            ...state.transactions.deposit,
            ...payload.depositUnits
          },
          governance: {
            ...state.transactions.governance,
            ...payload.governanceUnits
          }
        }
      }
    }
    case ADD_NEW_TRANSACTION: {
      const { payload, meta: { type, unit } } = action;

      return {
        ...state,
        transactions: {
          ...state.transactions,
          [type]: {
            ...state.transactions[type],
            [unit]: payload
          }
        }
      }
    }
    case ADD_STABLE_TRANSACTION: {
      const { payload, meta: { type, unit } } = action;

      return {
        ...state,
        transactions: {
          ...state.transactions,
          [type]: {
            ...state.transactions[type],
            [unit]: payload
          }
        }
      }
    }

    case UPDATE_TRANSACTION: {
      const { objResponseUnit, unit, type } = action.payload;

      return {
        ...state,
        transactions: {
          ...state.transactions,
          [type]: {
            ...state.transactions[type],
            [unit]: {
              ...state.transactions[type][unit],
              isStable: true,
              objResponseUnit
            }
          }
        }
      }
    }
    default:
      return state;
  }
};
