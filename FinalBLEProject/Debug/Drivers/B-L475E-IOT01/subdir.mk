################################################################################
# Automatically-generated file. Do not edit!
# Toolchain: GNU Tools for STM32 (11.3.rel1)
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../Drivers/B-L475E-IOT01/stm32l475e_iot01.c \
../Drivers/B-L475E-IOT01/stm32l475e_iot01_accelero.c \
../Drivers/B-L475E-IOT01/stm32l475e_iot01_gyro.c \
../Drivers/B-L475E-IOT01/stm32l475e_iot01_hsensor.c \
../Drivers/B-L475E-IOT01/stm32l475e_iot01_magneto.c \
../Drivers/B-L475E-IOT01/stm32l475e_iot01_psensor.c \
../Drivers/B-L475E-IOT01/stm32l475e_iot01_qspi.c \
../Drivers/B-L475E-IOT01/stm32l475e_iot01_tsensor.c 

OBJS += \
./Drivers/B-L475E-IOT01/stm32l475e_iot01.o \
./Drivers/B-L475E-IOT01/stm32l475e_iot01_accelero.o \
./Drivers/B-L475E-IOT01/stm32l475e_iot01_gyro.o \
./Drivers/B-L475E-IOT01/stm32l475e_iot01_hsensor.o \
./Drivers/B-L475E-IOT01/stm32l475e_iot01_magneto.o \
./Drivers/B-L475E-IOT01/stm32l475e_iot01_psensor.o \
./Drivers/B-L475E-IOT01/stm32l475e_iot01_qspi.o \
./Drivers/B-L475E-IOT01/stm32l475e_iot01_tsensor.o 

C_DEPS += \
./Drivers/B-L475E-IOT01/stm32l475e_iot01.d \
./Drivers/B-L475E-IOT01/stm32l475e_iot01_accelero.d \
./Drivers/B-L475E-IOT01/stm32l475e_iot01_gyro.d \
./Drivers/B-L475E-IOT01/stm32l475e_iot01_hsensor.d \
./Drivers/B-L475E-IOT01/stm32l475e_iot01_magneto.d \
./Drivers/B-L475E-IOT01/stm32l475e_iot01_psensor.d \
./Drivers/B-L475E-IOT01/stm32l475e_iot01_qspi.d \
./Drivers/B-L475E-IOT01/stm32l475e_iot01_tsensor.d 


# Each subdirectory must supply rules for building sources it contributes
Drivers/B-L475E-IOT01/%.o Drivers/B-L475E-IOT01/%.su Drivers/B-L475E-IOT01/%.cyclo: ../Drivers/B-L475E-IOT01/%.c Drivers/B-L475E-IOT01/subdir.mk
	arm-none-eabi-gcc "$<" -mcpu=cortex-m4 -std=gnu11 -g3 -DDEBUG -DUSE_HAL_DRIVER -DSTM32L475xx -c -I../Core/Inc -I../Drivers/STM32L4xx_HAL_Driver/Inc -I../Drivers/STM32L4xx_HAL_Driver/Inc/Legacy -I../Drivers/CMSIS/Device/ST/STM32L4xx/Include -I../Drivers/CMSIS/Include -I../BlueNRG-MS/Target -I../Drivers/BSP/B-L475E-IOT01A1 -I../Middlewares/ST/BlueNRG-MS/utils -I../Middlewares/ST/BlueNRG-MS/includes -I../Middlewares/ST/BlueNRG-MS/hci/hci_tl_patterns/Basic -I"/Users/rreszetnik/Desktop/ECSE_444/STM32_ECSE444/FinalBLEProject/Drivers/B-L475E-IOT01" -I"/Users/rreszetnik/Desktop/ECSE_444/STM32_ECSE444/FinalBLEProject/Drivers/Components" -O0 -ffunction-sections -fdata-sections -Wall -fstack-usage -fcyclomatic-complexity -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfpu=fpv4-sp-d16 -mfloat-abi=hard -mthumb -o "$@"

clean: clean-Drivers-2f-B-2d-L475E-2d-IOT01

clean-Drivers-2f-B-2d-L475E-2d-IOT01:
	-$(RM) ./Drivers/B-L475E-IOT01/stm32l475e_iot01.cyclo ./Drivers/B-L475E-IOT01/stm32l475e_iot01.d ./Drivers/B-L475E-IOT01/stm32l475e_iot01.o ./Drivers/B-L475E-IOT01/stm32l475e_iot01.su ./Drivers/B-L475E-IOT01/stm32l475e_iot01_accelero.cyclo ./Drivers/B-L475E-IOT01/stm32l475e_iot01_accelero.d ./Drivers/B-L475E-IOT01/stm32l475e_iot01_accelero.o ./Drivers/B-L475E-IOT01/stm32l475e_iot01_accelero.su ./Drivers/B-L475E-IOT01/stm32l475e_iot01_gyro.cyclo ./Drivers/B-L475E-IOT01/stm32l475e_iot01_gyro.d ./Drivers/B-L475E-IOT01/stm32l475e_iot01_gyro.o ./Drivers/B-L475E-IOT01/stm32l475e_iot01_gyro.su ./Drivers/B-L475E-IOT01/stm32l475e_iot01_hsensor.cyclo ./Drivers/B-L475E-IOT01/stm32l475e_iot01_hsensor.d ./Drivers/B-L475E-IOT01/stm32l475e_iot01_hsensor.o ./Drivers/B-L475E-IOT01/stm32l475e_iot01_hsensor.su ./Drivers/B-L475E-IOT01/stm32l475e_iot01_magneto.cyclo ./Drivers/B-L475E-IOT01/stm32l475e_iot01_magneto.d ./Drivers/B-L475E-IOT01/stm32l475e_iot01_magneto.o ./Drivers/B-L475E-IOT01/stm32l475e_iot01_magneto.su ./Drivers/B-L475E-IOT01/stm32l475e_iot01_psensor.cyclo ./Drivers/B-L475E-IOT01/stm32l475e_iot01_psensor.d ./Drivers/B-L475E-IOT01/stm32l475e_iot01_psensor.o ./Drivers/B-L475E-IOT01/stm32l475e_iot01_psensor.su ./Drivers/B-L475E-IOT01/stm32l475e_iot01_qspi.cyclo ./Drivers/B-L475E-IOT01/stm32l475e_iot01_qspi.d ./Drivers/B-L475E-IOT01/stm32l475e_iot01_qspi.o ./Drivers/B-L475E-IOT01/stm32l475e_iot01_qspi.su ./Drivers/B-L475E-IOT01/stm32l475e_iot01_tsensor.cyclo ./Drivers/B-L475E-IOT01/stm32l475e_iot01_tsensor.d ./Drivers/B-L475E-IOT01/stm32l475e_iot01_tsensor.o ./Drivers/B-L475E-IOT01/stm32l475e_iot01_tsensor.su

.PHONY: clean-Drivers-2f-B-2d-L475E-2d-IOT01

