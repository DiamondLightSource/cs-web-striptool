import { configureStore } from "@reduxjs/toolkit";
import configReducer from "./configReducer";

const store = configureStore({
    reducer: configReducer
})

export default store