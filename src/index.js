import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import ReactGA from "react-ga";

import { PersistGate } from "redux-persist/integration/react";
import "antd/dist/antd.css";
import "./index.css";
import AppRouter from "./AppRouter";
import configureStore from "./store";
import config from "./config";

ReactGA.initialize(config.GA_ID);

export const { persistor, store } = configureStore();

ReactDOM.render(
  <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouter />
      </PersistGate>
    </Provider>
  </>,
  document.getElementById("root")
);
