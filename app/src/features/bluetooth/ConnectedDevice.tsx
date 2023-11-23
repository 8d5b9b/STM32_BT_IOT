import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MyAppState } from "../../redux/store";
import DevicePreview from "./components/DevicePreview";
import AppButton from "../../components/AppButton";
import { DeviceReducerActions } from "../../redux/deviceReducer";
import { MessageReducerActions } from "../../redux/messageReducer";
import * as Bluetooth from "../../utils/ble";
import AppTextInput from "../../components/AppTextInput";
import { BLECharacteristic, BLEDevice } from "../../utils/ble/ble.types";
import decodeMessage from "./utils/decodeMessage";

type Props = {};

const ConnectedDevice = (props: Props) => {
  const dispatch = useDispatch();
  const device = useSelector((state: MyAppState) => state.device);
  const messages = useSelector((state: MyAppState) => state.messages);
  const [input, setInput] = React.useState("");
  const [characteristic, setCharacteristic] =
    React.useState<BLECharacteristic | null>(null);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    if (device && device.state === "connected" && !monitoring) {
      setMonitoring(true);
      clearMessages();
      Bluetooth.getWriteableCharacteristics(device).then((characteristics) => {
        if (characteristics.length > 0) {
          setCharacteristic(characteristics[0]);
        }
      });
    }
  }, [device]);

  const disconnect = () => {
    if (!device) return;
    Bluetooth.disconnectDevice();
  };
  const clearMessages = () => {
    dispatch(MessageReducerActions.clearMessages());
  };
  if (!device) {
    return null;
  }
  return (
    <ScrollView
      style={{
        paddingBottom: 100,
      }}
    >
      <AppButton title="Disconnect" onPress={disconnect} />
      <DevicePreview name={device.name} id={device.id} state={device.state} />
      <Text>Send Message To Device:</Text>
      <AppTextInput value={input} onChangeText={setInput} />
      <AppButton
        title="Send"
        disabled={!characteristic}
        onPress={() => {
          if (!characteristic) return;
          Bluetooth.sendMessageToCharacteristic(characteristic, input);
        }}
      />
      <Text>Messages Received From Device:</Text>
      <AppButton title="Clear" onPress={clearMessages} />

      {messages.map((message, i) => (
        <View key={i} style={{ flexDirection: "row" }}>
          <Text>{message.message}</Text>
          <Text>{JSON.stringify(decodeMessage(message.message))}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default ConnectedDevice;

const styles = StyleSheet.create({});
