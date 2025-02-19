import { combineReducers } from "redux";
import configReducer from "./configSlice";
import transactionReducer from "./transactionSlice";
import authReducer from "./authSlice";
import companySlice from "./companiesSlice";
import userSlice from "./userSlice";

const rootReducer = combineReducers({
  config: configReducer,
  auth: authReducer,
  transaction: transactionReducer,
  company: companySlice,
  user: userSlice,
});

export default rootReducer;
