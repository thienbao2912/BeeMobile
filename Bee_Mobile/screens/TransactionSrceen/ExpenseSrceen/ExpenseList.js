import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, TextInput, Modal } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import { fetchAllTransactions } from "../../../services/Transaction"; // Add category service
import tw from "twrnc";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';

export default function ExpenseList({ route, navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Tất cả');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const filters = ['Tất cả', 'Khoảng tiền', 'Khoảng thời gian'];

  const handleOpenModal = (transaction) => {
    setTransaction(transaction);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTransaction(null);
  };

  const handleDetail = () => {
    handleCloseModal();
    navigation.navigate('ExpenseDetail', { transaction });
  };

  const handleEdit = () => {
    handleCloseModal();
    if (transaction.type === 'expense') {
      navigation.navigate('ExpenseEdit', { transactionId: transaction._id });
    } else if (transaction.type === 'income') {
      navigation.navigate('IncomeEdit', { transactionId: transaction._id });
    }
  };
  useEffect(() => {
    const loadUserId = async () => {
      const id = await SecureStore.getItemAsync('userId');
      setUserId(id);
    };
    loadUserId();
  }, []);

  const loadTransactions = async () => {
    if (userId) {
      try {
        const data = await fetchAllTransactions();
        let filteredTransactions = data.filter(transaction => transaction.userId === userId);
  
        if (selectedFilter === 'Khoảng tiền') {
          const amountFrom = minAmount ? parseInt(minAmount.replace(/,/g, '')) : 0;
          const amountTo = maxAmount ? parseInt(maxAmount.replace(/,/g, '')) : Infinity;
          filteredTransactions = filteredTransactions.filter(transaction => {
            const amount = Math.abs(transaction.amount);
            return (!amountFrom || amount >= amountFrom) && (!amountTo || amount <= amountTo);
          });
        }
  
        if (selectedFilter === 'Khoảng thời gian') {
          const startOfStartDate = new Date(startDate);
          startOfStartDate.setHours(0, 0, 0, 0);  // Đặt thời gian bắt đầu là 00:00:00
  
          const endOfEndDate = new Date(endDate);
          endOfEndDate.setHours(23, 59, 59, 999);  // Đặt thời gian kết thúc là 23:59:59
  
          filteredTransactions = filteredTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startOfStartDate && transactionDate <= endOfEndDate;
          });
        }
  
        setTransactions(filteredTransactions);
      } catch (error) {
        console.error("Lỗi load dữ liệu", error);
      } finally {
        setLoading(false);
      }
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        setLoading(true);
        loadTransactions();
      }
    }, [route.params?.refresh, userId])
  );

  useEffect(() => {
    loadTransactions();
  }, [userId]);

  const handleAction = (transaction) => {
    navigation.navigate('ExpenseDetail', { transaction });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    return new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-'));
  });

  return (
    <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-2`}>
      <View style={tw`p-4 flex-col items-end`}>
      <View style={tw`flex-row justify-between relative`}>
      <TouchableOpacity 
    style={tw`bg-indigo-50 border-2 border-indigo-400 rounded-lg p-2 mb-2 mr-2 flex-row`}
    onPress={() => setIsDropdownOpen(!isDropdownOpen)} 
  >
    <Text style={tw`text-indigo-400`}>{selectedFilter} </Text>
    <Ionicons name="chevron-down" size={20} style={tw`text-indigo-400`} />
  </TouchableOpacity>

  <TouchableOpacity 
  style={tw`bg-indigo-400 rounded-lg p-2 mb-2`}
  onPress={loadTransactions}
>
  <Ionicons name="checkmark" size={20} color="white" style={tw`text-center`} />
</TouchableOpacity>

</View>

        {isDropdownOpen && (
          <View style={tw`bg-white rounded-lg shadow-md`}> 
            {filters.map((filter, index) => (
              <TouchableOpacity
                key={index}
                style={tw`p-2 border-b border-gray-200`}
                onPress={() => {
                  setSelectedFilter(filter);
                  setMinAmount('');
                  setMaxAmount('');
                  setStartDate(new Date()); 
                  setEndDate(new Date());
                  setIsDropdownOpen(false);
                }}
              >
                <Text style={tw`text-left`}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedFilter === 'Khoảng tiền' && (
          <View style={tw`flex-row justify-between mb-2 w-full`}>
            <TextInput
              placeholder="Từ"
              value={minAmount}
              onChangeText={(input) => {
                const numericValue = input.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
                const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Định dạng với dấu phẩy
                setMinAmount(formattedValue); // Cập nhật giá trị đã định dạng
              }}
              style={tw`border border-indigo-400 rounded-lg p-2 mb-2 w-[48%]`}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Đến"
              value={maxAmount}
              onChangeText={(input) => {
                const numericValue = input.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
                const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Định dạng với dấu phẩy
                setMaxAmount(formattedValue); // Cập nhật giá trị đã định dạng
              }}
              style={tw`border border-indigo-400 rounded-lg p-2 mb-2 w-[48%]`}
              keyboardType="numeric"
            />
          </View>
        )}

        {selectedFilter === 'Khoảng thời gian' && (
          <View style={tw`flex-row justify-between mb-2 w-full`}>
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowStartDatePicker(false);
                  if (date) {
                    setStartDate(date);
                  }
                }}
              />
          <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowEndDatePicker(false);
                  if (date) {
                    setEndDate(date);
                  }
                }}
              /> 
          </View>
        )}
      </View>

      <View style={tw`w-full pl-2 pr-2`}>
      {transactions.length === 0 ? (
          <View style={tw`items-center justify-center`}>
            <Image source={require('../../../assets/images/thumbs-up.png')} style={tw`h-10 w-10`} />
            <Text style={tw`text-gray-500 text-lg mt-4`}>Bạn chưa có chi tiêu nào cả</Text>
          </View>
        ) : (
        sortedDates.map((date) => (
          <View key={date}>
            <View style={tw`bg-indigo-200 p-1.5 rounded-200 mb-3 self-start`}>
              <Text style={tw`text-white font-bold text-xs`}>{date}</Text>
            </View>
            {groupedTransactions[date].map((transaction) => (
              <TouchableOpacity
                key={transaction._id}
                activeOpacity={0.7}
                style={tw`flex-row items-center bg-white rounded-lg p-2.5 mb-3 mx-1`}
                onPress={() => handleOpenModal(transaction)} 
              >
                <View style={tw`p-1.5 mr-4 rounded-2 bg-indigo-50`}>
                  <Image
                    source={{ uri: transaction.categoryId?.image || '../../assets/images/rabbit.png' }}
                    style={tw`w-10 h-10`}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-lg font-bold mb-1`}>
                    {transaction.categoryId ? 
                      (transaction.categoryId.name.length > 20 ? transaction.categoryId.name.substring(0, 20) + '...' : transaction.categoryId.name)
                      : 'Tên danhh mục'}
                  </Text>
                  <Text style={tw`text-base text-gray-600`}>
                    {transaction.description.length > 18 ? transaction.description.substring(0, 18) + '...' : transaction.description}
                  </Text>
                </View>
                <View style={tw`items-end`}>
                  <Text style={[tw`text-lg font-medium`, transaction.type === 'expense' ? tw`text-red-600` : tw`text-green-600`]}>
                    {transaction.type === 'expense' ? '-' : '+'} 
                    {(() => {
                      const formattedAmount = typeof transaction.amount === 'number' 
                        ? Math.abs(transaction.amount).toLocaleString() 
                        : '0';
                      return formattedAmount.length > 10 
                        ? formattedAmount.substring(0, 10) + '...đ' 
                        : formattedAmount + 'đ';
                    })()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))
      )}
      </View>
      <Modal
  visible={isModalVisible}
  transparent={true}
  onRequestClose={handleCloseModal}
>
  <View style={tw`flex-1 justify-end items-center bg-opacity-50 bg-black`}>
    <View style={tw`bg-white rounded-t-3xl w-full p-6 shadow-lg`}>
      <View style={tw`flex-row justify-between mb-4`}>
        <TouchableOpacity
          style={tw`bg-gray-100 rounded-lg px-6 py-3 shadow-md flex-1 mr-2`}
          onPress={handleDetail}
        >
          <Text style={tw`text-indigo-500 text-center font-semibold`}>
            Chi tiết
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={tw`bg-gray-100 rounded-lg px-6 py-3 shadow-md flex-1 ml-2`}
          onPress={handleEdit}
        >
          <Text style={tw`text-indigo-500 text-center font-semibold`}>
            Chỉnh sửa
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={tw`bg-gray-200 rounded-lg p-3 shadow-md`}
        onPress={handleCloseModal}
      >
        <Text style={tw`text-black text-center font-semibold`}>
          Đóng
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </ScrollView>
  );
}
