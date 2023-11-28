/*
 * project_ble.c
 *
 *  Created on: Nov 20, 2023
 *      Author: rreszetnik
 */
#include "project_ble.h"
#include "project_flash.h"
#include "project_sensor.h"
#include "hci.h"
#include "hci_le.h"
#include "hci_tl.h"
#include "link_layer.h"

#include "compiler.h"
#include "bluenrg_utils.h"
#include "bluenrg_gap.h"
#include "bluenrg_gap_aci.h"
#include "bluenrg_gatt_aci.h"
#include "bluenrg_hal_aci.h"
#include "sm.h"
#include "stm32l4xx_hal_tim.h"

extern volatile uint8_t set_connectable;
extern volatile int     connected;
/* at startup, suppose the X-NUCLEO-IDB04A1 is used */
uint8_t bnrg_expansion_board = IDB04A1;
uint8_t bdaddr[BDADDR_SIZE];
BLE_Update_Data data_to_send[15];

#define HOST_TO_LE_16(buf, val)    ( ((buf)[1] =  (uint8_t) (val)    ) , \
		((buf)[0] =  (uint8_t) (val>>8) ) )

/** @brief Macro that stores Value into a buffer in Big Endian Format (4 bytes) */
#define HOST_TO_LE_32(buf, val)    ( ((buf)[3] =  (uint8_t) (val)     ) , \
		((buf)[2] =  (uint8_t) (val>>8)  ) , \
		((buf)[1] =  (uint8_t) (val>>16) ) , \
		((buf)[0] =  (uint8_t) (val>>24) ) )

#define COPY_UUID_128(uuid_struct, uuid_15, uuid_14, uuid_13, uuid_12, uuid_11, uuid_10, uuid_9, uuid_8, uuid_7, uuid_6, uuid_5, uuid_4, uuid_3, uuid_2, uuid_1, uuid_0) \
		do {\
			uuid_struct[0] = uuid_0; uuid_struct[1] = uuid_1; uuid_struct[2] = uuid_2; uuid_struct[3] = uuid_3; \
			uuid_struct[4] = uuid_4; uuid_struct[5] = uuid_5; uuid_struct[6] = uuid_6; uuid_struct[7] = uuid_7; \
			uuid_struct[8] = uuid_8; uuid_struct[9] = uuid_9; uuid_struct[10] = uuid_10; uuid_struct[11] = uuid_11; \
			uuid_struct[12] = uuid_12; uuid_struct[13] = uuid_13; uuid_struct[14] = uuid_14; uuid_struct[15] = uuid_15; \
		}while(0)

/* Hardware Characteristics Service */
#define COPY_SENSOR_DATA_SERVICE_UUID(uuid_struct)    COPY_UUID_128(uuid_struct,0x00,0x00,0x00,0x00,0x00,0x01,0x11,0xe1,0x9a,0xb4,0x00,0x02,0xa5,0xd5,0xc5,0x1b)
#define COPY_SENSOR_DATA_CHAR_UUID(uuid_struct) COPY_UUID_128(uuid_struct,0x00,0x00,0x00,0x00,0x00,0x01,0x11,0xe1,0xac,0x36,0x00,0x02,0xa5,0xd5,0xc5,0x1b)

uint16_t SDServHandle, SDCharHandle;
extern uint16_t connection_handle;
/* UUIDS */
Service_UUID_t service_uuid;
Char_UUID_t char_uuid;

static void User_Init(void);
tBleStatus Add_SensorData_Service(void);

