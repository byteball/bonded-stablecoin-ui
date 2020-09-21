import { ADD_WALLET } from "../../types";

export const addWallet = (address) => ({
  type: ADD_WALLET,
  payload: address,
});
