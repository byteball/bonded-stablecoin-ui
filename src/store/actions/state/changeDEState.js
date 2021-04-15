import { CHANGE_DE_STATE } from "../../types/state";

export const changeDEState = (state) => ({
  type: CHANGE_DE_STATE,
  payload: state,
});
