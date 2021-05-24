import { isEqual } from "lodash";
import { ADD_TRACKED_EXCHANGES, REMOVE_TRACKED_EXCHANGE } from "store/types";

const initialState = {
  trackedExchanges: [],
  lastExchange: 0,
};

export const trackedReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TRACKED_EXCHANGES: {
      const activeExchanges = state?.trackedExchanges?.filter((item) => item.created_at < Date.now() + 1000 * 60 * 30) || [];
      return {
        ...state,
        trackedExchanges: [...activeExchanges, { ...action.payload }],
        lastExchange: action.payload.created_at
      }
    }
    case REMOVE_TRACKED_EXCHANGE: {
      const exchanges = state?.trackedExchanges?.filter((item) => !(item.aa === action.payload.aa && isEqual(item.payload, action.payload.aa) && (Number(action.payload.amount) === item.amount) && (action.payload.activeWallet ? item.activeWallet && (item.activeWallet === action.payload.activeWallet) : true)));
      return {
        ...state,
        trackedExchanges: exchanges
      }
    }
    default:
      return state;
  }
};
