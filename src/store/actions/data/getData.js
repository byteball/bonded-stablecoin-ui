import { LOAD_SNAPSHOT_SUCCESS } from "store/types";

export const getData = (state, balances) =>({
  type: LOAD_SNAPSHOT_SUCCESS,
  payload: {state, balances}
});