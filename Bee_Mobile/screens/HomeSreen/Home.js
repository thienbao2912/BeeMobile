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
import DateTimePicker from "@react-native-community/datetimepicker";
import PropTypes from "prop-types";
import { fetchAllSavingGoalsByUser } from "../../services/SavingsGoalService";
import { fetchAllTransactions } from "../../services/Transaction";
import tw from "twrnc";
import * as SecureStore from "expo-secure-store";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getUserProfile } from "../../services/Auth";
import { fetchAllSavingFund } from "../../services/SavingsFundService";

const Card = ({ title, children }) => (
  <View style={tw`bg-white rounded-lg p-5 mb-4 shadow-md`}>
    <Text style={tw`text-xl font-bold mb-3`}>{title}</Text>
    {children}
  </View>
);

Card.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const filterByDateRange = (data, startDate, endDate) =>
  data.filter((item) => {
    const date = new Date(item.date);
    return date >= startDate && date <= endDate;
  });

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [savingGoals, setSavingGoals] = useState([]);
  const [userId, setUserId] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredTransactions, setFilteredTransactions] = useState({});
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [filterOption, setFilterOption] = useState("today");
  const [savingsFund, setSavingFund] = useState([]);
  const navigation = useNavigation();

  const loadUserData = useCallback(async () => {
    setLoading(true);
    try {
      const id = await SecureStore.getItemAsync("userId");
      if (id) {
        setUserId(id);

        const [transactionsData, goalsData, userProfile, fundData,BudgetData] = await Promise.all([
          fetchAllTransactions(),
          fetchAllSavingGoalsByUser(id),
          getUserProfile(),
          fetchAllSavingFund(),
        
        ]);

        setTransactions(
          transactionsData.filter((transaction) => transaction.userId === id)
        );
        setSavingGoals(goalsData);
        setSavingFund(fundData);
       
        setWallet(userProfile.wallet || 0);
      }
    } catch (error) {
console.error("Lỗi tải dữ liệu người dùng:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData])
  );

  const filterOptions = [
    { label: "Hôm nay", value: "today" },
    { label: "Tuần này", value: "week" },
    { label: "Tháng này", value: "month" },
    { label: "Năm này", value: "year" },
    { label: "Tùy chỉnh", value: "custom" },
  ];
  const calculateDateRange = (option) => {
    const now = new Date();
    switch (option) {
      case "today":
        return { startDate: new Date(now.setHours(0, 0, 0, 0)), endDate: new Date() };
      case "week":
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        return { startDate: weekStart, endDate: new Date() };
      case "month":
        return { startDate: new Date(now.getFullYear(), now.getMonth(), 1), endDate: new Date() };
      case "year":
        return { startDate: new Date(now.getFullYear(), 0, 1), endDate: new Date() };
      case "custom":
      default:
        return null;
    }
  };

  useEffect(() => {
    if (filterOption !== "custom") {
      const { startDate: newStartDate, endDate: newEndDate } = calculateDateRange(filterOption);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    }
  }, [filterOption]);
  const validateDateRange = () => {
    if (startDate > endDate) {
      Alert.alert("Lỗi", "Ngày bắt đầu không thể lớn hơn ngày kết thúc.");
      return false;
    }
    return true;
  };
  useEffect(() => {
    const calculateTotalAmount = (data) =>
      data.reduce((sum, item) => sum + (item.amount || 0), 0);

    const filteredIncome = filterByDateRange(
      transactions.filter((txn) => txn.type === "income"),
      startDate,
      endDate
    );
    const totalIncome = calculateTotalAmount(filteredIncome);


    const filteredExpense = filterByDateRange(
      transactions.filter((txn) => txn.type === "expense"),
      startDate,
      endDate
    );
    const totalExpense = calculateTotalAmount(filteredExpense);

    const filteredSavingGoals = savingGoals.map((goal) => ({
      ...goal,
      filteredTransactionHistory: filterByDateRange(
        goal.transactionHistory || [],
        startDate,
        endDate
      )

    }));
    const totalSavings = calculateTotalAmount(
      filteredSavingGoals.flatMap((goal) => goal.filteredTransactionHistory)
    );

    setFilteredTransactions({
      income: filteredIncome,
      expense: filteredExpense,
      savingGoals: filteredSavingGoals,
      totalIncome,
      totalExpense,
      totalSavings,
      // budget,
    });
  }, [startDate, endDate, transactions, savingGoals]);

  const navigateToDetail = (transaction) => {
    navigation.navigate("TransactionDetail", { transaction });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#7D3C98" style={tw`mt-4`} />;
  }

  return (
    <FlatList
      data={[]}
contentContainerStyle={tw`bg-gray-100`}
      ListHeaderComponent={() => (
        <View style={tw`mt-10 flex-1`}>
          <View style={tw`bg-purple-400 p-5 flex-row justify-between items-center`}>
            <Text style={tw`text-2xl font-bold text-white`}>
              {isVisible ? `${wallet.toLocaleString()}đ` : "*** đ"}
            </Text>
            <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
              <MaterialIcons
                name={isVisible ? "visibility" : "visibility-off"}
                size={28}
                color="black"
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filterOptions}
            horizontal
            keyExtractor={(item) => item.value}
            contentContainerStyle={tw`mt-4`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  tw`p-2 mr-1 rounded-full`,
                  filterOption === item.value ? tw`bg-indigo-400` : tw`bg-gray-200 border border-indigo-200`,
                ]}
                onPress={() => setFilterOption(item.value)}
              >
                <Text style={tw`${filterOption === item.value ? "text-white" : "text-indigo-500"}`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
         {filterOption === "custom" && (
  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 }}>
    {/* Picker cho ngày bắt đầu */}
    <View style={{ flex: 1, marginRight: 10 }}>
      <Text style={{ marginBottom: 5, fontSize: 14, color: "#666" }}>Từ ngày</Text>
      <TouchableOpacity
        onPress={() => setShowStartPicker(true)}
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
        }}
      >
        <Text>{startDate ? startDate.toLocaleDateString() : "Chọn ngày"}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}
    </View>

    {/* Picker cho ngày kết thúc */}
    <View style={{ flex: 1 }}>
      <Text style={{ marginBottom: 5, fontSize: 14, color: "#666" }}>Đến ngày</Text>
      <TouchableOpacity
        onPress={() => setShowEndPicker(true)}
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
        }}
      >
        <Text>{endDate ? endDate.toLocaleDateString() : "Chọn ngày"}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}
    </View>
  </View>
)}


          <View style={tw`p-5`}>
            <Card title="Thống kê">
              <View style={tw`flex-row justify-between`}>
                {/* Income */}
                <View style={tw`flex-1 items-center`}>
                  <Text style={tw`text-sm font-bold text-green-600`}>
                    {isVisible
                      ? filteredTransactions.totalIncome.toLocaleString()
: "*** đ"}
                  </Text>
                  <Text style={tw`text-xs text-gray-600`}>Thu nhập</Text>
                </View>
                {/* Expense */}
                <View style={tw`flex-1 items-center`}>
                  <Text style={tw`text-sm font-bold text-red-600`}>
                    {isVisible
                      ? filteredTransactions.totalExpense.toLocaleString()
                      : "*** đ"}
                  </Text>
                  <Text style={tw`text-xs text-gray-600`}>Chi tiêu</Text>
                </View>
                {/* Savings */}
                <View style={tw`flex-1 items-center`}>
                  <Text style={tw`text-sm font-bold text-blue-600`}>
                    {isVisible
                      ? filteredTransactions.totalSavings.toLocaleString()
                      : "*** đ"}
                  </Text>
                  <Text style={tw`text-xs text-gray-600`}>Tiết kiệm</Text>
                </View>
              </View>
            </Card>

            <View title="Quỹ tiết kiệm" style={tw`mb-5`}>
  <TouchableOpacity
    style={tw`self-end items-center mt-4`}
    onPress={() => navigation.navigate("SavingFundList")}
  >
    <Text style={tw`text-sm font-medium text-purple-700 mt-1`}>Xem tất cả</Text>
  </TouchableOpacity>

  <FlatList
    data={savingsFund.reverse()}
    renderItem={({ item }) => {
      const progress = item.currentAmount / item.targetAmount;
      const progressPercentage = Math.floor(progress * 100) || 0;
      return (
        <View style={[tw`mr-4 bg-white rounded-lg shadow-lg`, { width: 150, height: 150 }]}>
          <View style={tw`flex-row items-center p-2`}>
            <View style={tw`p-2 bg-indigo-100 rounded-full`}>
              <Image
                source={
                  item.categoryId && item.categoryId.image
                    ? { uri: item.categoryId.image }
                    : require("../../assets/images/rabbit.png")
                }
                style={tw`w-8 h-8 rounded-full`}
              />
            </View>

            <Text style={tw`text-sm text-gray-800 font-semibold ml-2`}>
              {item.name && item.name.length > 8 ? `${item.name.substring(0, 8)}...` : item.name || "Chưa có tên"}
            </Text>
          </View>

          {/* Phần nội dung */}
          <View style={tw`p-3 rounded-lg border-t border-gray-200`}>
            <View style={tw`w-full h-2 bg-gray-300 rounded-full overflow-hidden`}>
              <View
                style={[
                  tw`h-full ${item.color ? `bg-[${item.color}]` : "bg-purple-700"}`,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
            <Text style={tw`text-xs text-gray-500 mt-1`}>{progressPercentage}%</Text>
          </View>
        </View>
      );
    }}
    keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
    horizontal={true}
ListEmptyComponent={
      <Text style={tw`text-center text-gray-500 mt-5`}>Chưa có mục tiêu chung</Text>
    }
  />
</View>


            <Card title="Mục tiêu tiết kiệm">
              <FlatList
                data={savingGoals.reverse()}
                renderItem={({ item }) => {
                  const progress = item.currentAmount / item.targetAmount;
                  const progressPercentage = Math.floor(progress * 100) || 0;
                  return (
                    <View style={tw`mr-4 items-center`}>
                      <Image
                        source={
                          item.categoryId && item.categoryId.image
                            ? { uri: item.categoryId.image }
                            : require("../../assets/images/rabbit.png")
                        }
                        style={tw`w-10 h-10`}
                      />
                      <Text style={tw`text-base text-purple-700 mb-1`}>
                        {item.name || "Chưa có tên"}
                      </Text>
                      <View style={tw`w-24 h-2 bg-gray-300 rounded-full overflow-hidden`}>
                        <View
                          style={[
                            tw`h-full ${item.color ? `bg-[${item.color}]` : "bg-purple-700"}`,
                            { width: `${progressPercentage}%` },
                          ]}
                        />
                      </View>
                      <Text style={tw`text-sm text-gray-500 mt-1`}>
                        {progressPercentage}%
                      </Text>
                    </View>
                  );
                }}
                keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                horizontal={true}
                ListEmptyComponent={
                  <Text style={tw`text-center text-gray-500 mt-5`}>Chưa có mục tiêu tiết kiệm</Text>
                }
              />
            </Card>

            <Card title="Giao dịch">
              <FlatList
                data={transactions.slice(0, 3)}
                keyExtractor={(item) =>
                  item._id ? item._id.toString() : Math.random().toString()
                }
                renderItem={({ item: transaction }) => (
                  <TouchableOpacity
                    style={tw`flex-row items-center bg-white rounded-lg p-3 mb-3 shadow-sm`}
                  ><View style={tw`p-2 mr-3 bg-indigo-50 rounded-lg`}>
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
                      <Text
                        style={tw`text-lg font-medium ${transaction.type === "expense" ? "text-red-600" : "text-green-600"}`}
                      >
                        {transaction.type === "expense" ? "-" : "+"}{" "}
                        {Math.abs(transaction.amount || 0).toLocaleString()} đ
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

            {/* <Card title="Ngân sách">
              <FlatList
                data={savingGoals.reverse()}
                renderItem={({ item }) => {
                  const progress = item.currentAmount / item.targetAmount;
                  const progressPercentage = Math.floor(progress * 100) || 0;
                  return (
                    <View style={tw`mr-4 items-center`}>
                      <Image
                        source={
                          item.categoryId && item.categoryId.image
                            ? { uri: item.categoryId.image }
                            : require("../../assets/images/rabbit.png")
                        }
                        style={tw`w-10 h-10`}
                      />
                      <Text style={tw`text-base text-purple-700 mb-1`}>
                        {item.name || "Chưa có tên"}
                      </Text>
                      <View style={tw`w-24 h-2 bg-gray-300 rounded-full overflow-hidden`}>
                        <View
                          style={[
                            tw`h-full ${item.color ? `bg-[${item.color}]` : "bg-purple-700"}`,
                            { width: `${progressPercentage}%` },
                          ]}
                        />
                      </View>
                      <Text style={tw`text-sm text-gray-500 mt-1`}>
                        {progressPercentage}%
                      </Text>
                    </View>
                  );
                }}
keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                horizontal={true}
                ListEmptyComponent={
                  <Text style={tw`text-center text-gray-500 mt-5`}>Chưa có mục tiêu tiết kiệm</Text>
                }
              />
            </Card> */}
          </View>
        </View>
      )}
      ListFooterComponent={() => <View style={{ height: 20 }} />} // optional footer for padding
      keyExtractor={(item, index) => index.toString()}
    />
  );

};

export default Home;