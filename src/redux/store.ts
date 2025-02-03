// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
// import reducer from "./slices/configSlice";
import rootReducer from "./reducers";
import { ENVIRONMENT } from "@/config";

const store = configureStore({
  reducer: rootReducer,
  devTools: ENVIRONMENT !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
