import { OPEN_CONNECTION, CLOSE_CONNECTION } from "../types";
const initialState = false;

export const connectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_CONNECTION: {
      return true;
    }
    case CLOSE_CONNECTION: {
      return false;
    }
    default:
      return state;
  }
};
