// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StudentProvider } from "./data/StudentContext";
import AppNavigator from "./navigation/AppNavigator";
import FlashMessage from "react-native-flash-message"; // <-- Import FlashMessage

export default function App() {
  return (
    <StudentProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <FlashMessage position="top" />
    </StudentProvider>
  );
}
