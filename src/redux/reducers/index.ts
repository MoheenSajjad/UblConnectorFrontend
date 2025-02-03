import { combineReducers } from "redux";
import configReducer from "./configSlice";
import authReducer from "./authSlice";

const rootReducer = combineReducers({
  config: configReducer,
  auth: authReducer,
});

export default rootReducer;
