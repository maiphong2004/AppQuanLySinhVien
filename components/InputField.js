// components/InputField.js
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  editable = true,
  style,
}) => {
  return (
    <View style={[styles.formGroup, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#bdc3c7" // Màu placeholder
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 18, // Tăng khoảng cách giữa các input
  },
  label: {
    fontSize: 15, // Kích thước nhỏ hơn một chút
    marginBottom: 6, // Khoảng cách nhỏ hơn
    fontWeight: "600", // Semi-bold
    color: "#333333", // Màu văn bản đậm
  },
  input: {
    backgroundColor: "#ffffff", // Nền trắng
    borderWidth: 1,
    borderColor: "#bdc3c7", // Màu border mềm mại hơn
    borderRadius: 8,
    padding: 12, // Tăng padding
    fontSize: 16,
    color: "#333333", // Màu chữ nhập vào
    elevation: 1, // Thêm shadow nhẹ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});

export default InputField;
