import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import CustomDeleteModal from '../../../components/Popup';
import { fetchAllTransactions, deleteTransaction } from "../../../services/Transaction";
import tw from "twrnc";
import { SwipeListView, SectionList } from 'react-native-swipe-list-view';
import { Ionicons } from '@expo/vector-icons';

export default function ExpenseList({ route, navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const filters = ["Tất cả", "Khoảng tiền", "Khoảng thời gian"];

  const handleOpenModal = (transaction) => {
    setTransaction(transaction);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTransaction(null);
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
        const filteredTransactions = data.filter(transaction => transaction.userId === userId);
        filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(filteredTransactions);
      } catch (error) {
        console.error("Error loading data", error);
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

  const handleDetail = () => {
    if (selectedTransaction) {
      navigation.navigate('ExpenseDetail', { transaction: selectedTransaction });
    }
  };

  const handleEdit = (transaction) => {
    if (transaction.type === 'expense') {
      navigation.navigate('ExpenseEdit', { transactionId: transaction._id });
    } else if (transaction.type === 'income') {
      navigation.navigate('IncomeEdit', { transactionId: transaction._id });
    }
  };

  const cancelDeleteExpense = () => {
    setIsModalVisible(false);
    setSelectedTransaction(null);
  };

  const handleDelete = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalVisible(true);
  };

  const confirmDeleteExpense = async () => {
    if (!selectedTransaction) return;

    // console.log("Deleting transaction with ID: ", selectedTransaction._id);

    try {
      await deleteTransaction(selectedTransaction._id);
      loadTransactions();
      // Alert.alert("Giao dịch đã được xóa thành công");
    } catch (error) {
      console.error('Lỗi xóa giao dịch', error);
      Alert.alert("Lỗi xóa giao dịch");
    } finally {
      setIsModalVisible(false);setSelectedTransaction(null);
    }
  };

  const groupedTransactions = Object.entries(
    transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(transaction);
      return acc;
    }, {})
  ).map(([date, transactions]) => ({ date, data: transactions }));

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={1}
      style={tw`flex-row items-center bg-white rounded-lg p-2.5 mb-3 mx-1`}
      onPress={() => {
        setSelectedTransaction(item);
        handleDetail();
      }}
    >
      <View style={tw`p-1.5 mr-4 rounded-2 bg-indigo-50`}>
        <Image
          source={{ uri: item.categoryId?.image || require('../../../assets/images/rabbit.png') }}
          style={tw`w-10 h-10`}
        />
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-lg font-bold mb-1`}>
          {item.categoryId ? (item.categoryId.name.length > 20 ? item.categoryId.name.substring(0, 20) + '...' : item.categoryId.name) : 'Tên danh mục'}
        </Text>
        <Text style={tw`text-base text-gray-600`}>
          {item.description.length > 18 ? item.description.substring(0, 18) + '...' : item.description}
        </Text>
      </View>
      <View style={tw`items-end`}>
        <Text style={[tw`text-lg font-medium`, item.type === 'expense' ? tw`text-red-600` : tw`text-green-600`]}>
          {item.type === 'expense' ? '-' : '+'}
          {new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(item.amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHiddenItem = (data) => (
    <View style={tw`flex-row justify-end rounded-lg`}>
      <TouchableOpacity
        style={tw`bg-green-400 justify-center items-center w-20 h-18 rounded-lg`}
        onPress={() => handleEdit(data.item)}
      >
        <Ionicons name="pencil" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`bg-red-400 justify-center items-center w-20 h-18 rounded-lg mr-1`}
        onPress={() => handleDelete(data.item)}
      >
        <Ionicons name="trash" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = ({ section: { date } }) => (
    <View style={tw`p-2 bg-indigo-200 rounded-full self-start mt-2 mb-2 ml-2`}>
      <Text style={tw`text-xs text-white font-semibold`}>{date}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size={40} color="#0000ff" />;
  }

  return (
    <>
      <SwipeListView
        useSectionList
        sections={groupedTransactions}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        renderSectionHeader={renderSectionHeader}
        rightOpenValue={-150}
        stopRightSwipe={-150}
        previewRowKey={"0"}
        previewOpenValue={-40}previewOpenDelay={3000}
        disableRightSwipe
      />
      <CustomDeleteModal
        isVisible={isModalVisible}
        onConfirm={confirmDeleteExpense}
        onCancel={cancelDeleteExpense}
        message="Bạn chắc chắn xóa giao dịch này?"
      />
    </>
  );
}