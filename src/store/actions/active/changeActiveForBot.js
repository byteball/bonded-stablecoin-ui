import { CHANGE_ACTIVE, REQ_CHANGE_ACTIVE } from "../../types";
import config from "../../../config";
import { getOraclePriceForBot } from "helpers/getOraclePriceForBot";
import axios from "axios";

export const changeActiveForBot = (address) => async (dispatch, getState) => {

  dispatch({
    type: REQ_CHANGE_ACTIVE
  });

  const store = getState();
  const { data } = await axios.get(config.BUFFER_URL + "/get_state");
  const stateVars = data.data.upcomingStateVars;
  const stableInfo = stateVars[address];
  const governanceInfo = stateVars[stableInfo.governance_aa];

  const { deposit, governance } = store.list.data[address];
  const def = await axios.get(config.BUFFER_URL + "/aa/" + address);
  const depositInfo = stateVars[deposit];
  const params = def.data.data[1].params;

  const [
    oraclePrice,
    oracleValue1,
    oracleValue2,
    oracleValue3,
  ] = await getOraclePriceForBot(stableInfo, params, true);

  const reserveProperties = config.reserves[params.reserve_asset];

  const reservePrice = reserveProperties && reserveProperties.oracle && reserveProperties.feed_name ? await axios.get(config.BUFFER_URL + "/get_data_feed/" + reserveProperties.oracle + "/" + reserveProperties.feed_name).then(response => response.data.data) : undefined

  const symbolByAsset1 = await axios.get(config.BUFFER_URL + "/symbol/" + encodeURIComponent(stableInfo.asset1)).then(response => response.data.data);

  const symbolByAsset2 = await axios.get(config.BUFFER_URL + "/symbol/" + encodeURIComponent(stableInfo.asset2)).then(response => response.data.data);

  const symbolByAsset3 = await axios.get(config.BUFFER_URL + "/symbol/" + encodeURIComponent(depositInfo.asset)).then(response => response.data.data);

  const symbolByReserveAsset = (config.reserves[params.reserve_asset] && config.reserves[params.reserve_asset].name) || await axios.get(config.BUFFER_URL + "/symbol/" + encodeURIComponent(params.reserve_asset)).then(response => response.data.data);

  const governanceDef = await axios.get(config.BUFFER_URL + "/aa/" + governance).then(response => response.data.data);
  const base_governance = governanceDef[1].base_aa;

  dispatch({
    type: CHANGE_ACTIVE,
    payload: {
      address,
      params,
      bonded_state: stableInfo,
      deposit_state: depositInfo,
      governance_state: governanceInfo,
      oracleValue1: oracleValue1 !== "none" ? oracleValue1 : 0,
      oracleValue2: oracleValue2 !== "none" ? oracleValue2 : 0,
      oracleValue3: oracleValue3 !== "none" ? oracleValue3 : 0,
      deposit_aa: deposit,
      governance_aa: governance,
      base_governance,
      reservePrice,
      oraclePrice,
      reserve_asset_symbol:
        symbolByReserveAsset !== params.reserve_asset.replace(/[+=]/, "").substr(0, 6) &&
        symbolByReserveAsset,
      symbol1:
        symbolByAsset1 !== stableInfo.asset1.replace(/[+=]/, "").substr(0, 6) &&
        symbolByAsset1,
      symbol2:
        symbolByAsset2 !== stableInfo.asset2.replace(/[+=]/, "").substr(0, 6) &&
        symbolByAsset2,
      symbol3:
        symbolByAsset3 !== depositInfo.asset.replace(/[+=]/, "").substr(0, 6) &&
        symbolByAsset3,
      transactions: {
        curve: {},
        deposit: {},
        governance: {}
      }
    },
  });
};
