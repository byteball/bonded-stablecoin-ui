import { REMOVE_TRACKED_EXCHANGE } from "store/types";

export const removeTrackedExchange = (current) => ({
  type: REMOVE_TRACKED_EXCHANGE,
  payload: current
})