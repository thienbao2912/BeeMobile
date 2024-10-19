import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView } from "react-native";
import Svg, { Ellipse } from "react-native-svg";
import tw from "twrnc";
import { fetchAllTransactions } from "../../../services/Transaction"; // Adjust the import based on your service structure
import * as SecureStore from 'expo-secure-store'; // Import SecureStore

export default function ExpenseList({ navigation }) {
  const [transactions, setTransactions] = useState([]); // Renamed to transactions to reflect both types
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // State to hold userId

  useEffect(() => {
    const loadUserId = async () => {
      const id = await SecureStore.getItemAsync('userId'); // Get userId from SecureStore
      setUserId(id);
    };

    loadUserId();
  }, []);

  useEffect(() => {
    const loadTransactions = async () => {
      if (userId) {
        try {
          const data = await fetchAllTransactions(); // Fetching transactions from the service
          console.log("Fetched transactions data:", data); // Log the data to check structure

          // Filter transactions for the current user
          const filteredTransactions = data.filter(transaction => transaction.userId === userId);
          setTransactions(filteredTransactions);
        } catch (error) {
          console.error("Error loading transactions", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTransactions();
  }, [userId]); // Re-run when userId is set

  const navigateToDetail = (transaction) => {
    navigation.navigate('ExpenseDetail', { transaction }); // Navigate to detail screen
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString(); // Format the date as needed
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {});

  return (
    <ScrollView style={tw`flex-1`} contentContainerStyle={tw`items-center p-2`}>
      <View style={tw`w-full mt-2 pl-2 pr-2`}>
        {Object.keys(groupedTransactions).map((date) => (
          <View key={date}>
            <View style={tw`bg-indigo-200 p-1.5 rounded-200 mb-3 self-start`}>
              <Text style={tw`text-white font-bold text-xs`}>{date}</Text>
            </View>
            {groupedTransactions[date].map((transaction) => (
              <TouchableOpacity
                key={transaction._id}
                activeOpacity={0.7}
                style={tw`flex-row items-center bg-white rounded-lg p-2.5 mb-3 mx-1`}
                onPress={() => navigateToDetail(transaction)}
              >
                <View style={tw`p-1.5 mr-4 rounded-2 bg-indigo-50`}>
                  <Image
                    source={{ uri: transaction.categoryId?.image || '../../assets/images/rabbit.png' }} // Fallback to placeholder
                    style={tw`w-10 h-10`}
                  />
                </View>
                <View style={tw`flex-1`}>
            <Text style={tw`text-lg font-bold mb-1`}>
  {transaction.categoryId ? 
    (transaction.categoryId.name.length > 20 ? transaction.categoryId.name.substring(0, 20) + '...' : transaction.categoryId.name)
    : 'No category assigned'}
</Text>
<Text style={tw`text-base text-gray-600`}>
  {transaction.description.length > 20 ? transaction.description.substring(0, 20) + '...' : transaction.description}
</Text>

              
                </View>
                <View style={tw`items-end`}>
                  <Text style={[tw`text-lg font-medium`, transaction.type === 'expense' ? tw`text-red-600` : tw`text-green-600`]}>
                    {transaction.type === 'expense' ? '-' : '+'} {(typeof transaction.amount === 'number' ? Math.abs(transaction.amount) : 0).toLocaleString()}đ
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
