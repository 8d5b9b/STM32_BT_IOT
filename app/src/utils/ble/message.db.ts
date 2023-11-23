import { BLEMessage, SavedBLEMessage } from "./ble.types";
import * as SQLite from "expo-sqlite";
import {
  DATABASE_NAME,
  TABLES,
  DEVICE_TO_SERVER_BATCH_SIZE,
} from "./constants";

const createTable = `
CREATE TABLE IF NOT EXISTS ${TABLES.MESSAGES} (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   message TEXT,
   deviceId TEXT,
   receivedTime TEXT)
`;

export const saveMessage = (message: BLEMessage): Promise<SavedBLEMessage> => {
  const db = SQLite.openDatabase(DATABASE_NAME);
  return new Promise<SavedBLEMessage>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ${TABLES.MESSAGES}(message,deviceId,receivedTime) VALUES (?,?,?)`,
        [message.message, message.deviceId, message.receivedTime],
        (t, result) => {
          if (result.insertId) {
            resolve({
              id: result.insertId,
              message: message.message,
              deviceId: message.deviceId,
              receivedTime: message.receivedTime,
            });
          } else {
            reject();
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

export const getAllMessages = (): Promise<SavedBLEMessage[]> => {
  const db = SQLite.openDatabase(DATABASE_NAME);
  return new Promise<SavedBLEMessage[]>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${TABLES.MESSAGES} ORDER BY id ASC LIMIT ${DEVICE_TO_SERVER_BATCH_SIZE}`,
        [],
        (t, result) => {
          resolve(result.rows._array);
        },
        (tx, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const deleteMessagesUntilId = (id: number): Promise<void> => {
  const db = SQLite.openDatabase(DATABASE_NAME);
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${TABLES.MESSAGES} WHERE id <= ?`,
        [id],
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

export const initializeDB = (dropCurrent?: boolean) => {
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
