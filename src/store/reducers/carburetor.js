import { CLEAR_CARBURETOR, CHANGE_CARBURETOR, CHANGE_CARBURETOR_BALANCE } from "store/types"
const initialState = {
  address: null,
  carburetor_balance: {},
  pending: {
    tokens1: 0,
    tokens2: 0,
    create: false
  }
};

export const carburetorReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_CARBURETOR: {
      return initialState;
    }
    case CHANGE_CARBURETOR: {
      return {
        ...state,
        address: action.payload.address,
        carburetor_balance: action.payload.carburetor_balance
      }
    }
    case CHANGE_CARBURETOR_BALANCE: {
      return {
        ...state,
        carburetor_balance: action.payload
      };
    }
    default:
      return state;

  }
};
