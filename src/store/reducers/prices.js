import { UPDATE_PRICES } from "store/types";

const initialState = {
  prices: {},
  updated_at: 0
};

export const pricesReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PRICES: {
      return {
        prices: action.payload,
        updated_at: Date.now()
      }
    }
    default:
      return state;
  }
};
