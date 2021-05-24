import { isNil, omitBy } from "lodash";
import { ADD_TRACKED_EXCHANGES } from "store/types";

export const addTrackedExchanges = ({ payload = {}, aa, ...props }) => async (dispatch, _, socket) => {
  await socket.justsaying("light/new_aa_to_watch", { aa });

  const cleanPayload = omitBy(payload, isNil);
  dispatch({
    type: ADD_TRACKED_EXCHANGES,
    payload: { ...props, created_at: Date.now(), payload: cleanPayload, aa }
  })
}