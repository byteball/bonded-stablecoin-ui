import config from "config";
import { CHANGE_CARBURETOR, CLEAR_CARBURETOR } from "store/types";

export const changeCarburetor = (address) => async (dispatch, getStore, socket) => {
  const carburetors = await socket.api.getAaStateVars({ address: config.CARBURETOR_FACTORY, var_prefix: `carburetor_${address}` });
  const carburetorForAddress = carburetors[`carburetor_${address}`] || null;
  const state = getStore();
  if (carburetorForAddress) {
    const carburetor_balance = state.data.balances?.[carburetorForAddress] || {};

    dispatch({
      type: CHANGE_CARBURETOR,
      payload: {
        address: carburetorForAddress,
        carburetor_balance
      }
    });

  } else {
    dispatch({
      type: CLEAR_CARBURETOR
    });
  }
};