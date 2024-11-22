import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";
import { fetchAllSavingGoalsByUser } from "../../services/SavingsGoalService";
import { fetchAllTransactions } from "../../services/Transaction";
import tw from "twrnc";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { getUserProfile } from "../../services/Auth";

const Card = ({ title, children }) => {
  return (
    <View style={tw`bg-white rounded-lg p-5 mb-4 shadow-md`}>
      <Text style={tw`text-xl font-bold mb-3`}>{title}</Text>
      {children}
    </View>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [savingGoals, setSavingGoals] = useState([]);
  const [userId, setUserId] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(true);
  

  const loadUserData = useCallback(async () => {
    setLoading(true);
    try {
      const id = await SecureStore.getItemAsync("userId");
      if (id) {
        setUserId(id);

        const [transactionsData, goalsData, userProfile] = await Promise.all([
          fetchAllTransactions(),
          fetchAllSavingGoalsByUser(id),
          getUserProfile(),
        ]);

        setTransactions(
          transactionsData.filter((transaction) => transaction.userId === id)
        );
        setSavingGoals(goalsData);
        setWallet(userProfile.wallet || 0);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu người dùng:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalSaving = savingGoals
    .reduce((sum, savingGoals) => sum + savingGoals.currentAmount, 0);
  const navigateToDetail = (transaction) => {
    navigation.navigate("TransactionDetail", { transaction });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#7D3C98" style={tw`mt-4`} />;
  }

  return (
    <ScrollView style={tw`mt-10 flex-1 bg-gray-100`}>
      <View style={tw`bg-purple-200 p-5 flex-row justify-between items-center`}>
        <Text style={tw`text-2xl font-bold text-black`}>
          {isVisible ? `${wallet.toLocaleString()}đ` : '*** đ'}
        </Text>
        <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
          <MaterialIcons name={isVisible ? 'visibility' : 'visibility-off'} size={28} color="black" />
        </TouchableOpacity>
      </View>

      <View style={tw`p-5`}>
        <Card title="Thống kê">
          <View style={tw`flex-row justify-between`}>
            <View style={tw`flex-1 items-center`}>
              <Text style={tw`text-sm font-bold text-green-600`}>
                {isVisible
                  ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalIncome)
                  : '***'}
              </Text>
              <Text style={tw`text-xs text-gray-600`}>Thu nhập</Text>
            </View>
            <View style={tw`flex-1 items-center`}>
              <Text style={tw`text-sm font-bold text-red-600`}>
                {isVisible
                  ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalExpense)
                  : '***'}
              </Text>
              <Text style={tw`text-xs text-gray-600`}>Chi tiêu</Text>
            </View>
            <View style={tw`flex-1 items-center`}>
              <Text style={tw`text-sm font-bold text-blue-600`}>
                {isVisible
                  ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalSaving)
                  : '***'}
              </Text>
              <Text style={tw`text-xs text-gray-600`}>Tiết kiệm</Text>
            </View>
          </View>
        </Card>



        <Card title="Mục tiêu tiết kiệm">
          <FlatList
            data={savingGoals.reverse()}
            renderItem={({ item }) => {
              const progress = item.currentAmount / item.targetAmount;
              const progressPercentage = Math.floor(progress * 100) || 0;
              return (
                <View style={tw`mr-4 items-center`}>
                  <FontAwesome name="suitcase" size={40} color="#7D3C98" style={tw`mb-2`} />
                  <Text style={tw`text-base text-purple-700 mb-1`}>{item.name || "Chưa có tên"}</Text>
                  <View style={tw`w-24 h-2 bg-gray-300 rounded-full overflow-hidden`}>
                    <View
                      style={[
                        tw`h-full ${item.color ? `bg-[${item.color}]` : "bg-purple-700"}`,
                        { width: `${progressPercentage}%` },
                      ]}
                    />
                  </View>
                  <Text style={tw`text-sm text-gray-500 mt-1`}>{progressPercentage}%</Text>
                </View>
              );
            }}
            keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
            horizontal={true}
            ListEmptyComponent={<Text style={tw`text-center text-gray-500 mt-5`}>Chưa có mục tiêu tiết kiệm</Text>}
          />
        </Card>

        <Card title="Giao dịch">
          <FlatList
            data={transactions.slice(0, 3)}
            keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
            renderItem={({ item: transaction }) => (
              <TouchableOpacity
                style={tw`flex-row items-center bg-white rounded-lg p-3 mb-3 shadow-sm`}
                onPress={() => navigateToDetail(transaction)}
              >
                <View style={tw`p-2 mr-3 bg-indigo-50 rounded-lg`}>
                  <Image
                    source={
                      transaction.categoryId && transaction.categoryId.image
                        ? { uri: transaction.categoryId.image }
                        : require("../../assets/images/rabbit.png")
                    }
                    style={tw`w-10 h-10`}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-lg font-semibold`}>
                    {transaction.categoryId?.name?.length > 20
                      ? `${transaction.categoryId.name.substring(0, 20)}...`
                      : transaction.categoryId?.name || "Tên danh mục"}
                  </Text>
                  <Text style={tw`text-sm text-gray-500`}>
                    {transaction.description.length > 20
                      ? `${transaction.description.substring(0, 20)}...`
                      : transaction.description}
                  </Text>
                </View>
                <View style={tw`items-end`}>
                  <Text style={tw`text-lg font-medium ${transaction.type === "expense" ? "text-red-600" : "text-green-600"}`}>
                    {transaction.type === "expense" ? "-" : "+"} {Math.abs(transaction.amount || 0).toLocaleString()} đ
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={tw`p-3 bg-purple-700 rounded-lg items-center mt-3`}
            onPress={() => navigation.navigate("ExpenseList")}
          >
            <Text style={tw`text-white text-base`}>Xem tất cả</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
};

export default Home;
