import { DeviceReducerActions } from "../../redux/deviceReducer";
import store from "../../redux/store";
import { BLECharacteristic, BLEDevice, BLEMessage } from "./ble.types";
import * as devicedb from "./device.db";
import * as messagesdb from "./message.db";
import * as manager from "./bleActions";
import { MessageReducerActions } from "../../redux/messageReducer";

const onNotification = async (message: BLEMessage) => {
  console.log("NOTIFICATION", message.message);
  const m = await messagesdb.saveMessage(message);
  store.dispatch(MessageReducerActions.addMessage(m));
};
const onDeviceUpdate = (device: BLEDevice) => {
  console.log("UPDATE", device);
  devicedb.updateDevice(device);
  store.dispatch(DeviceReducerActions.setDevice(device));
};

export const start = async () => {
  await devicedb.initializeDB();
  await messagesdb.initializeDB();
  console.log("Initializng done");
  const active = await devicedb.getActiveDevice();
  if (active) {
    manager.selectDevice(active, onNotification, onDeviceUpdate);
  }
};

export const cancelDeviceScan = manager.cancelDeviceScan;

export const scanAllDevices = async (
  onDeviceFound: (device: BLEDevice) => void
) => {
  console.log("Starting scan");
  const knownDevices = await devicedb.getAllDevices();
  console.log({ knownDevices });
  await manager.scanAllDevices(knownDevices, 10000, onDeviceFound);
};

export const selectDevice = async (device: BLEDevice) => {
  await devicedb.setAllDevicesInactive();
  manager.selectDevice(device, onNotification, onDeviceUpdate);
};

export const disconnectDevice = async () => {
  const device = await devicedb.getActiveDevice();
  if (device) devicedb.updateDevice(manager.disconnect(device));
  store.dispatch(DeviceReducerActions.removeDevice());
  await devicedb.setAllDevicesInactive();
};

export const getWriteableCharacteristics = manager.getWriteableCharacteristics;

export const sendMessageToCharacteristic = manager.sendMessageToCharacteristic;
