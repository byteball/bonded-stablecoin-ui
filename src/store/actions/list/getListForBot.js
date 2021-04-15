import {
  LOAD_LIST_FAILURE,
  LOAD_LIST_REQUEST,
  LOAD_LIST_SUCCESS,
} from "../../types";
import config from "config";
import { getParams } from "helpers/getParams";
import axios from "axios";

export const getListForBot = () => async (dispatch) => {
  const list = {};
  const getStablesParams = [];
  let data = {};
  
  dispatch({
    type: LOAD_LIST_REQUEST,
  });

  try {
    const stateVars = await axios.get(config.BUFFER_URL + "/get_factory_state");
    data = stateVars.data.data;
  } catch (e) {
    console.log("Error: ", e);
    return dispatch({
      type: LOAD_LIST_FAILURE,
    });
  }

  for (const row in data) {
    if (row.includes("governance_aa_")) {
      const address = row.split("_").slice(2)[0];
      list[address] = { ...list[address], governance: data[row] };
    } else if (row.includes("deposit_aa_")) {
      const address = row.split("_").slice(2)[0];
      list[address] = { ...list[address], deposit: data[row] };
    } else if (row.includes("curve_")) {
      const address = row.split("_").slice(1)[0];
      list[address] = { ...list[address], curve: data[row] };
    } else if (row.includes("asset_")) {
      const [address, type] = row.split("_").slice(1);
      list[address] = { ...list[address], ["asset_" + type]: data[row] };
    } else if (row.includes("stable_aa_")) {
      const address = row.split("_").slice(2)[0];
      list[address] = { ...list[address], stable: data[row] };
    } else if (row.includes("fund_aa_")) {
      const address = row.split("_").slice(2)[0];
      list[address] = { ...list[address], fund: data[row] };
    }
  }

  for (const address in list) {
    getStablesParams.push(
      axios.get(config.BUFFER_URL + "/aa/" + address).then((result) => ({ address, params: result.data.data && result.data.data[1] ? result.data.data[1].params : {} }))
    );
  }

  const getStateVarsAas = [];
  await Promise.all(getStablesParams).then((result) => {
    result.forEach((res) => {
      getStateVarsAas.push(
        axios.get(config.BUFFER_URL + "/get_state/" + res.address)
          .then((info) => {
            const state = info.data.data;
            list[res.address].params = getParams(list[res.address].params, state);
            list[res.address].reserve = state.reserve || 0;
            list[res.address].bonded_state = state;
          })
      );
      list[res.address] = {
        ...list[res.address],
        params: res.params,
      };
    });
  });

  await Promise.all(getStateVarsAas);

  dispatch({
    type: LOAD_LIST_SUCCESS,
    payload: list,
  });
};
