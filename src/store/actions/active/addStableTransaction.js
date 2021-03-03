import { ADD_STABLE_TRANSACTION, UPDATE_TRANSACTION } from "store/types";

const types = ["curve", "deposit", "governance"];

export const addStableTransaction = ({ type, response }) => async (dispatch, getState, socket) => {
  if (types.includes(type) && response) {
      const store = getState();

      if (response.trigger_unit in store.active.transactions[type]) {
        dispatch({
          type: UPDATE_TRANSACTION,
          payload: {
            unit: response.trigger_unit,
            objResponseUnit: response.objResponseUnit,
            type
          }
        })
      } else {
        const { trigger_unit, trigger_address } = response;
        const { joint: { unit: trigger_unit_info } } = await socket.api.getJoint(trigger_unit);

        dispatch({
          type: ADD_STABLE_TRANSACTION,
          payload: {
            ...trigger_unit_info,
            isStable: true,
            objResponseUnit: response.objResponseUnit,
            bounced: response.bounced,
            trigger_address,
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