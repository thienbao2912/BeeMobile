import React from "react";
import { Text, View, TextInput, Image, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import ExpenseList from "../screens/TransactionSrceen/ExpenseSrceen/ExpenseList";
import Home from "../screens/HomeSreen/Home";
// import ExpenseDetail from "../screens/TransactionSrceen/ExpenseSrceen/ExpenseDetail";
const Stack = createStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{ headerShown: false }}  // Không hiển thị header cho trang Home
    />
    <Stack.Screen
      name="ExpenseList"
      component={ExpenseList}
      options={{ title: 'Danh sách chi tiêu' }}  // Ví dụ đặt tiêu đề cho trang ExpenseList
    />
     {/* <Stack.Screen
      name="ExpenseDetail"
      component={ExpenseDetail}
      options={{ title: 'Danh sách chi tiêu' }}  // Ví dụ đặt tiêu đề cho trang ExpenseList
    /> */}
  </Stack.Navigator>
  
  
  );
}

export default AppStack;
