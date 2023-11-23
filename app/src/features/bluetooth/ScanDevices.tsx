import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import AppButton from "../../components/AppButton";
import * as Bluetooth from "../../utils/ble";
import DevicePreview from "./components/DevicePreview";
import { BLEDevice } from "../../utils/ble/ble.types";

type Props = {};

const ScanDevices = (props: Props) => {
  const [scanning, setScanning] = React.useState(false);
  const [devices, setDevices] = React.useState<BLEDevice[]>([]);
  const handleStartScan = () => {
    setScanning(true);

    Bluetooth.scanAllDevices((device: BLEDevice) => {
      console.log("Device found: ", device);
      setDevices((prev) =>
        [...prev.filter((d) => d.id !== device.id), device].sort((a, b) =>
          a.id > b.id ? 1 : -1
        )
      );
    });
    setTimeout(() => {
      Bluetooth.cancelDeviceScan();
      setScanning(false);
    }, 5000);
  };
  const connect = (device: BLEDevice) => {
    Bluetooth.selectDevice(device);
  };
  return (
    <View>
      <AppButton
        title={scanning ? "Scanning..." : "Scan"}
        onPress={handleStartScan}
        disabled={scanning}
      />
      <ScrollView>
        {devices.map((device) => (
          <DevicePreview
            key={device.id}
            name={device.name}
            id={device.id}
            onPress={() => connect(device)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ScanDevices;

const styles = StyleSheet.create({});
