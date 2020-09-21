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

const rootReducer = combineReducers({
  settings: settingsReducer,
  list: listReducer,
  active: activeReducer,
  pendings: pendingsReducer,
  connected: connectionReducer,
});

const persistConfig = {
  key: "bonded",
  storage,
  whitelist: ["settings"],
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