void init_ble(){
	const char *name = "Sensor1";
	uint16_t service_handle, dev_name_char_handle, appearance_char_handle;

	uint8_t  bdaddr_len_out;
	uint8_t  hwVersion;
	uint16_t fwVersion;
	int ret;

	User_Init();

	hci_init(user_notify, NULL);

	/* get the BlueNRG HW and FW versions */
	getBlueNRGVersion(&hwVersion, &fwVersion);

	/*
	 * Reset BlueNRG again otherwise we won't
	 * be able to change its MAC address.
	 * aci_hal_write_config_data() must be the first
	 * command after reset otherwise it will fail.
	 */
	hci_reset();
	HAL_Delay(100);

	PRINTF("HWver %d\nFWver %d\n", hwVersion, fwVersion);
	if (hwVersion > 0x30) { /* X-NUCLEO-IDB05A1 expansion board is used */
		bnrg_expansion_board = IDB05A1;
	}

	ret = aci_hal_read_config_data(CONFIG_DATA_RANDOM_ADDRESS, BDADDR_SIZE, &bdaddr_len_out, bdaddr);

	if (ret) {
		PRINTF("Read Static Random address failed.\n");
	}

	if ((bdaddr[5] & 0xC0) != 0xC0) {
		PRINTF("Static Random address not well formed.\n");
		while(1);
	}

	/* GATT Init */
	ret = aci_gatt_init();
	if(ret){
		PRINTF("GATT_Init failed.\n");
	}

	/* GAP Init */
	if (bnrg_expansion_board == IDB05A1) {
		ret = aci_gap_init_IDB05A1(GAP_PERIPHERAL_ROLE_IDB05A1, 0, 0x07, &service_handle, &dev_name_char_handle, &appearance_char_handle);
	}
	else {
		ret = aci_gap_init_IDB04A1(GAP_PERIPHERAL_ROLE_IDB04A1, &service_handle, &dev_name_char_handle, &appearance_char_handle);
	}
	if (ret != BLE_STATUS_SUCCESS) {
		PRINTF("GAP_Init failed.\n");
	}

	/* Update device name */
	ret = aci_gatt_update_char_value(service_handle, dev_name_char_handle, 0,
			strlen(name), (uint8_t *)name);
	if (ret) {
		PRINTF("aci_gatt_update_char_value failed.\n");
		while(1);
	}

	ret = aci_gap_set_auth_requirement(MITM_PROTECTION_REQUIRED,
			OOB_AUTH_DATA_ABSENT,
			NULL,
			7,
			16,
			USE_FIXED_PIN_FOR_PAIRING,
			123456,
			BONDING);
	if (ret) {
		PRINTF("aci_gap_set_authentication_requirement failed.\n");
		while(1);
	}

	PRINTF("BLE Stack Initialized\n");

	ret = (int) Add_SensorData_Service();
	if(ret == BLE_STATUS_SUCCESS) {
		PRINTF("BlueMS HW service added successfully.\n");
	} else {
		PRINTF("Error while adding BlueMS HW service: 0x%02x\r\n", ret);
		while(1);
	}

	/* Set output power level */
	ret = aci_hal_set_tx_power_level(1,4);
}
void User_Init(void)
{
	//	BSP_LED_Init(LED2);
	//	BSP_COM_Init(COM1);
}

tBleStatus Add_SensorData_Service(void)
{
	tBleStatus ret;
	uint8_t uuid[16];

	/* Add_HWServW2ST_Service */
	COPY_SENSOR_DATA_SERVICE_UUID(uuid);
	BLUENRG_memcpy(&service_uuid.Service_UUID_128, uuid, 16);
	ret = aci_gatt_add_serv(UUID_TYPE_128, service_uuid.Service_UUID_128, PRIMARY_SERVICE,
			1+3*5, &SDServHandle);
	if (ret != BLE_STATUS_SUCCESS)
		return BLE_STATUS_ERROR;

	/* Fill the Environmental BLE Characteristc */
	COPY_SENSOR_DATA_CHAR_UUID(uuid);
	uuid[14] |= 0x04; /* One Temperature value*/
	uuid[14] |= 0x10; /* Pressure value*/
	BLUENRG_memcpy(&char_uuid.Char_UUID_128, uuid, 16);
	ret =  aci_gatt_add_char(SDServHandle, UUID_TYPE_128, char_uuid.Char_UUID_128,
			BLE_DATA_SIZE*15+2,
			CHAR_PROP_NOTIFY|CHAR_PROP_READ,
			ATTR_PERMISSION_NONE,
			GATT_NOTIFY_READ_REQ_AND_WAIT_FOR_APPL_RESP,
			16, 0, &SDCharHandle);
	if (ret != BLE_STATUS_SUCCESS)
		return BLE_STATUS_ERROR;

	return BLE_STATUS_SUCCESS;
}


