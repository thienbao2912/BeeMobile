import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddCategoryScreen from "../screens/CategoriesScreen/AddCategoryScreen";
import CategoryListScreen from "../screens/CategoriesScreen/CategoriesListScreen";
import CategoryDetail from "../screens/CategoriesScreen/CategoryDetailScreen";
import ExpenseListCate from "../screens/CategoriesScreen/ExpenseScreen/ExpenseList";
const CategoriesStack = createStackNavigator();

function CategoriesStackScreen() {
  return (
    <CategoriesStack.Navigator>
      <CategoriesStack.Screen
        name="CategoriesAdd"
        component={AddCategoryScreen}
        options={{ title: "Thêm danh mục" }}
      />
      <CategoriesStack.Screen
        name="ExpenseListCate"
        component={ExpenseListCate}
        options={{ title: "Danh sách danh mục" }}
      />
      <CategoriesStack.Screen
        name="CategoriesDetail"
        component={CategoryDetail}
        options={{ title: "Chi tiết danh mục" }}
      />
    </CategoriesStack.Navigator>
  );
}
export default CategoriesStackScreen;
