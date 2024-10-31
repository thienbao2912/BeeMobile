import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddTransactionScreen from "../screens/TransactionSrceen/AddTransactionScreen";
import TransactionList from "../screens/TransactionSrceen/TransactionListScreen";
import ExpenseAdd from "../screens/TransactionSrceen/ExpenseSrceen/ExpenseAdd";
import IncomeAdd from "../screens/TransactionSrceen/IncomeSrceen/IncomeAdd";
import ExpenseDetail from "../screens/TransactionSrceen/ExpenseSrceen/ExpenseDetail";
import ExpenseList from "../screens/TransactionSrceen/ExpenseSrceen/ExpenseList";
import IncomeList from "../screens/TransactionSrceen/IncomeSrceen/IncomeList";
import ExpenseEdit from "../screens/TransactionSrceen/ExpenseSrceen/ExpenseEdit";
import IncomeEdit from "../screens/TransactionSrceen/IncomeSrceen/IncomeEdit";

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
              name="ExpenseList" 
              component={ExpenseList} 
              options={{ title: 'Lịch sử giao dịch' }} 
            />
               <TransactionStack.Screen 
              name="ExpenseDetail" 
              component={ExpenseDetail} 
              options={{ title: 'Chi tiết' }} 
            />
             <TransactionStack.Screen 
              name="ExpenseEdit" 
              component={ExpenseEdit} 
              options={{ title: 'Chỉnh sửa' }} 
            />
             <TransactionStack.Screen 
              name="IncomeEdit" 
              component={IncomeEdit} 
              options={{ title: 'Chỉnh sửa' }} 
            />
          </TransactionStack.Navigator>
        );
      };

export default TransactionStackScreen;
