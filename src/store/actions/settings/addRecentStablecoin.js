import { ADD_RECENT_STABLECOIN } from "../../types";

export const addRecentStablecoin = (address) => ({
  type: ADD_RECENT_STABLECOIN,
  payload: address,
});
