import React from "react";
import { Text, View, TextInput, Image, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import ExpenseList from "../screens/TransactionSrceen/ExpenseSrceen/ExpenseList";
import Home from "../screens/HomeSreen/Home";
import SavingFundList from "../screens/SavingFundScreen/SavingFundList";
import SavingFundDetail from "../screens/SavingFundScreen/SavingFundDetail";
import SavingFundAdd from "../screens/SavingFundScreen/SavingFundAdd";
import ExpenseDetail from "../screens/TransactionSrceen/ExpenseSrceen/ExpenseDetail";
import AddCategoryScreen from "../screens/CategoriesScreen/AddCategoryScreen";
import CategoryListScreen from "../screens/CategoriesScreen/CategoriesListScreen";
import SavingFundEdit from "../screens/SavingFundScreen/SavingFundEdit";
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
      <Stack.Screen
        name="SavingFundList"
        component={SavingFundList}
        options={{ title: 'Danh sách quỹ chung' }} />
      <Stack.Screen
        name="SavingFundDetail"
        component={SavingFundDetail}
        options={{ title: 'Chi tiết' }} />
      <Stack.Screen
        name="SavingFundAdd"
        component={SavingFundAdd}
        options={{ title: 'Thêm quỹ chung' }} />
         <Stack.Screen
        name="SavingFundEdit"
        component={SavingFundEdit}
        options={{ title: 'Chỉnh sửa quỹ chung' }} />
      <Stack.Screen
        name="AddCategoryScreen"
        component={AddCategoryScreen}
        options={{ title: "Thêm danh sách danh mục" }}
      />
      <Stack.Screen
        name="CategoryListScreen"
        component={CategoryListScreen}
        options={{ title: "Danh sách danh mục" }}
      />
      <Stack.Screen
      name="ExpenseDetail"
      component={ExpenseDetail}
      options={{ title: 'Danh sách chi tiêu' }}  // Ví dụ đặt tiêu đề cho trang ExpenseList
    />
    </Stack.Navigator>


  );
}

export default AppStack;
