import { ADD_STABLE_TRANSACTION, UPDATE_TRANSACTION } from "store/types";

const types = ["curve", "depositOrStable", "governance", "de"];

export const addStableTransaction = ({ type, response }) => async (dispatch, getState, socket) => {
  if (types.includes(type) && response) {
    let chain;
    const store = getState();
    if (type === "de" && response?.objResponseUnit?.unit) {
      chain = await socket.api.getAaResponseChain({
        trigger_unit: response.objResponseUnit.unit
      });
    }
    if (response.trigger_unit in store.active.transactions[type]) {
      dispatch({
        type: UPDATE_TRANSACTION,
        payload: {
          unit: response.trigger_unit,
          objResponseUnit: response.objResponseUnit,
          timestamp: response.timestamp,
          type,
          chain
        }
      })
    } else {
      const { trigger_unit, trigger_address, timestamp } = response;
      const { joint: { unit: trigger_unit_info } } = await socket.api.getJoint(trigger_unit);

      dispatch({
        type: ADD_STABLE_TRANSACTION,
        payload: {
          ...trigger_unit_info,
          isStable: true,
          objResponseUnit: response.objResponseUnit,
          bounced: response.bounced,
          trigger_address,
          timestamp,
          other: {
            chain
          }
        },
        meta: {
          type,
          unit: trigger_unit
        }
      })
    }
  } else {
    return null
  }
}