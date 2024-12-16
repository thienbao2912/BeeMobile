import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as SecureStore from 'expo-secure-store';

import { addTransactionService } from '../../services/SavingsGoalService';

export default function SavingGoalDetail({ route, navigation }) {
  const { goal } = route.params;
  const [showDeposit, setShowDeposit] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [currentAmount, setCurrentAmount] = useState(goal.currentAmount);
  const [transactionHistory, setTransactionHistory] = useState(goal.transactionHistory || []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const progress = goal.targetAmount ? currentAmount / goal.targetAmount : 0;

  const handleAddTransaction = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ.');
      return;
    }
  
    const remainingAmount = goal.targetAmount - currentAmount;
  
    if (parseFloat(amount) > remainingAmount) {
      Alert.alert(
        'Lỗi',
        `Số tiền nạp vượt quá mục tiêu tiết kiệm. Bạn chỉ cần nạp thêm ${remainingAmount.toLocaleString()}đ để hoàn thành mục tiêu.`
      );
      return;
    }
  
    try {
      const userId = await SecureStore.getItemAsync('userId');
      if (!userId) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
        return;
      }
  
      const transaction = {
        userId,
        goalId: goal._id,
        amount: parseFloat(amount),
        note,
        date: new Date(),
      };
  
      const response = await addTransactionService(transaction);
  
      // Kiểm tra phản hồi từ backend
      if (response.message === 'Số dư không đủ để nạp tiền.') {
        Alert.alert('Lỗi', response.message);
        return;
      }
  
      // Cập nhật số tiền đã tiết kiệm và lịch sử giao dịch
      setCurrentAmount(response.updatedAmount);
      setTransactionHistory([response.transaction, ...transactionHistory]);
  
      // Reset form
      setAmount('');
      setNote('');
      setShowDeposit(false);
      Alert.alert('Thành công', 'Nạp tiền thành công.');
    } catch (error) {
      if (error.message === 'Số dư không đủ để nạp tiền.') {
        Alert.alert('Lỗi', error.message);
      } else {
        Alert.alert('Lỗi', 'Không thể nạp tiền. Vui lòng thử lại.');
      }
    }
  };
  

  return (
    <ScrollView style={tw`p-5 bg-gray-100`}>
      <View style={tw`bg-white p-4 rounded-lg mb-4 relative`}>
        <TouchableOpacity
          style={tw`absolute top-2 right-2`}
          onPress={() => navigation.navigate('SavingGoalEdit', { goalId: goal._id })}
        >
          <Icon name="edit" size={24} color="#6B46C1" />
        </TouchableOpacity>
        <View style={tw`flex-row items-center`}>
        <Image
                  source={
                    goal.categoryId.image && goal.categoryId.image
                      ? { uri: goal.categoryId.image }
                      : require("../../assets/images/rabbit.png")
                  }
                  style={tw`w-10 h-10 mr-5`}
                />
          <View style={tw`flex-1`}>
            <Text style={tw`font-bold text-lg`}>{goal.name}</Text>
            <Text style={tw`text-gray-500`}>
              {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
            </Text>
            <Text style={tw`text-gray-500`}>
              {currentAmount.toLocaleString()}đ / {goal.targetAmount.toLocaleString()}đ
            </Text>
          </View>
        </View>

        {/* Custom Progress Bar */}
        <View style={tw`w-full bg-gray-300 h-2 rounded-full mt-2`}>
          <View
            style={[
              tw`h-2 rounded-full`,
              { width: `${progress * 100}%`, backgroundColor: progress === 1 ? 'green' : 'blue' },
            ]}
          />
        </View>

        <Text style={tw`${progress === 1 ? 'text-green-500' : 'text-blue-500'} font-bold mt-2`}>
          {progress === 1 ? 'Hoàn thành' : `Đã hoàn thành ${Math.floor(progress * 100)}%`}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => setShowDeposit(!showDeposit)}
        style={tw`bg-purple-200 p-3 rounded-lg mb-4`}
      >
        <Text style={tw`text-purple-700 font-bold text-center`}>Nạp tiền</Text>
      </TouchableOpacity>

      {showDeposit && (
        <View style={tw`bg-white p-4 rounded-lg mb-4`}>
          <Text style={tw`font-bold mb-1 text-gray-600`}>Số tiền</Text>
          <TextInput
            style={tw`border border-gray-300 p-2 rounded-md mb-4`}
            placeholder="Nhập số tiền"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, ''); // Loại bỏ ký tự không phải số
              const formattedText = Number(numericText).toLocaleString(); // Thêm dấu phẩy
              setAmount(formattedText);
            }}
          />
          <Text style={tw`font-bold mb-1 text-gray-600`}>Ghi chú</Text>
          <TextInput
            style={tw`border border-gray-300 p-2 rounded-md mb-4`}
            placeholder="Ghi chú"
            value={note}
            onChangeText={setNote}
          />
          <TouchableOpacity
            style={tw`bg-blue-500 p-3 rounded-md`}
            onPress={handleAddTransaction}
          >
            <Text style={tw`text-white text-center font-bold`}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={tw`bg-white p-4 rounded-lg`}>
        <Text style={tw`font-bold mb-4`}>Lịch sử nạp tiền</Text>
        {transactionHistory.length > 0 ? (
          transactionHistory.map((transaction, index) => (
            <View key={index} style={tw`flex-row justify-between mb-3`}>
              <View>
                <Text style={tw`text-green-600 font-bold`}>+{transaction.amount.toLocaleString()}đ</Text>
                <Text style={tw`text-gray-600`}>{transaction.note}</Text>
              </View>
              <Text style={tw`text-gray-600`}>{formatDate(transaction.date)}</Text>
            </View>
          ))
        ) : (
          <Text style={tw`text-gray-600`}>Không có giao dịch nào.</Text>
        )}
      </View>
    </ScrollView>
  );
}
