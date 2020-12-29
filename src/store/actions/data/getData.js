import { LOAD_SNAPSHOT_SUCCESS } from "store/types";

export const getData = data =>({
  type: LOAD_SNAPSHOT_SUCCESS,
  payload: data
});