import { ADD_NEW_TRANSACTION } from "store/types";

const types = ["curve", "depositOrStable", "governance", "de"];

export const addNotStableTransaction = ({ type, unit }) => async (dispatch) => {
  if (types.includes(type) && unit) {
      const payload = {
        trigger_address: unit.authors[0]?.address,
        ...unit,
        bounced: 0,
        trigger_unit: unit.unit,
        objResponseUnit: {},
        isStable: false
      }
      dispatch({
        type: ADD_NEW_TRANSACTION,
        payload,
        meta: { type, unit: unit.unit }
      });
  } else {
    return null
  }
}