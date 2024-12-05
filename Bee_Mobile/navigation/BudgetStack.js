import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BudgetScreen from '../screens/BudgetSrceen/BudgetList';
import BudgetEdit from '../screens/BudgetSrceen/BudgetEdit';
import BudgetAdd from '../screens/BudgetSrceen/BudgetAdd';
import BudgetDetail from '../screens/BudgetSrceen/BudgetDetail';
import AddCategoryScreen from '../screens/CategoriesScreen/AddCategoryScreen';

const Stack = createStackNavigator();

function AuthStack() {
    return (
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
            <Stack.Screen
                name="AddCategoryScreen"
                component={AddCategoryScreen}
                options={{ title: "Thêm danh sách danh mục" }}
            />
        </Stack.Navigator>
    );
}

export default AuthStack;
