// navigation/AppNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import các màn hình của bạn
import StudentListScreen from "../screens/StudentListScreen";
import StudentDetailScreen from "../screens/StudentDetailScreen";
import AddStudentScreen from "../screens/AddStudentScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="StudentList"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#3498db", // Màu nền của header
        },
        headerTintColor: "#fff", // Màu chữ và icon trên header
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="StudentList"
        component={StudentListScreen}
        options={{ title: "Quản Lý Sinh Viên" }}
      />
      <Stack.Screen
        name="StudentDetail"
        component={StudentDetailScreen}
        options={{ title: "Chi Tiết Sinh Viên" }}
      />
      <Stack.Screen
        name="AddStudent"
        component={AddStudentScreen}
        options={{
          title: "Thêm/Sửa Sinh Viên",
          presentation: "modal", // <-- Thay đổi ở đây: màn hình sẽ xuất hiện như một modal
          // presentation: 'fullScreenModal', // Tùy chọn khác cho modal toàn màn hình, thử cái này nếu 'modal' không như ý
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
