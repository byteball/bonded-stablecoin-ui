import { ADD_NEW_TRANSACTION, ADD_STABLE_TRANSACTION, UPDATE_TRANSACTION } from "store/types";

const types = ["curve", "deposit", "governance"];

export const addTransaction = ({isStable, type, AAReqOrRes}) => async (dispatch, getState, socket) => {
  if(!AAReqOrRes) return null
  if(types.includes(type)){
    if (isStable) {
    const store = getState();
    
    if(AAReqOrRes.trigger_unit in store.active.transactions[type]){
      dispatch({
        type: UPDATE_TRANSACTION,
        payload: {
          unit: AAReqOrRes.trigger_unit,
          objResponseUnit: AAReqOrRes.objResponseUnit,
          type
        }
      })
    } else {
      const {trigger_unit, trigger_address} = AAReqOrRes;
      const { joint: { unit: trigger_unit_info } } = await socket.api.getJoint(trigger_unit);

      dispatch({
        type: ADD_STABLE_TRANSACTION,
        payload: {
          ...trigger_unit_info,
          isStable: true,
          objResponseUnit: AAReqOrRes.objResponseUnit,
          bounced: AAReqOrRes.bounced,
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
        trigger_address: AAReqOrRes.authors[0]?.address,
        ...AAReqOrRes,
        bounced: 0,
        trigger_unit: AAReqOrRes.unit,
        objResponseUnit: {},
        isStable
      }
      dispatch({
        type: ADD_NEW_TRANSACTION,
        payload,
        meta: {type, unit: AAReqOrRes.unit}
      });
    }
  } else {
    return null
  }
}