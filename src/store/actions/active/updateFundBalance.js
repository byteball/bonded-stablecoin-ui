import { UPDATE_FUND_BALANCE } from "store/types";

export const updateFundBalance = (state) => ({
  type: UPDATE_FUND_BALANCE,
  payload: state
});
