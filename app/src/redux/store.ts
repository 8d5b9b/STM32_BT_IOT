import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import deviceReducer from "./deviceReducer";
import messageReducer from "./messageReducer";
import { BLEDevice, BLEMessage } from "../utils/ble/ble.types";
const rootReducer = combineReducers({
  device: deviceReducer,
  messages: messageReducer,
});
export default configureStore({ reducer: rootReducer });

export interface MyAppState {
  device: BLEDevice | null;
  messages: BLEMessage[];
}
