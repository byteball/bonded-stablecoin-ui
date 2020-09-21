import { UPDATE_EXCHANGE_FORM } from "../../types";

export const updateExchangesForm = (payload) => {
  return {
    type: UPDATE_EXCHANGE_FORM,
    payload: payload,
  };
};
