import axios from "axios";

import { CHANGE_ACTIVE, REQ_CHANGE_ACTIVE } from "../../types";
import { getOraclePriceForBot } from "helpers/getOraclePriceForBot";
import { getPrevTransactionsForBot } from "./getPrevTransactionsForBot";

import config from "config";

export const changeActiveForBot = (address) => async (dispatch, getState) => {

  dispatch({
    type: REQ_CHANGE_ACTIVE
  });

  const store = getState();
  const { data } = await axios.get(config.BUFFER_URL + "/get_state");
  const stateVars = data.data.upcomingStateVars;
  const balances = data.data.upcomingBalances;

  const { params, deposit, governance, stable, fund } = store.list.data[address];

  const bondedInfo = stateVars[address];
  const depositInfo = stateVars[deposit] || {};
  const governanceInfo = stateVars[governance];
  const stableInfo = stateVars[stable];
  const fundInfo = stateVars[fund];

  const de_aa = bondedInfo?.decision_engine_aa;
  const de_state = de_aa ? stateVars[de_aa] : {};
  const fundBalance = balances[fund];

  const [
    oraclePrice,
    oracleValue1,
    oracleValue2,
    oracleValue3,
  ] = await getOraclePriceForBot(bondedInfo, params, true);

  const reserveProperties = config.reserves[params.reserve_asset];

  const reservePrice = reserveProperties && reserveProperties.oracle && reserveProperties.feed_name ? await axios.get(config.BUFFER_URL + "/get_data_feed/" + reserveProperties.oracle + "/" + reserveProperties.feed_name).then(response => response.data.data) : undefined

  const symbolByAsset1 = await axios.get(config.BUFFER_URL + "/symbol/" + encodeURIComponent(bondedInfo.asset1)).then(response => response.data.data);

  const symbolByAsset2 = await axios.get(config.BUFFER_URL + "/symbol/" + encodeURIComponent(bondedInfo.asset2)).then(response => response.data.data);

  const symbolByAsset3 = await axios.get(config.BUFFER_URL + "/symbol/" + encodeURIComponent(bondedInfo?.asset)).then(response => response.data.data);

  const symbolByAsset4 = fundInfo?.shares_asset && await axios.get(config.BUFFER_URL + "/symbol/" + encodeURIComponent(fundInfo.shares_asset)).then(response => response.data.data);

  const symbolByReserveAsset = (config.reserves[params.reserve_asset] && config.reserves[params.reserve_asset].name) || await axios.get(config.BUFFER_URL + "/symbol/" + encodeURIComponent(params.reserve_asset)).then(response => response.data.data);

  const governanceDef = await axios.get(config.BUFFER_URL + "/aa/" + governance).then(response => response.data.data);
  const base_governance = governanceDef[1].base_aa;

  const deDef = await axios.get(config.BUFFER_URL + "/aa/" + de_aa).then(response => response.data.data);
  const base_de = deDef && deDef[1].base_aa;

  dispatch({
    type: CHANGE_ACTIVE,
    payload: {
      address,
      params,
      bonded_state: bondedInfo,
      deposit_state: depositInfo,
      stable_state: stableInfo,
      governance_state: governanceInfo,
      fund_state: fundInfo,
      de_state: de_state,
      oracleValue1: oracleValue1 !== "none" ? oracleValue1 : 0,
      oracleValue2: oracleValue2 !== "none" ? oracleValue2 : 0,
      oracleValue3: oracleValue3 !== "none" ? oracleValue3 : 0,
      deposit_aa: deposit,
      governance_aa: governance,
      stable_aa: stable,
      fund_aa: fund,
      fund_balance: fundBalance,
      base_governance,
      base_de,
      reservePrice,
      oraclePrice,
      reserve_asset_symbol:
        symbolByReserveAsset !== params.reserve_asset.replace(/[+=]/, "").substr(0, 6) &&
        symbolByReserveAsset,
      symbol1: symbolByAsset1 !== bondedInfo.asset1.replace(/[+=]/, "").substr(0, 6) && symbolByAsset1 ? symbolByAsset1 : bondedInfo.asset1.replace(/[+=]/, "").substr(0, 6),
      symbol2:  symbolByAsset2 !== bondedInfo.asset2.replace(/[+=]/, "").substr(0, 6) && symbolByAsset2 ? symbolByAsset2 : bondedInfo.asset2.replace(/[+=]/, "").substr(0, 6),
      symbol3: stable ? (symbolByAsset3 !== stableInfo?.asset.replace(/[+=]/, "").substr(0, 6) && symbolByAsset3) : (symbolByAsset3 !== depositInfo?.asset.replace(/[+=]/, "").substr(0, 6) && symbolByAsset3 ? symbolByAsset3 : depositInfo?.asset.replace(/[+=]/, "").substr(0, 6)),
      symbol4: fundInfo?.shares_asset && symbolByAsset4 !== fundInfo?.shares_asset.replace(/[+=]/, "").substr(0, 6) && symbolByAsset4 ? symbolByAsset4 : fundInfo?.shares_asset.replace(/[+=]/, "").substr(0, 6),
      transactions: {
        curve: {},
        depositOrStable: {},
        governance: {},
        de: {}
      },
    },
  });

  dispatch(getPrevTransactionsForBot());
};
