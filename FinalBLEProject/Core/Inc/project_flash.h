/*
 * project_flash.h
 *
 *  Created on: Nov 28, 2023
 *      Author: rreszetnik
 */

#ifndef INC_PROJECT_FLASH_H_
#define INC_PROJECT_FLASH_H_

#include "project_ble.h"

#define	BASE_ADDR_BITMAP_1	0x010000
#define BASE_ADDR_DATA_1	0x020000

#define	BASE_ADDR_BITMAP_2	0x030000
#define BASE_ADDR_DATA_2	0x040000

#define MAX_DATA_SINGLE_BLOCK	(64*1024)


uint16_t readNumOfData_read_1();
uint16_t readNumOfData_1();
uint16_t readNumOfData_1_offset(uint16_t offset_index);
uint16_t readNumOfData_1_write();
uint16_t readNumOfData_1_write_offset(uint16_t offset_index);
void writeDataToFlash(BLE_Update_Data flash_data_input, uint16_t block_data_length, uint8_t block_index);
BLE_Update_Data readDataBlock1(uint16_t index);
void readDataArrayBlock1(uint16_t index, BLE_Update_Data* flash_data_ptr, uint16_t read_data_length);
void clearFlashData1();

#endif /* INC_PROJECT_FLASH_H_ */
