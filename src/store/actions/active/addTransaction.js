import { ADD_NEW_TRANSACTION, ADD_STABLE_TRANSACTION, UPDATE_TRANSACTION } from "store/types";

const types = ["curve", "deposit", "governance"];

export const addTransaction = ({ isStable, type, unit, response }) => async (dispatch, getState, socket) => {
  if (!response && !unit) return null

  if (types.includes(type)) {
    if (isStable) {
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
      const payload = {
        trigger_address: unit.authors[0]?.address,
        ...unit,
        bounced: 0,
        trigger_unit: unit.unit,
        objResponseUnit: {},
        isStable
      }
      dispatch({
        type: ADD_NEW_TRANSACTION,
        payload,
        meta: { type, unit: unit.unit }
      });
    }
  } else {
    return null
  }
}