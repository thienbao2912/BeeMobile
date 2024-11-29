import React, { useState, useEffect } from 'react';
import tw from 'twrnc';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, SafeAreaView, Image, StatusBar } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { fetchAllBudgets, deleteBudget } from '../../services/Budget'; // Import deleteBudget from service
import { useNavigation, useRoute } from '@react-navigation/native'; // Thêm useRoute để lấy tham số
import Ionicons from "react-native-vector-icons/Ionicons";

export default function BudgetScreen() {
    const navigation = useNavigation();
    const route = useRoute(); // Dùng để lấy các tham số truyền vào từ màn hình khác
    const [modalVisible, setModalVisible] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState(null);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    // Get userId from SecureStore
    useEffect(() => {
        const fetchUserIdFromStorage = async () => {
            try {
                const userId = await SecureStore.getItemAsync('userId');
                if (userId) {
                    setUserId(userId);
                }
            } catch (error) {
                console.error("Error loading user ID", error);
            }
        };

        fetchUserIdFromStorage();
    }, []);

    // Fetch budgets from the API when userId changes
    useEffect(() => {
        if (!userId) return; // Đảm bảo có userId

        const fetchBudgets = async () => {
            try {
                setLoading(true);  // Bắt đầu tải lại dữ liệu
                const budgetData = await fetchAllBudgets(userId);
                setBudgets(budgetData); // Assuming budgetData matches the expected structure
            } catch (error) {
                console.error('Error loading budgets:', error);
                Alert.alert('Lỗi', 'Không thể tải danh sách ngân sách');
            } finally {
                setLoading(false);
            }
        };

        fetchBudgets();
    }, [userId]);  // fetch lại khi userId thay đổi

    // Lắng nghe sự kiện khi quay lại màn hình danh sách từ màn hình cập nhật
    useEffect(() => {
        if (route.params?.refresh) { // Kiểm tra nếu có truyền refresh vào
            setLoading(true);
            const fetchBudgets = async () => {
                try {
                    const budgetData = await fetchAllBudgets(userId);
                    setBudgets(budgetData); // Cập nhật lại dữ liệu
                } catch (error) {
                    console.error('Error loading budgets:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchBudgets();
        }
    }, [route.params?.refresh]); // Lắng nghe sự thay đổi của refresh

    const openDeleteModal = (budget) => {
        if (budget) {
            setBudgetToDelete(budget);
            setModalVisible(true);
        }
    };

    const confirmDelete = async () => {
        if (!budgetToDelete || !budgetToDelete._id) return;

        try {
            await deleteBudget(budgetToDelete._id);
            setModalVisible(false);
            setBudgetToDelete(null);

            // Sau khi xóa, gọi lại API để tải lại danh sách ngân sách
            setLoading(true); // Đánh dấu quá trình tải lại
            const budgetData = await fetchAllBudgets(userId);
            setBudgets(budgetData); // Cập nhật lại dữ liệu
            setLoading(false); // Kết thúc quá trình tải lại

            Alert.alert('Thành công', 'Ngân sách đã được xóa');
        } catch (error) {
            console.error('Error deleting budget:', error);
            Alert.alert('Lỗi', 'Không thể xóa ngân sách');
        }
    };

    const cancelDelete = () => {
        setModalVisible(false);
        setBudgetToDelete(null);
    };

    // Function to handle update of budget
    const handleUpdateBudget = async (updatedBudgetData) => {
        try {
            // Giả sử có một phương thức updateBudget
            // await updateBudget(updatedBudgetData);

            // Sau khi cập nhật thành công, gọi lại API để tải lại danh sách
            setLoading(true);
            const budgetData = await fetchAllBudgets(userId);
            setBudgets(budgetData); // Cập nhật lại dữ liệu
            setLoading(false);

            Alert.alert('Cập nhật thành công', 'Ngân sách đã được cập nhật');
            // Chuyển hướng về màn hình danh sách và truyền refresh = true để tải lại dữ liệu
            navigation.navigate('BudgetList', { refresh: true });
        } catch (error) {
            console.error('Error updating budget:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật ngân sách');
        }
    };

    if (loading) {
        return <Text>Đang tải...</Text>;
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-100`}>
            {/* Thanh trạng thái với nền trắng */}
            <View style={{ height: StatusBar.currentHeight || 0, backgroundColor: 'white' }} />

            {/* Thanh hiển thị tên trang */}
            <View style={tw`bg-purple-600 py-3 px-4 flex-row items-center justify-between`}>
                <Text style={tw`text-white text-lg font-bold`}>Danh sách ngân sách</Text>
                {/* Nút thêm mới với icon dấu cộng */}
                <TouchableOpacity
                    style={tw`bg-white rounded-full p-2`} // Nền trắng và bo tròn
                    onPress={() => navigation.navigate('BudgetAdd')}
                >
                    <Ionicons name="add" size={24} color="black" /> {/* Dấu cộng màu đen */}
                </TouchableOpacity>
            </View>

            <ScrollView style={tw`flex-1 px-4`}>
                {budgets.map((budget, index) => {
                    const key = budget.id ? `budget-${budget.id}` : `budget-${index}`;
                    return (
                        <TouchableOpacity onPress={() => navigation.navigate('BudgetEdit', { budget })} key={key}>
                            <View style={tw`bg-white rounded-lg p-4 my-2 shadow-md`}>
                                <View style={tw`flex-row justify-between items-center`}>
                                    <Image
                                        source={{ uri: budget.categoryId?.image }}
                                        style={tw`w-12 h-12 rounded-full mb-2`}
                                    />
                                    <Text style={tw`text-lg font-bold flex-1 ml-3`}>{budget.categoryId?.name || 'Không có tên'}</Text>
                                    <TouchableOpacity onPress={() => openDeleteModal(budget)}>
                                        <Text style={tw`text-red-500 text-sm font-bold`}>Xóa</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={tw`text-sm mt-2`}>
                                    Ngân sách: {budget.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', '')} đ
                                </Text>

                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={cancelDelete}>
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                    <View style={tw`bg-white p-5 rounded-lg w-4/5`}>
                        <Text style={tw`text-xl font-bold mb-2`}>Xác nhận xóa ngân sách</Text>
                        <Text style={tw`text-lg mb-4`}>
                            Bạn có chắc chắn muốn xóa ngân sách "{budgetToDelete?.categoryId?.name}" không?
                        </Text>
                        <View style={tw`flex-row justify-between`}>
                            <TouchableOpacity style={tw`bg-purple-600 py-2 px-4 rounded`} onPress={cancelDelete}>
                                <Text style={tw`text-white text-lg font-bold`}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={tw`bg-red-500 py-2 px-4 rounded`} onPress={confirmDelete}>
                                <Text style={tw`text-white text-lg font-bold`}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
