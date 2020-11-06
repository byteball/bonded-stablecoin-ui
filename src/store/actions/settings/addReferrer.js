import { ADD_REFERRER } from "store/types";

export const addReferrer = (address) => ({
  type: ADD_REFERRER,
  payload: address,
});
  