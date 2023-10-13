import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { initMessageListener } from "redux-state-sync";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configReducer, connectionReducer } from "./state";
import { connectionMiddleware } from "./connectionMiddleware";
import { throttleMiddleware, UpdateThrottle } from "./throttleMiddleware";
import { Connection } from "../connection/plugin";
import { ConiqlPlugin } from "../connection/coniql";
import { ConnectionForwarder } from "../connection/forwarder";

const CONIQL_SOCKET = process.env.REACT_APP_CONIQL_SOCKET;
const CONIQL_SSL = process.env.REACT_APP_CONIQL_SSL === "true";
const THROTTLE_PERIOD = parseFloat(
  process.env.REACT_APP_THROTTLE_PERIOD ?? "100"
);

const plugins: [string, Connection][] = [];
if (CONIQL_SOCKET !== undefined) {
  const coniql = new ConiqlPlugin(CONIQL_SOCKET, CONIQL_SSL);
  plugins.unshift(["pva://", coniql]);
  plugins.unshift(["ca://", coniql]);
  plugins.unshift(["ssim://", coniql]);
  plugins.unshift(["dev://", coniql]);
}
const connection = new ConnectionForwarder(plugins);

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["config", "connection"]
};

const persistedReducer = persistReducer(persistConfig, configReducer);

const combinedReducer = combineReducers({
  config: persistedReducer,
  connection: connectionReducer
});

export const store = configureStore({
  reducer: combinedReducer,
  middleware: [
    connectionMiddleware(connection),
    throttleMiddleware(new UpdateThrottle(THROTTLE_PERIOD))
  ]
});

initMessageListener(store);
export const persistor = persistStore(store);
