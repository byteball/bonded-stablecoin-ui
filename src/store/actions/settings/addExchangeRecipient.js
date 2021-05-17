import { ADD_EXCHANGE_RECEPIENT } from "../../types";

export const addExchangeRecipient = (recipient) => ({
  type: ADD_EXCHANGE_RECEPIENT,
  payload: recipient,
});
