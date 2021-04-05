import { UPDATE_ORACLES } from "../../types/active";
import { getOraclePrice } from "helpers/getOraclePrice";

export const updateOracleValues = () => async (dispatch, getState) => {
  const store = getState();
  const { active } = store;
  const { bonded_state, params } = active;

  const oraclePrice = await getOraclePrice(bonded_state, params);

  dispatch({
    type: UPDATE_ORACLES,
    payload: oraclePrice,
  });
};
