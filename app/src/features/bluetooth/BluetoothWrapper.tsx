import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import * as BLE from "../../utils/ble";
import { useSelector } from "react-redux";
import { MyAppState } from "../../redux/store";
import ScanDevices from "./ScanDevices";
import ConnectedDevice from "./ConnectedDevice";

type Props = {};

const BluetoothWrapper = (props: Props) => {
  const device = useSelector((state: MyAppState) => state.device);
  useEffect(() => {
    BLE.start();
  }, []);

  return (
    <SafeAreaView>
      {device ? <ConnectedDevice /> : <ScanDevices />}
    </SafeAreaView>
  );
};

export default BluetoothWrapper;
