import { UPDATE_PRICES } from "../../types";
import { getOraclePrice } from "helpers/getOraclePrice";

const expireIn = 7; // minutes

export const updatePrices = (info = []) => async (dispatch, getState) => {
  const store = getState();
  const { updated_at } = store.prices;
  const now = Date.now();

  if (now < (updated_at + expireIn * 60 * 1000)) return null

  const prices = {};
  const getPrices = info.map((item) => {
    return getOraclePrice(item.bonded_state, item.params, true).then(([oraclePrice]) => {
      prices[item.address] = oraclePrice
    });
  })

  await Promise.all(getPrices);

  dispatch({
    type: UPDATE_PRICES,
    payload: prices
  })
};
