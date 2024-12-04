import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomDeleteModal from '../../../components/Popup';
import { showMessage } from 'react-native-flash-message';

export default function IncomeDetail({ route, navigation }) {
  const { income } = route.params; 
  const [amount, setAmount] = useState(income.amount || 0); 
  const [description, setDescription] = useState(income.description || "Không có mô tả");
  const [date, setDate] = useState(income.date || "Không có ngày")
  const [selectedCategory, setSelectedCategory] = useState(income.category || { name: "Chưa xác định" });
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    console.log('Income Detail:', income);
  }, [income]);

  const handleEditIncome = () => {
    navigation.navigate('IncomeEdit', { income });
  };

  const handleDeleteIncome = () => {
    setIsModalVisible(true);
    showMessage({
      message: "Xóa thành công!",
      type: "success",
  });
  };

  const confirmDeleteIncome = () => {
    console.log('Delete Income'); 
    setIsModalVisible(false);
    // Bạn có thể gọi hàm xóa chi tiêu ở đây
  };

  const cancelDeleteIncome = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleEditIncome}>
            <Ionicons name="pencil" size={24} color="#5A5DD1" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Image
                source={require('../../../assets/images/hard-work.png')} 
                style={styles.imageCategory}
              />
              <Text style={styles.categoryName}>
                {selectedCategory.name} 
              </Text>
            </View>

            {/* Amount */}
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={20} color="#34495e" style={styles.icon} />
              <Text style={styles.amount}>
               + {amount.toLocaleString('vi-VN')} đ
              </Text>
            </View>

            {/* Description */}
            <View style={styles.detailRow}>
              <Ionicons name="clipboard-outline" size={20} color="#34495e" style={styles.icon} />
              <Text style={styles.description}>
                {description}
              </Text>
            </View>

            {/* Date */}
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color="#34495e" style={styles.icon} />
              <Text style={styles.date}>
             {date}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteIncome}>
        <Text style={styles.deleteButtonText}>Xóa thu nhập</Text>
      </TouchableOpacity>

      {/* Modal để xác nhận xóa */}
      <CustomDeleteModal
        isVisible={isModalVisible}
        onConfirm={confirmDeleteIncome} 
        onCancel={cancelDeleteIncome}
        message="Bạn có chắc chắn muốn xóa thu nhập này không?" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa', 
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
    overflow: 'hidden',
    padding: 20,
  },
  header: {
    alignItems: 'flex-end',
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
  icon: {
    marginRight: 15,
    color: '#7f8c8d',
    fontSize: 24, 
  },
  categoryName: {
    fontSize: 24, 
    fontWeight: '500',
    flexShrink: 1,
  },
  description: {
    fontSize: 18, 
    color: '#495057',
    flexShrink: 1,
  },
  amount: {
    fontSize: 26, 
    fontWeight: 'bold',
    color: '#4CBB17',
  },
  date: {
    fontSize: 16,
    color: '#7f8c8d', 
  },
  deleteButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#e74c3c', 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#e74c3c',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
