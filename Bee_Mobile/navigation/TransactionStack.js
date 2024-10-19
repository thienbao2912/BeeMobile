import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddTransactionScreen from "../screens/TransactionSrceen/AddTransactionScreen";
import TransactionList from "../screens/TransactionSrceen/TransactionListScreen";
import ExpenseAdd from "../screens/TransactionSrceen/ExpenseSrceen/ExpenseAdd";
import ExpenseDetail from "../screens/TransactionSrceen/ExpenseSrceen/ExpenseDetail";
import IncomeAdd from "../screens/TransactionSrceen/IncomeSrceen/IncomeAdd";
import ExpenseList from "../screens/TransactionSrceen/ExpenseSrceen/ExpenseList";
import IncomeList from "../screens/TransactionSrceen/IncomeSrceen/IncomeList";
import CategoryList from "../screens/TransactionSrceen/ExpenseSrceen/CategoryList";

const TransactionStack = createStackNavigator();

    function TransactionStackScreen() {
        return (
          <TransactionStack.Navigator>
            <TransactionStack.Screen 
              name="TransactionAdd" 
              component={AddTransactionScreen} 
              options={{ title: 'Thêm giao dịch' }} 
            />
            <TransactionStack.Screen 
              name="ExpenseAdd" 
              component={ExpenseAdd} 
              options={{ title: 'Thêm chi tiêu' }} 
            />
            <TransactionStack.Screen 
              name="IncomeAdd" 
              component={IncomeAdd} 
              options={{ title: 'Thêm thu nhập' }} 
            />
            <TransactionStack.Screen 
              name="CategoryList" 
              component={CategoryList} 
              options={{ title: 'Lịch sử giao dịch' }} 
            />
              <TransactionStack.Screen 
              name="ExpenseList" 
              component={ExpenseList} 
              options={{ title: 'Lịch sử chi tiêu' }} 
            />
               <TransactionStack.Screen 
              name="ExpenseDetail" 
              component={ExpenseDetail} 
              options={{ title: 'Lịch sử chi tiêu' }} 
            />
          </TransactionStack.Navigator>
        );
      };

export default TransactionStackScreen;
