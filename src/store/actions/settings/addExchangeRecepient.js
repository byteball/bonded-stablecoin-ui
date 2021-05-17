import { ADD_EXCHANGE_RECEPIENT } from "../../types";

export const addExchangeRecepient = (recipient) => ({
  type: ADD_EXCHANGE_RECEPIENT,
  payload: recipient,
});
