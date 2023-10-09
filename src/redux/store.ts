import { configureStore } from "@reduxjs/toolkit";
import { initMessageListener } from "redux-state-sync";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import configReducer from "./configReducer";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, configReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
});

initMessageListener(store);
export const persistor = persistStore(store);
