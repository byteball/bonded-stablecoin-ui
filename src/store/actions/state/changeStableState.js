import { CHANGE_STABLE_STATE } from "../../types/state";

export const changeStableState = (state) => ({
  type: CHANGE_STABLE_STATE,
  payload: state,
});
