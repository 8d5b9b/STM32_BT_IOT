import { BleManager, Subscription } from "react-native-ble-plx";
import { BLECharacteristic, BLEDevice, BLEMessage } from "./ble.types";
import base64 from "react-native-base64";
import { MIN_RSSI } from "./constants";
import decodeMessage from "../../features/bluetooth/utils/decodeMessage";

const manager = new BleManager();

let transactions: Subscription[] = [];

const clearTransactions = () => {
  transactions.forEach((transaction) => transaction.remove());
  transactions = [];
};

export const scanDevice = (device: BLEDevice) => {
  return new Promise<BLEDevice>((resolve, reject) => {
    manager.startDeviceScan(device.serviceUUIDs, null, (error, dev) => {
      if (error) {
        reject(error);
      }
      if (device.id === dev?.id) {
        manager.stopDeviceScan();
        resolve({
          ...device,
          name: dev.localName ?? dev.name ?? device.name,
        });
      }
    });
  });
};

export const scanAllDevices = async (
  knownDevices: BLEDevice[],
  maxDuration: number,
  onDeviceFound: (device: BLEDevice) => void
) => {
  console.log("Scanning");
  return new Promise((resolve, reject) => {
    manager.startDeviceScan(null, null, (error, dev) => {
      if (error) {
        reject(error);
      }
      if (
        dev &&
        dev.rssi &&
        dev.rssi > MIN_RSSI &&
        (dev.name || dev.localName)
      ) {
        const isKnown = knownDevices.find((d) => d.id === dev.id);
        onDeviceFound({
          id: dev.id,
          name: dev.localName ?? dev.name ?? "Unknown",
          state: "disconnected",
          lastConnected: isKnown?.lastConnected ?? null,
          lastDisconnected: isKnown?.lastDisconnected ?? null,
          lastReading: isKnown?.lastReading ?? null,
          serviceUUIDs: dev.serviceUUIDs,
          known: !!isKnown,
          active: false,
        });
      }
    });
    setTimeout(() => {
      manager.stopDeviceScan();
      resolve(null);
    }, maxDuration);
  });
};
export const cancelDeviceScan = manager.stopDeviceScan;

export const selectDevice = async (
  device: BLEDevice,
  onNotification: (message: BLEMessage) => void,
  onDeviceUpdate: (device: BLEDevice) => void
) => {
  device.known = true;
  device.active = true;
  device.state = "searching";
  onDeviceUpdate({ ...device });

  const bleState = await manager.state();
  if (bleState !== "PoweredOn") {
    try {
      manager.enable();
    } catch (e) {
      console.log("ERROR ENABLING BLUETOOTH", e);
      device.state = "disconnected";
      onDeviceUpdate({ ...device });
      return;
    }
  }

  clearTransactions();
  const connected = await manager.isDeviceConnected(device.id);
  if (!connected) {
    await new Promise((resolve, reject) => {
      manager.startDeviceScan(device.serviceUUIDs, null, (error, device) => {
        if (error) {
          console.log("ERROR", error);
        } else if (device) {
          resolve(device);
        }
      });
    });
  }

  console.log("About to connect", connected);
  device.state = "connecting";
  onDeviceUpdate({ ...device });

  while (true) {
    try {
      manager.cancelTransaction("discover");
      console.log("discovered cancelled");
      const deviceConn = await manager.connectToDevice(device.id);
      console.log("connected");
      await deviceConn.requestMTU(242);
      await deviceConn.discoverAllServicesAndCharacteristics("discover");
      console.log("discovered");

      break;
    } catch (e) {
      console.log("failed");
      try {
        await manager.cancelDeviceConnection(device.id);
      } catch (e) {
        console.log("ERROR DISCONNECTING", e);
      }
    }
  }
  device.state = "connected";
  onDeviceUpdate({ ...device });
  console.log("Connected");
  const services = await manager.servicesForDevice(device.id);
  const characteristics = (
    await Promise.all(
      services.map((ser) =>
        manager.characteristicsForDevice(device.id, ser.uuid)
      )
    )
  ).flat();
  console.log(
    "CHARACTERISTICS",
    JSON.stringify(
      characteristics.map((c) => ({
        uuid: c.uuid,
        serviceUUID: c.serviceUUID,
        id: c.id,
        isNotifiable: c.isNotifiable,
        isWritableWithoutResponse: c.isWritableWithoutResponse,
        isWritableWithResponse: c.isWritableWithResponse,
        isReadable: c.isReadable,
        isIndicatable: c.isIndicatable,
        value: c.value ? decodeMessage(c.value) : null,
      })),
      null,
      2
    )
  );
  characteristics
    .filter((char) => char.isNotifiable)
    .forEach((char) => {
      transactions.push(
        char.monitor((error, char) => {
          if (error) {
            console.log("ERROR MONITORING CHARACTERISTIC", error);
          } else if (char?.value) {
            device.lastReading = new Date().toISOString();
            onDeviceUpdate({ ...device });
            onNotification({
              message: char.value,
              receivedTime: new Date().toISOString(),
              deviceId: device.id,
              serviceUUID: char.serviceUUID,
              characteristicUUID: char.uuid,
            });
          }
        })
      );
    });

  transactions.push(
    manager.onDeviceDisconnected(device.id, (error, dev) => {
      if (error) {
        console.log("ERROR DISCONNECTING", error);
      } else {
        device.lastDisconnected = new Date().toISOString();
        onDeviceUpdate({ ...device });
      }
    })
  );
};

export const disconnect = (device: BLEDevice): BLEDevice => {
  clearTransactions();
  manager.cancelDeviceConnection(device.id);
  device.active = false;
  device.state = "disconnected";
  device.lastDisconnected = new Date().toISOString();
  return device;
};

export const getWriteableCharacteristics = async (
  device: BLEDevice
): Promise<BLECharacteristic[]> => {
  const services = await manager.servicesForDevice(device.id);
  const characteristics = (
    await Promise.all(
      services.map((ser) =>
        manager.characteristicsForDevice(device.id, ser.uuid)
      )
    )
  ).flat();
  return characteristics
    .filter((c) => c.isWritableWithoutResponse)
    .map((c) => ({
      deviceId: c.deviceID,
      characteristicUUID: c.uuid,
      serviceUUID: c.serviceUUID,
    }));
};

export const sendMessageToCharacteristic = async (
  characteristic: BLECharacteristic,
  message: string
) => {
  manager.writeCharacteristicWithoutResponseForDevice(
    characteristic.deviceId,
    characteristic.serviceUUID,
    characteristic.characteristicUUID,
    base64.encode(message)
  );
};
