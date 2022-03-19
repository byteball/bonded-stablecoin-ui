import { CHANGE_ACTIVE, REQ_CHANGE_ACTIVE, UPDATE_ORACLES, LOAD_PREV_TRANSACTIONS, ADD_NEW_TRANSACTION, UPDATE_TRANSACTION, ADD_STABLE_TRANSACTION, UPDATE_FUND_BALANCE } from "../types";
import { EVENT_CREATE_TOKEN } from "../types/events";
import {
  CHANGE_BONDED_STATE,
  CHANGE_DEPOSIT_STATE,
  CHANGE_DE_STATE,
  CHANGE_FUND_STATE,
  CHANGE_GOVERNANCE_STATE,
  CHANGE_STABLE_STATE,
} from "../types/state";

const initialState = {
  address: undefined,
  deposit_aa: undefined,
  governance_aa: undefined,
  fund_aa: undefined,
  fund_balance: {},
  params: {},
  bonded_state: {},
  deposit_state: {},
  governance_state: {},
  fund_state: {},
  stable_state: {},
  de_state: {},
  oracleValue1: 0,
  oracleValue2: 0,
  oracleValue3: 0,
  reservePrice: 0,
  symbol1: false,
  symbol2: false,
  symbol3: false,
  symbol4: false,
  loading: false,
  transactions: {
    curve: {},
    depositOrStable: {},
    governance: {},
    de: {}
  }
};

export const activeReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQ_CHANGE_ACTIVE: {
      return {
        ...state,
        loading: true,
        address: action.payload
      }
    }
    case CHANGE_ACTIVE: {
      return {
        ...state,
        address: action.payload.address,
        params: action.payload.params,
        bonded_state: action.payload.bonded_state,
        deposit_state: action.payload.deposit_state,
        governance_state: action.payload.governance_state,
        fund_state: action.payload.fund_state,
        de_state: action.payload.de_state,
        stable_state: action.payload.stable_state,
        deposit_aa: action.payload.deposit_aa,
        governance_aa: action.payload.governance_aa,
        stable_aa: action.payload.stable_aa,
        fund_aa: action.payload.fund_aa,
        fund_balance: action.payload.fund_balance,
        base_governance: action.payload.base_governance,
        base_de: action.payload.base_de,
        symbol1: action.payload.symbol1,
        symbol2: action.payload.symbol2,
        symbol3: action.payload.symbol3,
        symbol4: action.payload.symbol4,
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
    case CHANGE_BONDED_STATE: {
      return {
        ...state,
        bonded_state: action.payload,
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
    case CHANGE_FUND_STATE: {
      return {
        ...state,
        fund_state: action.payload,
      };
    }
    case CHANGE_STABLE_STATE: {
      return {
        ...state,
        stable_state: action.payload,
      };
    }
    case CHANGE_DE_STATE: {
      return {
        ...state,
        de_state: action.payload,
      };
    }
    case UPDATE_FUND_BALANCE: {
      return {
        ...state,
        fund_balance: action.payload
      }
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
          depositOrStable: {
            ...state.transactions.depositOrStable,
            ...payload.depositOrStableUnits
          },
          governance: {
            ...state.transactions.governance,
            ...payload.governanceUnits
          },
          de: {
            ...state.transactions.de,
            ...payload.deUnits
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
      const { objResponseUnit, unit, type, chain } = action.payload;

      return {
        ...state,
        transactions: {
          ...state.transactions,
          [type]: {
            ...state.transactions[type],
            [unit]: {
              ...state.transactions[type][unit],
              isStable: true,
              objResponseUnit,
              other: {
                chain
              }
            }
          }
        }
      }
    }
    default:
      return state;
  }
};
