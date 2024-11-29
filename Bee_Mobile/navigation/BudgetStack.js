import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BudgetScreen from '../screens/BudgetSrceen/BudgetList';
import BudgetEdit from '../screens/BudgetSrceen/BudgetEdit';
import BudgetAdd from '../screens/BudgetSrceen/BudgetAdd';
import BudgetDetail from '../screens/BudgetSrceen/BudgetDetail';

const Stack = createStackNavigator();

function AuthStack() {
    return (
        // <Stack.Navigator screenOptions={{ headerShown: false }}>
        //     <Stack.Screen name="Login" component={Login} />
        //     <Stack.Screen name="Register" component={Register} />
        //     <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        //     <Stack.Screen name="TabNavigator" component={TabNavigator} />
        // </Stack.Navigator>
        <Stack.Navigator>
            <Stack.Screen
                name="BudgetList"
                component={BudgetScreen}
                options={{ headerShown: false }} // Tên của trang
            />
            <Stack.Screen
                name="BudgetAdd"
                component={BudgetAdd}
                options={{ title: 'Thêm ngân sách' }} // Tên của trang
            />
            <Stack.Screen
                name="BudgetEdit"
                component={BudgetEdit}
                options={{ title: 'Sửa ngân sách' }} // Tên của trang
            />
            <Stack.Screen
                name="BudgetDetail"
                component={BudgetDetail}
                options={{ title: 'Chi tiết ngân sách' }} // Tên của trang
            />
        </Stack.Navigator>
    );
}

export default AuthStack;
