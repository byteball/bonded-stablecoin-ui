import { CHANGE_CARBURETOR_BALANCE } from "store/types";

export const changeCarburetorBalance = (state) => ({
  type: CHANGE_CARBURETOR_BALANCE,
  payload: state,
});
