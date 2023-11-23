import {
  View,
  StyleSheet,
  TextInput,
  TextInputProps,
  Text,
} from "react-native";
import React from "react";

interface Props extends TextInputProps {}

const AppTextInput = ({ ...props }: Props) => {
  return (
    <TextInput
      autoCapitalize="none"
      {...props}
      style={styles.input}
      placeholderTextColor={"#666"}
    />
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    padding: 8,
    margin: 2,
    backgroundColor: "#ddd",
    width: "80%",
    fontSize: 18,
    color: "black",
  },
});
