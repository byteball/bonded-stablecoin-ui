import { UPDATE_SYMBOLS_LIST } from "../../types";
import config from "config";
import uniq from "lodash.uniq";
import { keyBy } from "lodash";
import axios from "axios";

const expireIn = 10; // days

export const updateSymbols = () => async (dispatch, getState, socket) => {
  const store = getState();
  let assets = [];
  const list = store.list.data;
  const now = Date.now();
  for (const address in list) {
    const coin = list[address];
    
    if ("fund" in coin) {
      const newAssets = []
      if(!(coin.params.reserve_asset in store.symbols) || (store.symbols[coin.params.reserve_asset].updated_at + (expireIn * 86400 * 1000)) < now){
        newAssets.push(coin.params.reserve_asset)
      }
      if(!(coin.asset_2 in store.symbols) || (store.symbols[coin.asset_2].updated_at + (expireIn * 86400 * 1000)) < now){
        newAssets.push(coin.asset_2)
      }
      if(!(coin.asset_fund in store.symbols) || (store.symbols[coin.asset_fund].updated_at + (expireIn * 86400 * 1000)) < now){
        newAssets.push(coin.asset_fund)
      }
      if(!(coin.asset_stable in store.symbols) || (store.symbols[coin.asset_stable].updated_at + (expireIn * 86400 * 1000)) < now){
        newAssets.push(coin.asset_stable)
      }

      assets = [...assets, ...newAssets];
    }
  }
  assets = uniq(assets);
  const getSymbols = assets.map((asset) => {
    if (socket) {
      return socket.api.getSymbolByAsset(
        config.TOKEN_REGISTRY,
        asset
      ).then((symbol) => {
        return { asset, symbol, "updated_at": Date.now() }
      });
    } else {
      return axios.get(config.BUFFER_URL + "/symbol/" + encodeURIComponent(asset)).then(response => ({asset, symbol: response.data.data, "updated_at": Date.now() }));
    }  
  });

  const symbols = await Promise.all(getSymbols);
  const symbolsByAsset = keyBy(symbols, "asset");

  dispatch({
    type: UPDATE_SYMBOLS_LIST,
    payload: symbolsByAsset
  })
};
