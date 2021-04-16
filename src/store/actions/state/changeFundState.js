import { CHANGE_FUND_STATE } from "../../types/state";

export const changeFundState = (state) => ({
  type: CHANGE_FUND_STATE,
  payload: state,
});
