import { CHANGE_DEPOSIT_STATE } from "../../types/state";

export const changeDepositState = (state) => ({
  type: CHANGE_DEPOSIT_STATE,
  payload: state,
});
