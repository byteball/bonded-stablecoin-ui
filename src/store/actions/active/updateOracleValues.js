import { UPDATE_ORACLES } from "../../types/active";
import { getOraclePrice } from "helpers/getOraclePrice";

export const updateOracleValues = () => async (dispatch, getState) => {
  const store = getState();
  const { active } = store;
  const { stable_state, params } = active;

  const oraclePrice = await getOraclePrice(stable_state, params);

  dispatch({
    type: UPDATE_ORACLES,
    payload: oraclePrice,
  });
};
