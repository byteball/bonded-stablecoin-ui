import { CHANGE_ACTIVE } from "../../types";
import config from "config";
import { addRecentStablecoin } from "../settings/addRecentStablecoin";
import { getOraclePrice } from "helpers/getOraclePrice";

export const changeActive = (address) => async (dispatch, getState, socket) => {
  const store = getState();

  if (!store.list.loaded || !address) return null;
  if (!(address in store.list.data)) return null;

  const { params, deposit, governance } = store.list.data[address];
  const stableInfo = await socket.api.getAaStateVars({
    address,
  });

  const depositInfo = await socket.api.getAaStateVars({
    address: deposit,
  });

  const governanceInfo = await socket.api.getAaStateVars({
    address: governance,
  });

  await socket.justsaying("light/new_aa_to_watch", {
    aa: address,
  });

  await socket.justsaying("light/new_aa_to_watch", {
    aa: deposit,
  });

  await socket.justsaying("light/new_aa_to_watch", {
    aa: governance,
  });

  const [
    oraclePrice,
    oracleValue1,
    oracleValue2,
    oracleValue3,
  ] = await getOraclePrice(stableInfo, params, true);

  const reservePrice = await socket.api.getDataFeed({
    oracles: [config.reserves[params.reserve_asset].oracle],
    feed_name: config.reserves[params.reserve_asset].feed_name,
    ifnone: "none",
  });

  const symbolByAsset1 = await socket.api.getSymbolByAsset(
    config.TOKEN_REGISTRY,
    stableInfo.asset1
  );

  const symbolByAsset2 = await socket.api.getSymbolByAsset(
    config.TOKEN_REGISTRY,
    stableInfo.asset2
  );

  const symbolByAsset3 = await socket.api.getSymbolByAsset(
    config.TOKEN_REGISTRY,
    depositInfo.asset
  );

  dispatch({
    type: CHANGE_ACTIVE,
    payload: {
      address,
      params,
      stable_state: stableInfo,
      deposit_state: depositInfo,
      governance_state: governanceInfo,
      oracleValue1: oracleValue1 !== "none" ? oracleValue1 : 0,
      oracleValue2: oracleValue2 !== "none" ? oracleValue2 : 0,
      oracleValue3: oracleValue3 !== "none" ? oracleValue3 : 0,
      deposit_aa: deposit,
      governance_aa: governance,
      reservePrice,
      oraclePrice,
      symbol1:
        symbolByAsset1 !== stableInfo.asset1.replace(/[+=]/, "").substr(0, 6) &&
        symbolByAsset1,
      symbol2:
        symbolByAsset2 !== stableInfo.asset2.replace(/[+=]/, "").substr(0, 6) &&
        symbolByAsset2,
      symbol3:
        symbolByAsset3 !== depositInfo.asset.replace(/[+=]/, "").substr(0, 6) &&
        symbolByAsset3,
    },
  });

  dispatch(addRecentStablecoin(address));
};
