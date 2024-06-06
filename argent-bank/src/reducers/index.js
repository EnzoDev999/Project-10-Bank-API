import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import transactionReducer from "../slices/transactionSlice"; // Ajout du reducer des transactions

const rootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionReducer, // Ajout du reducer des transactions au combineReducers
});

export default rootReducer;
