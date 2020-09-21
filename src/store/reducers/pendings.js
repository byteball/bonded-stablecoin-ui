import { CHANGE_ACTIVE } from "../types";
import { EVENT_PENDING_TOKEN } from "../types/events";
import {
  PENDING_ISSUE_STABLECOIN,
  RESET_ISSUE_STABLECOIN,
  REQUEST_ISSUE_STABLECOIN,
  RESPONSE_ISSUE_STABLECOIN,
} from "../types/pendings";

const initialState = {
  tokens1: false,
  tokens2: false,
  tokens3: false,
  stablecoin: {
    params: null,
    sendReq: false,
    addressIssued: false,
  },
};

export const pendingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_ACTIVE: {
      return {
        ...state,
        tokens1: false,
        tokens2: false,
        tokens3: false,
      };
    }
    case EVENT_PENDING_TOKEN: {
      return {
        ...state,
        ["tokens" + action.payload.type]: true,
      };
    }
    case PENDING_ISSUE_STABLECOIN: {
      return {
        ...state,
        stablecoin: { ...state.stablecoin, params: action.payload },
      };
    }
    case RESET_ISSUE_STABLECOIN: {
      return {
        ...state,
        stablecoin: initialState.stablecoin,
      };
    }
    case REQUEST_ISSUE_STABLECOIN: {
      return {
        ...state,
        stablecoin: { ...state.stablecoin, sendReq: true },
      };
    }
    case RESPONSE_ISSUE_STABLECOIN: {
      return {
        ...state,
        stablecoin: { ...state.stablecoin, addressIssued: action.payload },
      };
    }
    default:
      return state;
  }
};
