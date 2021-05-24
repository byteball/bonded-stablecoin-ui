import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { settingsReducer } from "./reducers/settings";
import { listReducer } from "./reducers/list";
import socket from "../services/socket";
import { activeReducer } from "./reducers/active";
import { connectionReducer } from "./reducers/connection";
import { pendingsReducer } from "./reducers/pendings";
import { dataReducer } from "./reducers/data";
import { carburetorReducer } from "./reducers/carburetor";
import { symbolsReducer } from "./reducers/symbols";
import { pricesReducer } from "./reducers/prices";
import { trackedReducer } from "./reducers/tracked";

const rootReducer = combineReducers({
  settings: settingsReducer,
  list: listReducer,
  active: activeReducer,
  pendings: pendingsReducer,
  connected: connectionReducer,
  data: dataReducer,
  carburetor: carburetorReducer,
  symbols: symbolsReducer,
  prices: pricesReducer,
  tracked: trackedReducer
});

const persistConfig = {
  key: "bonded",
  storage,
  whitelist: ["settings", "symbols", "prices"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(thunk.withExtraArgument(socket)),
      composeEnhancers()
    )
  );

  return { store, persistor: persistStore(store) };
};
