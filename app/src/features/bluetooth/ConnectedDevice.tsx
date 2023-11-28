import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
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
import moment from "moment"
import Svg, { Circle, Rect } from 'react-native-svg';

type Props = {};

const ConnectedDevice = (props: Props) => {
  const dispatch = useDispatch();
  const device = useSelector((state: MyAppState) => state.device);
  const messages = useSelector((state: MyAppState) => state.messages);
  const [input, setInput] = React.useState("");
  const [characteristic, setCharacteristic] =
    React.useState<BLECharacteristic | null>(null);
  const [monitoring, setMonitoring] = useState(false);
  const latestMessage= useMemo(() =>{
    if(messages.length===0) return null
    
    const decoded= decodeMessage(messages[messages.length-1].message) 
    return decoded[decoded.length-1]
  }, [messages]); 

  const graphData = useMemo(() => {
    return messages.flatMap(message=>decodeMessage(message.message)).map(message=>{
      return {
        date: moment().add(message.timestamp, 'milliseconds').subtract(latestMessage?.timestamp,'milliseconds').toDate(),
        value: message.noise
      }
     })

  }, [messages, latestMessage]);
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
      {/* <Text>Send Message To Device:</Text>
      <AppTextInput value={input} onChangeText={setInput} /> */}
      <Svg height="50%" width="50%" viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="45" stroke="blue" strokeWidth="2.5" fill="green" />
        <Rect x="15" y="15" width="70" height="70" stroke="red" strokeWidth="2" fill="yellow" />
      </Svg>
      {/* <AppButton
        title="Send"
        disabled={!characteristic}
        onPress={() => {
          if (!characteristic) return;
          Bluetooth.sendMessageToCharacteristic(characteristic, input);
        }}
      /> */}
      <View>
        <Text>Pressure: {latestMessage?.pressure}</Text>
        <Text>Temperature: {latestMessage?.temperature}</Text>
        <Text>Humidity: {latestMessage?.humidity}</Text>
        <Text>Noise: {latestMessage?.noise}</Text>
      </View>
      {/* {['pressure','temperature','humidity','noise'].map((item) => (<View><Text>{decodeMessage(messages[messages.length-1].message)[item]}</Text></View>))} */}
      <Text>Messages Received From Device:</Text>
      <AppButton title="Clear" onPress={clearMessages} />
     {/* <LineGraph points={graphData} color="#4484B2" animated/> */}
    </ScrollView>
  );
};

export default ConnectedDevice;

const styles = StyleSheet.create({});
