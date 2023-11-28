################################################################################
# Automatically-generated file. Do not edit!
# Toolchain: GNU Tools for STM32 (11.3.rel1)
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../BlueNRG-MS/Target/hci_tl_interface.c 

OBJS += \
./BlueNRG-MS/Target/hci_tl_interface.o 

C_DEPS += \
./BlueNRG-MS/Target/hci_tl_interface.d 


# Each subdirectory must supply rules for building sources it contributes
BlueNRG-MS/Target/%.o BlueNRG-MS/Target/%.su BlueNRG-MS/Target/%.cyclo: ../BlueNRG-MS/Target/%.c BlueNRG-MS/Target/subdir.mk
	arm-none-eabi-gcc "$<" -mcpu=cortex-m4 -std=gnu11 -g3 -DDEBUG -DUSE_HAL_DRIVER -DSTM32L475xx -c -I../Core/Inc -I../Drivers/STM32L4xx_HAL_Driver/Inc -I../Drivers/STM32L4xx_HAL_Driver/Inc/Legacy -I../Drivers/CMSIS/Device/ST/STM32L4xx/Include -I../Drivers/CMSIS/Include -I../BlueNRG-MS/Target -I../Drivers/BSP/B-L475E-IOT01A1 -I../Middlewares/ST/BlueNRG-MS/utils -I../Middlewares/ST/BlueNRG-MS/includes -I../Middlewares/ST/BlueNRG-MS/hci/hci_tl_patterns/Basic -I"/Users/rreszetnik/Desktop/ECSE_444/STM32_ECSE444/FinalBLEProject/Drivers/B-L475E-IOT01" -I"/Users/rreszetnik/Desktop/ECSE_444/STM32_ECSE444/FinalBLEProject/Drivers/Components" -O0 -ffunction-sections -fdata-sections -Wall -fstack-usage -fcyclomatic-complexity -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfpu=fpv4-sp-d16 -mfloat-abi=hard -mthumb -o "$@"

clean: clean-BlueNRG-2d-MS-2f-Target

clean-BlueNRG-2d-MS-2f-Target:
	-$(RM) ./BlueNRG-MS/Target/hci_tl_interface.cyclo ./BlueNRG-MS/Target/hci_tl_interface.d ./BlueNRG-MS/Target/hci_tl_interface.o ./BlueNRG-MS/Target/hci_tl_interface.su

.PHONY: clean-BlueNRG-2d-MS-2f-Target

