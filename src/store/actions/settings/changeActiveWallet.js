import { CHANGE_ACTIVE_WALLET } from "../../types";

export const changeActiveWallet = (address) => ({
  type: CHANGE_ACTIVE_WALLET,
  payload: address,
});
