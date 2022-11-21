import { CHANGE_ACTIVE, REQ_CHANGE_ACTIVE } from "../../types";
import config from "config";
import { addRecentStablecoin } from "../settings/addRecentStablecoin";
import { getOraclePrice } from "helpers/getOraclePrice";
import { getPrevTransactions } from "./getPrevTransactions";

export const changeActive = (address) => async (dispatch, getState, socket) => {

  dispatch({
    type: REQ_CHANGE_ACTIVE,
    payload: address
  });

  const store = getState();

  if (!store.list.loaded || !address) return null;
  if (!(address in store.list.data)) return null;

  const { params, deposit, governance, stable, fund } = store.list.data[address];

  const bondedInfo = !store.data.error && (address in store.data.data)
    ? store.data.data[address]
    : await socket.api.getAaStateVars({
      address,
    });

  let depositInfo = {};

  if (deposit) {
    depositInfo = !store.data.error && (deposit in store.data.data)
      ? store.data.data[deposit]
      : await socket.api.getAaStateVars({
        address: deposit
      });
  }

  const governanceInfo = !store.data.error && (governance in store.data.data)
    ? store.data.data[governance]
    : await socket.api.getAaStateVars({
      address: governance
    });

  let stableInfo = {};
  if (stable) {
    stableInfo = (!store.data.error && (stable in store.data.data)
      ? store.data.data[stable]
      : await socket.api.getAaStateVars({
        address: stable
      }));
  }
 
  let fundInfo = {};
  if (fund) {
    fundInfo = (!store.data.error && (fund in store.data.data)
      ? store.data.data[fund]
      : await socket.api.getAaStateVars({
        address: fund
      }));
  }


  const de_aa = bondedInfo?.decision_engine_aa;

  let de_state = {};
  if (de_aa) {
    de_state = (!store.data.error && (de_aa in store.data.data)
      ? store.data.data[de_aa]
      : await socket.api.getAaStateVars({
        address: de_aa
      }))
  }

  const fundBalance = store.data.balances[fund];

  await socket.justsaying("light/new_aa_to_watch", {
    aa: address,
  });

  if (deposit) {
    await socket.justsaying("light/new_aa_to_watch", {
      aa: deposit,
    });
  } else if (stable) {
    await socket.justsaying("light/new_aa_to_watch", {
      aa: stable,
    });
  }

  await socket.justsaying("light/new_aa_to_watch", {
    aa: governance,
  });

  if (bondedInfo.decision_engine_aa) {
    await socket.justsaying("light/new_aa_to_watch", {
      aa: bondedInfo.decision_engine_aa,
    });
    await socket.justsaying("light/new_aa_to_watch", {
      aa: fund
    });
  }

  const [
    oraclePrice,
    oracleValue1,
    oracleValue2,
    oracleValue3,
  ] = await getOraclePrice(bondedInfo, params, true);

  const reserveProperties = config.reserves[params.reserve_asset];
  const reservePrice = reserveProperties && reserveProperties.oracle && reserveProperties.feed_name ? await socket.api.getDataFeed({
    oracles: [reserveProperties.oracle],
    feed_name: reserveProperties.feed_name,
    ifnone: "none",
  }) : undefined;

  const symbolByAsset1 = await socket.api.getSymbolByAsset(
    config.TOKEN_REGISTRY,
    bondedInfo.asset1
  );

  const symbolByAsset2 = await socket.api.getSymbolByAsset(
    config.TOKEN_REGISTRY,
    bondedInfo.asset2
  );

  const symbolByAsset3 = depositInfo?.asset ? (await socket.api.getSymbolByAsset(
    config.TOKEN_REGISTRY,
    depositInfo.asset
  )) : (await socket.api.getSymbolByAsset(
    config.TOKEN_REGISTRY,
    stableInfo.asset
  ));

  const symbolByReserveAsset = (config.reserves[params.reserve_asset] && config.reserves[params.reserve_asset].name) || await socket.api.getSymbolByAsset(
    config.TOKEN_REGISTRY,
    params.reserve_asset
  );

  const symbolByAsset4 = fundInfo?.shares_asset && await socket.api.getSymbolByAsset(
    config.TOKEN_REGISTRY,
    fundInfo.shares_asset
  );

  const governanceDef = await socket.api.getDefinition(governance);
  const base_governance = governanceDef[1].base_aa;

  const deDef = de_aa && await socket.api.getDefinition(de_aa);
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
      symbol1: symbolByAsset1 && symbolByAsset1 !== bondedInfo.asset1.replace(/[+=]/, "").substr(0, 6) && symbolByAsset1,
      symbol2: symbolByAsset2 && symbolByAsset2 !== bondedInfo.asset2.replace(/[+=]/, "").substr(0, 6) && symbolByAsset2,
      symbol3: stable ? (symbolByAsset3 !== stableInfo?.asset.replace(/[+=]/, "").substr(0, 6) && symbolByAsset3) : symbolByAsset3 !== depositInfo?.asset.replace(/[+=]/, "").substr(0, 6) && symbolByAsset3,
      symbol4: fundInfo?.shares_asset && symbolByAsset4 && (symbolByAsset4 !== fundInfo.shares_asset.replace(/[+=]/, "").substr(0, 6)) && symbolByAsset4,
      transactions: {
        curve: {},
        depositOrStable: {},
        governance: {},
        de: {}
      }
    },
  });

  dispatch(addRecentStablecoin(address));
  dispatch(getPrevTransactions());
};
