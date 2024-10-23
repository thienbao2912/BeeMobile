import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";
import { Image } from "react-native";
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

// Dữ liệu giao dịch mẫu với mô tả
const transactions = [
  {
    id: "1",
    title: "Mua hàng", 
    amount: "-50.000đ",
    description: "Mua sách",
    imageSource: require("../../assets/images/diet.png"),
  },
];
const pieData = [
  { key: 1, value: 55, svg: { fill: "#E67E22" } },
  { key: 2, value: 30, svg: { fill: "#7D3C98" } },
  { key: 3, value: 15, svg: { fill: "#F39C12" } },
];
const Home = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Phần tiêu đề và biểu tượng */}
      <View style={styles.header}>
        <View style={styles.moneyView}>
          <Text style={styles.moneyText}>999,888,777.00đ</Text>
          {/* <FontAwesome name="eye" size={24} color="black" style={styles.icon} /> */}
        </View>
        <MaterialIcons name="notifications" size={28} color="black" />
      </View>

      {/* Thẻ nội dung */}
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

          <View style={styles.switchRow}>
            <TouchableOpacity style={styles.switchButton}>
              <Text style={styles.switchText}>Hàng tháng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.switchButton, styles.activeSwitch]}
            >
              <Text style={styles.activeSwitchText}>Hàng năm</Text>
            </TouchableOpacity>
          </View>
        </Card>
        <Card title="Mục tiêu tiết kiệm">
          <View style={styles.savingGoalsContainer}>
            {/* Mục tiêu 1: Du lịch */}
            <View style={styles.savingGoal}>
              <View style={styles.savingIconContainer}>
                <FontAwesome name="suitcase" size={40} color="#7D3C98" />
              </View>
              <Text style={styles.savingGoalText}>Du lịch</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progress,
                    { width: "0%", backgroundColor: "#ccc" },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>0%</Text>
            </View>

            {/* Mục tiêu 2: Học tập */}
            <View style={styles.savingGoal}>
              <View style={styles.savingIconContainer}>
                <FontAwesome name="book" size={40} color="#F39C12" />
              </View>
              <Text style={styles.savingGoalText}>Học tập</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progress,
                    { width: "30%", backgroundColor: "#F7DC6F" },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>30%</Text>
            </View>

            {/* Mục tiêu 3: Tập gym */}
            <View style={styles.savingGoal}>
              <View style={styles.savingIconContainer}>
                <FontAwesome name="dumbbell" size={40} color="#28B463" />
              </View>
              <Text style={styles.savingGoalText}>Tập gym</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progress,
                    { width: "60%", backgroundColor: "#28B463" },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>60%</Text>
            </View>
          </View>
        </Card>

        <Card title="Giao dịch gần đây">
          <FlatList
            data={transactions}
            renderItem={({ item }) => (
              <View style={styles.transactionContainer}>
                <View style={styles.logoContainer}>
                  <Image
                    source={item.imageSource}
                    style={styles.transactionImage}
                  />
                </View>
                <View style={styles.transactionDetails}>
                  {/* Tên giao dịch */}
                  <Text style={styles.transactionTitle}>{item.title}</Text>

                  {/* Mô tả giao dịch */}
                  <Text style={styles.transactionDescription}>
                    {item.description}
                  </Text>

                  {/* Thời gian giao dịch */}
                  <Text style={styles.transactionTime}>{item.time}</Text>
                </View>

                {/* Số tiền nằm bên phải */}
                <Text style={styles.transactionAmount}>{item.amount}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </Card>

        <Card title="Chi tiêu nhiều nhất">
          <Text style={styles.cardTitle}>Chi tiêu nhiều nhất</Text>
          <View style={styles.cardContent}>
            {/* Nội dung chi tiết như danh mục chi tiêu nhiều nhất */}
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
  icon: {
    marginLeft: 10,
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
  yearRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  year: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#b4a7d6",
  },
  arrow: {
    fontSize: 20,
    color: "#b4a7d6",
    marginHorizontal: 10,
  },
  financeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  financeItem: {
    alignItems: "center",
  },
  financeAmountPurple: {
    fontSize: 20, // Giảm kích thước xuống 22
    fontWeight: "bold",
    color: "#7D3C98",
  },
  financeAmountGreen: {
    fontSize: 20, // Giảm kích thước xuống 22
    fontWeight: "bold",
    color: "#28B463",
  },
  financeAmountRed: {
    fontSize: 20, // Giảm kích thước xuống 22
    fontWeight: "bold",
    color: "#E74C3C",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10, // Thêm khoảng cách giữa hàng và các thành phần bên trên
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#ccc",
    borderRadius: 20,
    marginHorizontal: 10, // Tăng khoảng cách giữa các nút
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#ccc",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeSwitch: {
    backgroundColor: "#D7BDE2",
  },
  switchText: {
    color: "#000",
  },
  activeSwitchText: {
    color: "#fff",
  },
  savingGoalsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  savingGoal: {
    alignItems: "center",
    width: 100,
  },
  savingIconContainer: {
    backgroundColor: "#E8D4F6",
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
  },
  savingGoalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginVertical: 5,
  },
  progress: {
    height: "100%",
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: "#333",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  cardContent: {
    paddingTop: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  itemLabel: {
    fontSize: 16,
    color: "#555",
  },
  itemValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  transactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Đẩy số tiền sang phải
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  transactionImage: {
    width: 40,
    height: 40, // Điều chỉnh kích thước theo nhu cầu
    borderRadius: 5, // Nếu bạn muốn làm ảnh tròn
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  transactionDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 5,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red", // Đổi màu số tiền thành màu đỏ
  },
});

export default Home;
