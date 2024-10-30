import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomDeleteModal from '../../../components/Popup';
import { deleteTransaction } from '../../../services/Transaction';
import tw from "twrnc";

export default function ExpenseDetail({ route, navigation }) {
  const { transaction } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(false);
    };

    loadData();
  }, []);

  const handleEditExpense = () => {
    if (transaction.type === 'expense') {
      navigation.navigate('ExpenseEdit', { transactionId: transaction._id  });
    } else if (transaction.type === 'income') {
      navigation.navigate('IncomeEdit', { transactionId: transaction._id });
    }
  };

  const handleDeleteExpense = () => {
    setIsModalVisible(true);
  };

  const confirmDeleteExpense = async () => {
    console.log("Deleting transaction with ID: ", transaction._id);
  
    try {
      await deleteTransaction(transaction._id);
      navigation.navigate('ExpenseList', { refresh: true });
    } catch (error) {
      console.error('Lỗi xóa giao dịch', error);
      Alert.alert("Lỗi xóa giao dịch");
    } finally {
      setIsModalVisible(false);
    }
  };
  
  const cancelDeleteExpense = () => {
    setIsModalVisible(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', options); 
  };

  return (
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      {loading ? (
        <ActivityIndicator size="large" color="#A57EF4" />
      ) : (
        <>
          <View style={tw`bg-white rounded-lg shadow-md mb-5 p-5`}>
            <View style={tw`flex-row items-center mb-4`}>
              <View style={tw`bg-indigo-200 p-2 rounded-lg mr-3`}>
                <Ionicons name="information-circle-outline" size={24} style={tw`text-indigo-500`} />
              </View>
              <Text style={tw`text-lg font-medium`}>Danh mục</Text>
            </View>
            <View style={tw`flex-row items-center mb-4`}>
              <Image
                source={{ uri: transaction.categoryId.image }}
                style={tw`w-12 h-12 mr-3`}
              />
              <Text style={tw`text-2xl font-medium text-gray-800`}>
                {transaction.categoryId.name}
              </Text>
            </View>
          </View>

          <View style={tw`bg-white rounded-lg shadow-md mb-5 p-5`}>
            <View style={tw`mb-4`}>
              <View style={tw`flex-row items-center mb-3`}>
                <View style={tw`bg-violet-200 p-2 rounded-lg mr-3`}>
                  <Ionicons name="cash-outline" size={24} style={tw`text-violet-500`} />
                </View>
                <Text style={[tw`text-lg font-bold`, transaction.type === 'expense' ? tw`text-red-500` : tw`text-green-500`]}>
                  {transaction.type === 'expense' ? '-' : '+'} {Math.abs(transaction.amount).toLocaleString()} đ
                </Text>
              </View>
              
              <View style={tw`flex-row items-start mb-3`}>
                <View style={tw`bg-violet-200 p-2 rounded-lg mr-3`}>
                  <Ionicons name="clipboard-outline" size={24} style={tw`text-violet-500`} />
                </View>
                <View style={tw`border-2 border-indigo-200 rounded-lg p-4 bg-gray-50 flex-1`}>
                  <Text style={tw`text-gray-700`}>{transaction.description}</Text>
                </View>
              </View>

              <View style={tw`flex-row items-center`}>
                <View style={tw`bg-violet-200 p-2 rounded-lg mr-3`}>
                  <Ionicons name="calendar-outline" size={24} style={tw`text-violet-500`} />
                </View>
                <Text style={tw`text-gray-700`}>{formatDate(transaction.date)}</Text>
              </View>
            </View>
          </View>

          <View style={tw`absolute top-3 right-3 flex-row`}>
            <TouchableOpacity style={tw`p-2 bg-white rounded-full shadow-md`} onPress={handleEditExpense}>
              <Ionicons name="pencil" size={20} color="#A57EF4" />
            </TouchableOpacity>
            <TouchableOpacity style={tw`p-2 bg-white rounded-full shadow-md ml-3`} onPress={handleDeleteExpense}>
              <Ionicons name="trash-outline" size={20} color="#fc8181" />
            </TouchableOpacity>
          </View>

          <CustomDeleteModal
            isVisible={isModalVisible}
            onConfirm={confirmDeleteExpense} 
            onCancel={cancelDeleteExpense}
            message="Bạn chắc chắn xóa giao dịch này?"
          />
        </>
      )}
    </View>
  );
}
