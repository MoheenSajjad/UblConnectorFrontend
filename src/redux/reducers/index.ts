import { combineReducers } from "redux";
import configReducer from "./configSlice";
import transactionReducer from "./transactionSlice";
import authReducer from "./authSlice";

const rootReducer = combineReducers({
  config: configReducer,
  auth: authReducer,
  transaction: transactionReducer,
});

export default rootReducer;
