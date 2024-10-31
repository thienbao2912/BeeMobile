import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";
import { fetchAllTransactions } from "../../services/SavingsGoalService"
import { fetchAllSavingGoalsByUser } from "../../services/SavingsGoalService";
import tw from "twrnc";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

const Card = ({ title, children }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
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
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Lấy userId từ SecureStore
  useEffect(() => {
    const loadUserId = async () => {
      const id = await SecureStore.getItemAsync("userId");
      setUserId(id);
    };
    loadUserId();
  }, []);

  // Tải giao dịch cho người dùng
  const loadTransactions = async () => {
    if (userId) {
      try {
        const data = await fetchAllTransactions();
        const filteredTransactions = data.filter(
          (transaction) => transaction.userId === userId
        );
        setTransactions(filteredTransactions);
      } catch (error) {
        console.error("Lỗi load dữ liệu giao dịch", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Tải mục tiêu tiết kiệm cho người dùng
  const loadSavingGoals = async () => {
    try {
      const id = await SecureStore.getItemAsync("userId"); // Lấy lại userId
      if (id) {
        const goals = await fetchAllSavingGoalsByUser(id); // Gọi hàm fetch với userId
        console.log("Saving goals data:", goals); // Kiểm tra dữ liệu
        setSavingGoals(goals);
      }
    } catch (error) {
      console.error("Error loading saving goals", error);
    } finally {
      setLoading(false);
    }
  };

  // Khi userId thay đổi, tải dữ liệu
  useEffect(() => {
    if (userId) {
      loadTransactions();
      loadSavingGoals(); // Gọi hàm loadSavingGoals
    }
  }, [userId]);

  const navigateToDetail = (transaction) => {
    // Chuyển hướng đến trang chi tiết giao dịch
    navigation.navigate("TransactionDetail", { transaction });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.moneyView}>
          <Text style={styles.moneyText}>999,888,777.00đ</Text>
        </View>
        <MaterialIcons name="notifications" size={28} color="black" />
      </View>

      <View style={styles.cardContainer}>
        <Card title="Thống kê">
          <View style={styles.financeRow}>
            <View style={styles.financeItem}>
              <Text style={styles.financeAmountPurple}>$474,000</Text>
              <Text style={styles.label}>Toàn bộ</Text>
            </View>
            <View style={styles.financeItem}>
              <Text style={styles.financeAmountGreen}>$474,000</Text>
              <Text style={styles.label}>Thu nhập</Text>
            </View>
            <View style={styles.financeItem}>
              <Text style={styles.financeAmountRed}>$474,000</Text>
              <Text style={styles.label}>Chi tiêu</Text>
            </View>
          </View>
        </Card>

        {/* Mục tiêu tiết kiệm */}
        <Card title="Mục tiêu tiết kiệm">
          <FlatList
            data={savingGoals}
            renderItem={({ item }) => (
              <View style={styles.savingGoal}>
                <View style={styles.savingIconContainer}>
                  <FontAwesome name="suitcase" size={40} color="#7D3C98" />
                </View>
                <Text style={styles.savingGoalText}>{item.name}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progress,
                      {
                        width: `${item.progress}%`,
                        backgroundColor: item.color || "#ccc",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{item.progress}%</Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
          />
        </Card>

        {/* Giao dịch */}
        <Card title="Giao dịch">
          <FlatList
            data={transactions.slice(0, 3)}
            keyExtractor={(item) => item._id}
            renderItem={({ item: transaction }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={tw`flex-row items-center bg-white rounded-lg p-2.5 mb-3 mx-1`}
                onPress={() => navigateToDetail(transaction)}
              >
                <View style={tw`p-1.5 mr-4 rounded-2 bg-indigo-50`}>
                  <Image
                    source={{
                      uri:
                        transaction.categoryId?.image ||
                        "../../assets/images/rabbit.png",
                    }}
                    style={tw`w-10 h-10`}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-lg font-bold mb-1`}>
                    {transaction.categoryId
                      ? transaction.categoryId.name.length > 20
                        ? transaction.categoryId.name.substring(0, 20) + "..."
                        : transaction.categoryId.name
                      : "Tên danh mục"}
                  </Text>
                  <Text style={tw`text-base text-gray-600`}>
                    {transaction.description.length > 20
                      ? transaction.description.substring(0, 20) + "..."
                      : transaction.description}
                  </Text>
                </View>
                <View style={tw`items-end`}>
                  <Text
                    style={[
                      tw`text-lg font-medium`,
                      transaction.type === "expense"
                        ? tw`text-red-600`
                        : tw`text-green-600`,
                    ]}
                  >
                    {transaction.type === "expense" ? "-" : "+"}{" "}
                    {(typeof transaction.amount === "number"
                      ? Math.abs(transaction.amount)
                      : 0
                    ).toLocaleString()}{" "}
                    đ
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate("ExpenseList")}
          >
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </Card>

        <Card title="Chi tiêu nhiều nhất">
          <Text style={styles.cardTitle}>Chi tiêu nhiều nhất</Text>
          <View style={styles.cardContent}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemLabel}>Danh mục:</Text>
              <Text style={styles.itemValue}>Ăn uống</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.itemLabel}>Số tiền:</Text>
              <Text style={styles.itemValue}>2,000,000 VND</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.itemLabel}>Ngày:</Text>
              <Text style={styles.itemValue}>10/10/2024</Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#E8D4F6",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moneyView: {
    flexDirection: "row",
    alignItems: "center",
  },
  moneyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginRight: 10,
  },
  cardContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  financeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  financeItem: {
    flex: 1,
    alignItems: "center",
  },
  financeAmountPurple: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7D3C98",
  },
  financeAmountGreen: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  financeAmountRed: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  savingGoal: {
    marginRight: 10,
    alignItems: "center",
  },
  savingIconContainer: {
    marginBottom: 5,
  },
  savingGoalText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#7D3C98",
  },
  progressBar: {
    width: 100,
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  progress: {
    height: "100%",
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  viewAllButton: {
    padding: 10,
    backgroundColor: "#7D3C98",
    borderRadius: 5,
    alignItems: "center",
  },
  viewAllText: {
    color: "#fff",
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  itemLabel: {
    fontWeight: "bold",
  },
  itemValue: {
    color: "#666",
  },
});

export default Home;
