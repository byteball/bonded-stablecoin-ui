import { EVENT_CREATE_TOKEN } from "../../../types/events";

export const resCreateToken = ({ symbol, type }) => {
  return {
    type: EVENT_CREATE_TOKEN,
    payload: { type, symbol },
  };
};
