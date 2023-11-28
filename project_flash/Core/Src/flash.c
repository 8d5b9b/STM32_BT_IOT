#include "main.h"
#include "stm32l4s5i_iot01_qspi.h"

int single_block_data_size =  (MAX_DATA_SINGLE_BLOCK / sizeof(struct flash_data_type));

/**
 * Read the number of struct data in the first data block
 * */

uint16_t readNumOfData_1() {
	uint16_t num = 0;
	uint8_t data;
	for (int i = 0; i < single_block_data_size; i++) {
		// read a byte from the memory address
		if (  BSP_QSPI_Read(&data, BASE_ADDR_BITMAP_1 + i, 1) != QSPI_OK) {
		      	Error_Handler();
		}

		if (data == 0) { // if there is data in the location
			num += 1;
		} else {
			break;
		}
	}
	return num;
}

/**
 * Read Data, starting from an offset
 * */

uint16_t readNumOfData_1_offset(uint16_t offset_index) { // offset is the index of the data to count
	uint16_t num = 0;
	uint8_t data;
	for (int i = offset_index; i < single_block_data_size; i++) {
		// read a byte from the memory address
		if (  BSP_QSPI_Read(&data, BASE_ADDR_BITMAP_1 + i, 1) != QSPI_OK) {
		      	Error_Handler();
		}

		if (data == 0) { // if there is data in the location
			num += 1;
		} else {
			break;
		}
	}
	return num;
}


/**
 * Write a Struct data into the flash
 * In this implementation, if the block max is reached, all memory is deleted
 * If not, add 1 to the memory
 * block_data_length is the existing length of data, the return value of readNumOfData_1()
 * */
void writeDataToFlash(struct flash_data_type flash_data_input, uint16_t block_data_length, uint8_t block_index) {
	// first check the current data length
	uint16_t data_index = block_data_length;
	uint8_t zero = 0;
//	uint8_t one = 15;
	uint32_t data_addr = 0;
	uint32_t bitmap_addr = 0;
	if (block_data_length == single_block_data_size) { // in case the block is full
		// delete all data
		  if (BSP_QSPI_Erase_Block(BASE_ADDR_BITMAP_1) != QSPI_OK) {
		    Error_Handler();
		  }

		  if (BSP_QSPI_Erase_Block(BASE_ADDR_DATA_1) != QSPI_OK) {
		      Error_Handler();
		  }

		  data_index = 0;
	}

	if (block_index == 0) {
		data_addr = BASE_ADDR_DATA_1;
		bitmap_addr = BASE_ADDR_BITMAP_1;
	} else {
		data_addr = BASE_ADDR_DATA_2;
		bitmap_addr = BASE_ADDR_BITMAP_2;
	}

	// write to flash memory first
    if ( BSP_QSPI_Write((uint8_t *) &flash_data_input, data_addr + (data_index * sizeof(struct flash_data_type)), sizeof(struct flash_data_type)) != QSPI_OK) {
        	  Error_Handler();
    }
    // then write to bitmap
    if ( BSP_QSPI_Write((uint8_t *) &zero, bitmap_addr + data_index, 1) != QSPI_OK) {
    	      Error_Handler();
    }

}

/**
 * Read a single struct from the flash
 * */

struct flash_data_type readDataBlock1(uint16_t index) {
	struct flash_data_type flash_data_read;
	uint32_t data_addr = BASE_ADDR_DATA_1;
	if (  BSP_QSPI_Read((uint8_t *)&flash_data_read, data_addr + (index * sizeof(struct flash_data_type)), sizeof(struct flash_data_type)) != QSPI_OK) {
	    Error_Handler();
	}
	return flash_data_read;

}

/**
 * Read flash data into a struct array
 * */

void readDataArrayBlock1(uint16_t index, struct flash_data_type* flash_data_ptr, uint16_t read_data_length) {
	uint32_t data_addr = BASE_ADDR_DATA_1;
	if (  BSP_QSPI_Read((uint8_t *)flash_data_ptr, data_addr + (index * sizeof(struct flash_data_type)), read_data_length * sizeof(struct flash_data_type)) != QSPI_OK) {
	    Error_Handler();
	}
}

/**
 * Clear All Data
 * */
void clearFlashData1() {
	  if (BSP_QSPI_Erase_Block(BASE_ADDR_BITMAP_1) != QSPI_OK) {
	    Error_Handler();
	  }

	  if (BSP_QSPI_Erase_Block(BASE_ADDR_DATA_1) != QSPI_OK) {
	      Error_Handler();
	  }
}
