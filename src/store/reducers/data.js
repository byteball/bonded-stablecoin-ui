import { LOAD_SNAPSHOT_FAILURE, LOAD_SNAPSHOT_REQUEST, LOAD_SNAPSHOT_SUCCESS, UPDATE_SNAPSHOT } from "../types";

const initialState = {
  data: {},
  loading: false,
  loaded: false,
  error: false
};

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SNAPSHOT_REQUEST: {
      return {
        ...state,
        data: action.payload,
        loading: true,
        loaded: false,
        error: false
      };
    }
    case LOAD_SNAPSHOT_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false,
        loaded: true,
        error: false
      };
    }
    case LOAD_SNAPSHOT_FAILURE: {
      return {
        ...state,
        loaded: false,
        error: true
      }
    }
    case UPDATE_SNAPSHOT: {
      const rows = action.payload;
      const newState = { ...state.data, ...action.payload };
      for (const row in rows) {
        if (rows[row] === undefined || rows[row] === false) {
          delete newState[row];
        }
      }
      return {
        ...state,
        data: newState,
      };
    }
    default:
      return state;
  }
};
