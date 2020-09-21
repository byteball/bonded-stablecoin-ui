import {
  ADD_WALLET,
  CHANGE_ACTIVE_WALLET,
  CHANGE_ACTIVE,
  ADD_RECENT_STABLECOIN,
  ADD_EXCHANGE,
  ADD_EXCHANGE_RECEPIENT,
  ADD_EXCHANGE_PENDING,
  REMOVE_EXCHANGE_PENDING,
  UPDATE_EXCHANGE_FORM,
} from "../types";

const initialState = {
  wallets: [],
  activeWallet: null,
  recent: null,
  recentList: [],
  exchanges: [],
  exchanges_recepient: undefined,
  pendingExchanges: undefined,
  exchangesFormInit: {
    currentToken: undefined,
    amountToken: undefined,
    currentCurrency: undefined,
    amountCurrency: undefined,
  },
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_WALLET: {
      if (!state.wallets.find((w) => w === action.payload)) {
        return {
          ...state,
          wallets: [...state.wallets, action.payload],
          activeWallet: action.payload,
        };
      } else {
        return state;
      }
    }
    case CHANGE_ACTIVE_WALLET: {
      return {
        ...state,
        activeWallet: action.payload,
      };
    }
    case CHANGE_ACTIVE: {
      return {
        ...state,
        recent: action.payload.address,
      };
    }
    case ADD_RECENT_STABLECOIN: {
      const address = action.payload;
      let newRecentStablecoins = [...state.recentList];
      const findAaInRecent = newRecentStablecoins.findIndex(
        (aa) => aa === address
      );
      if (findAaInRecent === -1) {
        if (newRecentStablecoins && newRecentStablecoins.length >= 5) {
          newRecentStablecoins.pop();
        }
        newRecentStablecoins.unshift(address);
      } else {
        [newRecentStablecoins[0], newRecentStablecoins[findAaInRecent]] = [
          newRecentStablecoins[findAaInRecent],
          newRecentStablecoins[0],
        ];
      }
      return {
        ...state,
        recentList: newRecentStablecoins,
      };
    }
    case ADD_EXCHANGE: {
      return {
        ...state,
        exchanges: [...state.exchanges, action.payload],
      };
    }
    case ADD_EXCHANGE_RECEPIENT: {
      return {
        ...state,
        exchanges_recepient: action.payload,
      };
    }
    case ADD_EXCHANGE_PENDING: {
      return {
        ...state,
        pendingExchanges: action.payload,
      };
    }
    case REMOVE_EXCHANGE_PENDING: {
      return {
        ...state,
        pendingExchanges: undefined,
      };
    }
    case UPDATE_EXCHANGE_FORM: {
      return {
        ...state,
        exchangesFormInit: { ...action.payload },
      };
    }
    default:
      return state;
  }
};
