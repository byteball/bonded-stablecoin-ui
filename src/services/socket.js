import obyte from "obyte";
import config from "../config";
import { store } from "index";
import {
  openConnection,
  closeConnection,
} from "store/actions/connection/connection";
import { getList } from "store/actions/list/getList";
import { eventManager } from "./eventManager/eventManager";
import { updateOracleValues } from "store/actions/active/updateOracleValues";
import { updateProvider } from "./updateProvider/updateProvider";
import { getData } from "store/actions/data/getData";
import { updateData } from "store/actions/data/updateData";

const client = new obyte.Client(
  `wss://obyte.org/bb${config.TESTNET ? "-test" : ""}`,
  {
    testnet: config.TESTNET,
    reconnect: true,
  }
);

client.onConnect(() => {
  store.dispatch(openConnection());

  store.dispatch(getList());

  const heartbeat = setInterval(function () {
    client.api.heartbeat();
  }, 10 * 1000);

  client.justsaying("light/new_aa_to_watch", {
    aa: config.TOKEN_REGISTRY,
  });

  const updateOracle = setInterval(() => {
    store.dispatch(updateOracleValues());
  }, 1000 * 60);

  client.subscribe(eventManager);

  client.client.ws.addEventListener("close", () => {
    store.dispatch(closeConnection());
    clearInterval(heartbeat);
    clearInterval(updateOracle);
  });
});

const update = (data) => {
  store.dispatch(updateData(data));
}

const getSnapshot = (data) => {
  store.dispatch(getData(data));
}

updateProvider({ address: config.UPCOMING_STATE_WS_URL, update, getSnapshot });

export default client;
