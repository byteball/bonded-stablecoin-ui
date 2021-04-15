import { CHANGE_BONDED_STATE } from "../../types/state";

export const changeBondedState = (state) => ({
  type: CHANGE_BONDED_STATE,
  payload: state,
});