tBleStatus Sensor_Reading_Update(int32_t time, int16_t press, int16_t temp,int16_t humidity, int32_t noise)
{
	tBleStatus ret;
	uint8_t buff[BLE_DATA_SIZE+2];
	HOST_TO_LE_16(buff,1);
	HOST_TO_LE_32(buff+2,time);
	HOST_TO_LE_16(buff+6,press);
	HOST_TO_LE_16(buff+8,temp);
	HOST_TO_LE_16(buff+10,humidity);
	HOST_TO_LE_32(buff+12,noise);

	ret = aci_gatt_update_char_value(SDServHandle, SDCharHandle,
			0, BLE_DATA_SIZE+2, buff);

	if (ret != BLE_STATUS_SUCCESS){
		PRINTF("Error while updating TEMP characteristic: 0x%04X\n",ret) ;
		return BLE_STATUS_ERROR ;
	}

	return BLE_STATUS_SUCCESS;
}
tBleStatus Sensor_Reading_Update_Multiple(BLE_Update_Data * readings,uint16_t length){
	tBleStatus ret;
	uint8_t buff[length*BLE_DATA_SIZE+2];
//	uint8_t buff[200];
	HOST_TO_LE_16(buff,length);
	for(uint16_t i = 0; i < length; i++){
		uint16_t offset = i*BLE_DATA_SIZE+2;
		HOST_TO_LE_32(buff+offset,readings[i].timestamp);
		HOST_TO_LE_16(buff+offset+4,readings[i].pressure);
		HOST_TO_LE_32(buff+offset+6,readings[i].temperature);
		HOST_TO_LE_16(buff+offset+10,readings[i].humidity);
		HOST_TO_LE_32(buff+offset+12,readings[i].noise);
	}


	ret = aci_gatt_update_char_value(SDServHandle, SDCharHandle,
			0, length*BLE_DATA_SIZE+2, buff);

	if (ret != BLE_STATUS_SUCCESS){
		PRINTF("Error while updating TEMP characteristic: 0x%04X\n",ret) ;
		return BLE_STATUS_ERROR ;
	}

	return BLE_STATUS_SUCCESS;
}


void Read_Request_CB(uint16_t handle)
{
	tBleStatus ret;

	if (handle == SDCharHandle + 1)
	{
		//for if the phone tries to "Read" the data, can maybe just disable this feature if we don't want it
		Sensor_Reading_Update(1,2,3,4,5);
	}

	if(connection_handle !=0)
	{
		ret = aci_gatt_allow_read(connection_handle);
		if (ret != BLE_STATUS_SUCCESS)
		{
			PRINTF("aci_gatt_allow_read() failed: 0x%02x\r\n", ret);
		}
	}
}


int getBLEConnected(){
	return connected;
}

void run_ble(BLE_Update_Data data){
	if (set_connectable)
	{
		Set_DeviceConnectable();
		set_connectable = FALSE;
	}
	uint16_t data_length = readNumOfData_1();
	if(connected){
		if(data_length >0){
			HAL_Delay(3000);
			uint8_t section_size = 5;
			BLE_Update_Data send_buffer[section_size];
			BLE_Update_Data buffer_1[data_length+1];
			readDataArrayBlock1(0, buffer_1, data_length);
			buffer_1[data_length] = data;

			uint8_t num_full_packets = (data_length+1)/section_size;
			for(int i = 0; i < num_full_packets;i++){
				for(int k = 0; k < section_size; k++){
					send_buffer[k]=buffer_1[k+i*section_size];
				}
				Sensor_Reading_Update_Multiple(&send_buffer,section_size);
				HAL_Delay(250);
			}
			uint8_t remainder = (data_length+1)%section_size;
			for(int k = 0; k < remainder; k++){
				send_buffer[k]=buffer_1[k+num_full_packets*section_size];
			}
			Sensor_Reading_Update_Multiple(&send_buffer,remainder);
			clearFlashData1();
		}else{
			//send singular reading
			Sensor_Reading_Update_Multiple(&data,1);
		}
	}else{
		writeDataToFlash(data,data_length,0);
	}
	hci_user_evt_proc();
}
