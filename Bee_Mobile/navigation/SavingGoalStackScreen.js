import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SavingGoalScreen from '../screens/SavingGoalScreen/SavingGoalList';
import SavingGoalAdd from '../screens/SavingGoalScreen/SavingGoalAdd';
import SavingGoalEdit from '../screens/SavingGoalScreen/SavingGoalEdit';
import SavingGoalDetail from '../screens/SavingGoalScreen/SavingGoalDetail';

const SavingGoalStack = createStackNavigator();

function SavingGoalStackScreen() {
  return (
    <SavingGoalStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#7c3aed" }, // Đặt màu nền của header
        headerTintColor: "#fff", // Màu chữ của tiêu đề
        headerTitleStyle: { fontWeight: "bold" }, // Kiểu chữ tiêu đề
      }}
    >
      <SavingGoalStack.Screen 
        name="SavingGoalList" 
        component={SavingGoalScreen} 
        options={{ title: 'Danh sách mục tiêu' }} 
      />
      <SavingGoalStack.Screen 
        name="SavingGoalAdd" 
        component={SavingGoalAdd} 
        options={{ title: 'Thêm mục tiêu' }} 
      />
      <SavingGoalStack.Screen 
        name="SavingGoalEdit" 
        component={SavingGoalEdit} 
        options={{ title: 'Sửa mục tiêu' }} 
      />
      <SavingGoalStack.Screen 
        name="SavingGoalDetail" 
        component={SavingGoalDetail} 
        options={{ title: 'Chi tiết mục tiêu' }} 
      />
    </SavingGoalStack.Navigator>
  );
};

export default SavingGoalStackScreen;
