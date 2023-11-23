import { BLEDevice, BLEState } from "../utils/ble/ble.types";

type Action = {
  type: "SET_DEVICE" | "REMOVE_DEVICE";
  payload: any;
};

const initialState = null;

export default function deviceReducer(
  state: BLEDevice | null = initialState,
  action: Action
): BLEDevice | null {
  switch (action.type) {
    case "SET_DEVICE":
      return action.payload;
    case "REMOVE_DEVICE":
      return initialState;
    default:
      return state;
  }
}

export const DeviceReducerActions = {
  setDevice: (device: BLEDevice) => ({
    type: "SET_DEVICE",
    payload: device,
  }),
  removeDevice: () => ({ type: "REMOVE_DEVICE" }),
};
