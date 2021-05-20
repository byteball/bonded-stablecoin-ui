import { LOAD_SNAPSHOT_SUCCESS } from "store/types";
import { changeActive } from "../active/changeActive";

export const getData = (state, balances) => async (dispatch, getState) => {
  const store = getState();

  dispatch({
    type: LOAD_SNAPSHOT_SUCCESS,
    payload: { state, balances }
  })

  if (store.active.address) {
    dispatch(changeActive(store.active.address))
  }

};