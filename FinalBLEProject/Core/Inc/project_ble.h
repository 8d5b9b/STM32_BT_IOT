/*
 * custom_ble.h
 *
 *  Created on: Nov 22, 2023
 *      Author: rreszetnik
 */

#ifndef INC_PROJECT_BLE_H_
#define INC_PROJECT_BLE_H_

#include "stm32l4xx_hal.h"

#include "hci_tl_interface.h"
//#include "b_l475e_iot01a1.h"

#define BDADDR_SIZE        6
#define BLE_DATA_SIZE 14

typedef union Service_UUID_t_s {
  /** 16-bit UUID
  */
  uint16_t Service_UUID_16;
  /** 128-bit UUID
  */
  uint8_t Service_UUID_128[16];
} Service_UUID_t;

/** Documentation for C union Char_UUID_t */
typedef union Char_UUID_t_s {
  /** 16-bit UUID
  */
  uint16_t Char_UUID_16;
  /** 128-bit UUID
  */
  uint8_t Char_UUID_128[16];
} Char_UUID_t;

typedef struct {
  uint32_t timestamp;
  int16_t temperature;
  int16_t pressure;
  int16_t humidity;
  int32_t noise;
} BLE_Update_Data;

void run_ble(BLE_Update_Data data, uint8_t send_update);
void init_ble();
void Read_Request_CB(uint16_t handle);
int getBLEConnected();


#endif /* INC_PROJECT_BLE_H_ */
