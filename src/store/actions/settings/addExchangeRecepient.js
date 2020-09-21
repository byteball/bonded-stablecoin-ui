import { ADD_EXCHANGE_RECEPIENT } from "../../types";

export const addExchangeRecepient = (recepinet) => ({
  type: ADD_EXCHANGE_RECEPIENT,
  payload: recepinet,
});
