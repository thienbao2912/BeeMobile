import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function TransactionList() {
  const navigation = useNavigation();

  // Tổng số dư ban đầu
  const [totalBalance, setTotalBalance] = useState(1000000); // Ví dụ số dư ban đầu là 1,000,000 đ

  // Dữ liệu giao dịch bao gồm cả thu nhập và chi tiêu
  const transactions = [
    {
      id: 1,
      type: 'expense',
      category: { id: 1, name: 'Ăn uống', image: require('../../assets/images/diet.png') },
      description: 'Ăn trưa với bạn bè',
      amount: 120000,
      date: '08-10-2024',
    },
    {
      id: 2,
      type: 'expense',
      category: { id: 2, name: 'Di chuyển', image: require('../../assets/images/vehicle.png') },
      description: 'Taxi về nhà',
      amount: 50000,
      date: '07-10-2024',
    },
    {
      id: 3,
      type: 'income',
      category: { id: 3, name: 'Lương', image: require('../../assets/images/salary.png') },
      description: 'Lương tháng 10',
      amount: 15000000,
      date: '07-10-2024',
    },
    {
      id: 4,
      type: 'income',
      category: { id: 4, name: 'Thu nhập khác', image: require('../../assets/images/rabbit.png') },
      description: 'Tiền thưởng',
      amount: 500000,
      date: '06-10-2024',
    },
  ];

  // Hàm cắt bớt văn bản dài
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Nhóm giao dịch theo ngày
  const transactionsByDate = transactions.reduce((groupedTransactions, transaction) => {
    const { date } = transaction;
    if (!groupedTransactions[date]) {
      groupedTransactions[date] = [];
    }
    groupedTransactions[date].push(transaction);
    return groupedTransactions;
  }, {});

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView>
        {Object.keys(transactionsByDate).map((date) => (
          <View key={date}>
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>{date}</Text>
            </View>

            {transactionsByDate[date].map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                activeOpacity={0.7}
                style={styles.transactionItem}
                onPress={() => navigation.navigate(transaction.type === 'expense' ? 'ExpenseDetail' : 'IncomeDetail', { transaction })}
              >
                <View style={styles.iconWrapper}>
                  <Image
                    source={transaction.category.image}
                    style={styles.icon}
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.categoryName}>
                    {truncateText(transaction.category.name, 14)}
                  </Text>
                  <Text style={styles.description}>
                    {truncateText(transaction.description, 20)}
                  </Text>
                </View>
                <View style={styles.dateAmountWrapper}>
                  <Text style={[styles.amount, transaction.type === 'expense' ? styles.expenseAmount : styles.incomeAmount]}>
                    {transaction.type === 'expense' ? `- ${transaction.amount.toLocaleString('vi-VN')} đ` : `+ ${transaction.amount.toLocaleString('vi-VN')} đ`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('TransactionAdd')}
      >
        <Text style={styles.addButtonText}>Thêm Giao Dịch</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  dateBadge: {
    backgroundColor: '#d3d8f8', 
    padding: 5, 
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  dateBadgeText: {
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 12, 
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  iconWrapper: {
    padding: 5,
    marginRight: 15,
    borderRadius: 11,
    backgroundColor: '#F2F3FF',
  },
  icon: {
    width: 40,
    height: 40,
  },
  transactionDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  dateAmountWrapper: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 17,
    fontWeight: '500',
  },
  expenseAmount: {
    color: '#e74c3c',
  },
  incomeAmount: {
    color: '#27ae60',
  },
  addButton: {
    backgroundColor: '#5A5DD1', 
    padding: 15,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
