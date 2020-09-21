import { CHANGE_ACTIVE, UPDATE_ORACLES } from "../types";
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
};

export const activeReducer = (state = initialState, action) => {
  switch (action.type) {
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
        symbol1: action.payload.symbol1,
        symbol2: action.payload.symbol2,
        symbol3: action.payload.symbol3,
        reservePrice: action.payload.reservePrice,
        oraclePrice: action.payload.oraclePrice,
        oracleValue1: action.payload.oracleValue1,
        oracleValue2: action.payload.oracleValue2,
        oracleValue3: action.payload.oracleValue3,
      };
    }
    case EVENT_CREATE_TOKEN: {
      return {
        ...state,
        ["symbol" + action.payload.type]: action.payload.symbol,
      };
    }
    case CHANGE_STABLE_STATE: {
      const rows = action.payload;
      const newState = { ...state.stable_state, ...action.payload };
      for (const row in rows) {
        if (rows[row] === undefined || rows[row] === false) {
          delete newState[row];
        }
      }
      return {
        ...state,
        stable_state: newState,
      };
    }
    case CHANGE_DEPOSIT_STATE: {
      const rows = action.payload;
      const newState = { ...state.deposit_state, ...action.payload };
      for (const row in rows) {
        if (rows[row] === undefined || rows[row] === false) {
          delete newState[row];
        }
      }
      return {
        ...state,
        deposit_state: newState,
      };
    }
    case CHANGE_GOVERNANCE_STATE: {
      const rows = action.payload;
      const newState = { ...state.governance_state, ...action.payload };
      for (const row in rows) {
        if (rows[row] === undefined || rows[row] === false) {
          delete newState[row];
        }
      }
      return {
        ...state,
        governance_state: newState,
      };
    }
    case UPDATE_ORACLES: {
      return {
        ...state,
        oraclePrice: action.payload,
      };
    }
    default:
      return state;
  }
};
