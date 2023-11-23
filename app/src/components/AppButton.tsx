import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

type Props = {
  title: string;
  type?: "button" | "text";
  onPress: () => void;
  disabled?: boolean;
  size?: "regular" | "small";
  icon?: React.ReactNode;
};

const AppButton = ({
  title,
  disabled,
  type = "button",
  onPress,
  size = "regular",
  icon,
}: Props) => {
  if (type === "text")
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={{ margin: 10 }}
      >
        <Text style={styles.textButton}>{title}</Text>
      </TouchableOpacity>
    );
  if (icon)
    return (
      <TouchableOpacity
        style={{ padding: size === "regular" ? 10 : 0 }}
        onPress={onPress}
        disabled={disabled}
      >
        {icon}
      </TouchableOpacity>
    );

  return (
    <View style={{ ...styles.background, opacity: disabled ? 0.5 : 1 }}>
      <TouchableOpacity
        style={{ ...styles.button, padding: size === "regular" ? 10 : 8 }}
        onPress={onPress}
        disabled={disabled}
      >
        <Text
          style={{ ...styles.text, fontSize: size === "regular" ? 24 : 15 }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#5082f0",
    borderRadius: 5,
  },
  background: {
    backgroundColor: "white",
    borderRadius: 5,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "black",
    shadowRadius: 2,
    shadowOpacity: 1,
    shadowOffset: {
      width: -1,
      height: 3,
    },
  },
  text: {
    color: "white",
    textAlign: "center",
  },
  textButton: {
    color: "#5082f0",
    fontSize: 18,
    textAlign: "center",
  },
});
