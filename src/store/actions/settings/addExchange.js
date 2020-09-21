import { ADD_EXCHANGE } from "../../types";

export const addExchange = (exchange) => ({
  type: ADD_EXCHANGE,
  payload: exchange,
});
