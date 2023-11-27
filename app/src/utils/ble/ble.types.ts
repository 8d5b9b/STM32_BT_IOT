export type BLEState =
  | "searching"
  | "connecting"
  | "connected"
  | "disconnected";

export type BLEDevice = {
  id: string;
  name: string;
  state: BLEState;
  lastDisconnected: string | null;
  lastReading: string | null;
  lastConnected: string | null;
  serviceUUIDs: string[] | null;
  known: boolean;
  active: boolean;
};

export type BLEConfig = {
  numMessages: number;
  lastSyncedToServer: string | null;
  readingInterval: number;
};

export type BLEMessage = {
  message: string;
  deviceId: string;
  receivedTime: string;
  serviceUUID: string;
  characteristicUUID: string;
};

export type SavedBLEMessage = {
  id: number;
  message: string;
  deviceId: string;
  receivedTime: string;
};

export type BLECharacteristic = {
  deviceId: string;
  serviceUUID: string;
  characteristicUUID: string;
};
