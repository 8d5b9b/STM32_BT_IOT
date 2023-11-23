import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import BluetoothWrapper from "./src/features/bluetooth/BluetoothWrapper";
import store from "./src/redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <BluetoothWrapper />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
