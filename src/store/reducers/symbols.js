import { UPDATE_SYMBOLS_LIST } from "store/types";

const initialState = {};

export const symbolsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SYMBOLS_LIST: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state;
  }
};
