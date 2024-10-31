import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomDeleteModal from '../../../components/Popup';

export default function TransactionDetail({ route, navigation }) {
  const { transaction } = route.params;
  const [amount, setAmount] = useState(transaction.amount || 0);
  const [description, setDescription] = useState(transaction.description || "Không có mô tả");
  const [date, setDate] = useState(transaction.date || "Không có ngày");
  const [selectedCategory, setSelectedCategory] = useState(transaction.category || { name: "Chưa xác định" });
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    console.log('Transaction Detail:', transaction);
  }, [transaction]);

  const handleEditTransaction = () => {
    navigation.navigate('TransactionEdit', { transaction });
  };

  const handleDeleteTransaction = () => {
    setIsModalVisible(true);
  };

  const confirmDeleteTransaction = () => {
    console.log('Delete Transaction');
    setIsModalVisible(false);
    // Thực hiện xóa giao dịch ở đây
  };

  const cancelDeleteTransaction = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
    
      <View style={styles.card}>
        <View style={styles.detailRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="information-circle-outline" style={styles.icon} />
          </View>
          <View>
            <Text style={styles.text}>Danh mục</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Image
            source={require('../../../assets/images/hard-work.png')}
            style={styles.imageCategory}
          />
          <Text style={styles.categoryName}>
            {selectedCategory.name}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.content}>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="cash-outline" style={styles.icon} />
            </View>
            <View>
              <Text style={styles.amount}>{amount < 0 ? '-' : ''} {Math.abs(amount).toLocaleString('vi-VN')} đ</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="clipboard-outline" style={styles.icon} />
            </View>
            <View>
              <Text style={styles.text}>Ghi chú</Text>
              <Text style={styles.subText}>{description}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" style={styles.icon} />
            </View>
            <View>
              <Text style={styles.text}>Ngày</Text>
              <Text style={styles.subText}>{date}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="alarm-outline" style={styles.icon} />
            </View>
            <View>
              <Text style={styles.text}>Nhắc nhở</Text>
              <Text style={styles.subText}>15 minutes before</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Nút sửa và xóa */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handleEditTransaction}>
          <Ionicons name="pencil" size={20} color="#A57EF4" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleDeleteTransaction}>
          <Ionicons name="trash-outline" size={20} color="#fc8181" />
        </TouchableOpacity>
      </View>

      {/* Modal để xác nhận xóa */}
      <CustomDeleteModal
        isVisible={isModalVisible}
        onConfirm={confirmDeleteTransaction}
        onCancel={cancelDeleteTransaction}
        message="Bạn có chắc chắn muốn xóa giao dịch này không?"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f3f5',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#ccc',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
    overflow: 'hidden',
    padding: 20,
    position: 'relative', 
  },
  imageCategory: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: '500',
    color: '#2d3748',
    flexShrink: 1,
  },
  amount: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fc8181',
  },
  iconContainer: {
    backgroundColor: '#F4E4FF', // Tím nhạt hơn cho nền
    padding: 10,
    borderRadius: 8,
    marginRight: 15,
  },
  icon: {
    color: '#A57EF4', // Màu tím đậm cho icon
    fontSize: 20,
  },
  buttonRow: {
    position: 'absolute',
    top: 10,
    right: 10, // Đặt ở góc trên phải của thẻ
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8, // Tăng vùng nhấn của icon
    backgroundColor: '#ffffff', // Màu nền của icon
    borderRadius: 50, // Bo tròn hoàn toàn
    marginLeft: 10, // Khoảng cách giữa nút sửa và nút xóa
    shadowColor: '#ccc', 
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 16,
    color: '#4a5568',
  },
  subText: {
    fontSize: 14,
    color: '#718096',
  },
  content: {
    marginRight: 50,
  },
});
