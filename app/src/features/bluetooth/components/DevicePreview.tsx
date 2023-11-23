import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { BLEState } from "../../../utils/ble/ble.types";
import Card from "../../../components/AppCard";

type Props = {
  name: string;
  id: string;
  onPress?: () => void;
  onLongPress?: () => void;
  state?: BLEState;
};

const DevicePreview = (props: Props) => {
  const isLoading = useMemo(
    () => props.state === "searching" || props.state === "connecting",
    [props.state]
  );
  const message = useMemo(() => {
    switch (props.state) {
      case "disconnected":
        return "Not Connected";
      case "searching":
        return "Searching";
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting";
      default:
        return "Not Connected";
    }
  }, [props.state]);

  return (
    <Card onPress={props.onPress} onLongPress={props.onLongPress}>
      <View style={styles.container}>
        <View>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.id}>{props.id}</Text>
        </View>
        <View style={styles.moreInfoContainer}>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <Text>{message}</Text>
            {isLoading && <ActivityIndicator size="small" />}
          </View>
        </View>
      </View>
    </Card>
  );
};

export default DevicePreview;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fff",
    margin: 2,
    padding: 5,
    marginHorizontal: 20,
    borderRadius: 5,
    elevation: 3,
  },
  moreInfoContainer: {
    flexGrow: 1,
    alignItems: "flex-end",
    marginTop: "auto",
    marginBottom: "auto",
    paddingRight: 20,
  },
  container: {
    flexDirection: "row",
  },
  name: {
    fontSize: 20,
  },
  id: {
    opacity: 0.5,
    fontSize: 12,
  },
});
