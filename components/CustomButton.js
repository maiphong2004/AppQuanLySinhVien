// components/CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons'; // Import các bộ icon cần dùng

const CustomButton = ({
  title,
  onPress,
  color = '#007bff', // Màu mặc định
  iconName,
  iconFamily = 'MaterialIcons', // Bộ icon mặc định
  iconSize = 24,
  iconColor = 'white',
  style, // Cho phép truyền style từ bên ngoài
  textStyle, // Cho phép truyền style cho text
}) => {
  const IconComponent =
    iconFamily === 'MaterialIcons' ? MaterialIcons :
    iconFamily === 'Ionicons' ? Ionicons :
    iconFamily === 'AntDesign' ? AntDesign :
    null; // Thêm các bộ icon khác nếu cần

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }, style]}
      onPress={onPress}
    >
      {iconName && IconComponent && (
        <IconComponent name={iconName} size={iconSize} color={iconColor} />
      )}
      <Text style={[styles.buttonText, textStyle, iconName && { marginLeft: 8 }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;