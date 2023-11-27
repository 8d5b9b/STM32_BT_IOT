import { SavedBLEMessage } from "../utils/ble/ble.types";

type Action = {
  type: "ADD_MESSAGE" | "CLEAR_MESSAGES";
  payload: any;
};

const initialState: SavedBLEMessage[] = [];

export default function messageReducer(
  state: SavedBLEMessage[] = initialState,
  action: Action
): SavedBLEMessage[] {
  switch (action.type) {
    case "ADD_MESSAGE":
      return [...state, action.payload];
    case "CLEAR_MESSAGES":
      return initialState;
    default:
      return state;
  }
}

export const MessageReducerActions = {
  addMessage: (message: SavedBLEMessage) => ({
    type: "ADD_MESSAGE",
    payload: message,
  }),
  clearMessages: () => ({ type: "CLEAR_MESSAGES" }),
};
