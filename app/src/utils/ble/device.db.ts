import { BLEDevice, BLEMessage } from "./ble.types";
import * as SQLite from "expo-sqlite";
import { DATABASE_NAME, TABLES } from "./constants";

const createTable = `
CREATE TABLE IF NOT EXISTS ${TABLES.DEVICES} (
  id TEXT PRIMARY KEY, 
  name TEXT NOT NULL, 
  active INTEGER DEFAULT 0,
  known INTEGER DEFAULT 0,
  state TEXT,
  lastDisconnected TEXT, 
  lastReading TEXT, 
  lastConnected TEXT,
  serviceUUIDs TEXT)
`;

const convertToBLEDevice = (device: any): BLEDevice => {
  return {
    id: device.id,
    name: device.name,
    state: device.state,
    lastDisconnected: device.lastDisconnected,
    lastReading: device.lastReading,
    lastConnected: device.lastConnected,
    serviceUUIDs: device.serviceUUIDs ? JSON.parse(device.serviceUUIDs) : null,
    known: Boolean(device.known),
    active: Boolean(device.active),
  };
};

export const getActiveDevice = (): Promise<BLEDevice | null> => {
  const db = SQLite.openDatabase(DATABASE_NAME);
  return new Promise<BLEDevice | null>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${TABLES.DEVICES} WHERE active = 1`,
        [],
        (t, result) => {
          if (result.rows.length === 0) {
            resolve(null);
          } else {
            resolve(convertToBLEDevice(result.rows.item(0)));
          }
        },
        (tx, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const getAllDevices = (): Promise<BLEDevice[]> => {
  const db = SQLite.openDatabase(DATABASE_NAME);
  console.log("Getting all device");
  return new Promise<BLEDevice[]>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM ${TABLES.DEVICES}`,
          [],
          (t, result) => {
            console.log("Got", result);
            resolve(result.rows._array.map((d) => convertToBLEDevice(d)));
          },
          (tx, error) => {
            reject(error);
            return true;
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  });
};

export const updateDevice = (device: BLEDevice) => {
  const db = SQLite.openDatabase(DATABASE_NAME);
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT OR REPLACE INTO ${TABLES.DEVICES}(id,name,state,lastDisconnected,lastReading,lastConnected,serviceUUIDs,known,active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          device.id,
          device.name,
          device.state,
          device.lastDisconnected,
          device.lastReading,
          device.lastConnected,
          device.serviceUUIDs ? JSON.stringify(device.serviceUUIDs) : null,
          device.known ? 1 : 0,
          device.active ? 1 : 0,
        ],
        (tx, res) => {
          resolve();
        },
        (tx, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const deleteDevice = (deviceId: string) => {
  const db = SQLite.openDatabase(DATABASE_NAME);
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${TABLES.DEVICES} WHERE id = ?`,
        [deviceId],
        (t, result) => {
          resolve();
        },
        (tx, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const setAllDevicesInactive = async () => {
  const db = SQLite.openDatabase(DATABASE_NAME);
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE devices SET active = 0`,
        [],
        () => resolve(),
        (tx, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const initializeDB = async (dropCurrent?: boolean) => {
  const db = SQLite.openDatabase(DATABASE_NAME);

  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      if (dropCurrent) {
        tx.executeSql(`DROP TABLE IF EXISTS ${TABLES.DEVICES}`);
      }
      tx.executeSql(
        createTable,
        [],
        () => resolve(),
        (tx, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};
