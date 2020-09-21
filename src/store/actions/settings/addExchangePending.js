import { ADD_EXCHANGE_PENDING } from "../../types";

export const addExchangePending = (id) => ({
  type: ADD_EXCHANGE_PENDING,
  payload: id,
});
