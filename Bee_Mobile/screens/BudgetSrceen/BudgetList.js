import React, { useState, useEffect } from 'react';
import tw from 'twrnc';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, SafeAreaView, Image, StatusBar, ActivityIndicator, RefreshControl } from 'react-native'; // Thêm RefreshControl
import * as SecureStore from 'expo-secure-store';
import { fetchAllBudgets, deleteBudget } from '../../services/Budget';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function BudgetScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const [modalVisible, setModalVisible] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState(null);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);  // Trạng thái loading
    const [userId, setUserId] = useState(null);
    const [refreshing, setRefreshing] = useState(false); // Trạng thái khi kéo xuống

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

    useEffect(() => {
        if (!userId) return;

        const fetchBudgets = async () => {
            try {
                setLoading(true);
                const budgetData = await fetchAllBudgets(userId);
                setBudgets(budgetData);
            } catch (error) {
                console.error('Error loading budgets:', error);
                Alert.alert('Lỗi', 'Không thể tải danh sách ngân sách');
            } finally {
                setLoading(false);
            }
        };

        fetchBudgets();
    }, [userId]);

    useEffect(() => {
        if (route.params?.refresh) {
            setLoading(true);
            const fetchBudgets = async () => {
                try {
                    const budgetData = await fetchAllBudgets(userId);
                    setBudgets(budgetData);
                } catch (error) {
                    console.error('Error loading budgets:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchBudgets();
        }
    }, [route.params?.refresh]);

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

            setLoading(true);
            const budgetData = await fetchAllBudgets(userId);
            setBudgets(budgetData);
            setLoading(false);

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

    const handleUpdateBudget = async (updatedBudgetData) => {
        try {
            setLoading(true);
            const budgetData = await fetchAllBudgets(userId);
            setBudgets(budgetData);
            setLoading(false);

            Alert.alert('Cập nhật thành công', 'Ngân sách đã được cập nhật');
            navigation.navigate('BudgetList', { refresh: true });
        } catch (error) {
            console.error('Error updating budget:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật ngân sách');
        }
    };

    // Hàm khi kéo xuống để tải lại dữ liệu
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const budgetData = await fetchAllBudgets(userId);
            setBudgets(budgetData);
        } catch (error) {
            console.error('Error loading budgets:', error);
            Alert.alert('Lỗi', 'Không thể tải lại danh sách ngân sách');
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" color="#6200EE" />
            </View>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-100`}>
            <View style={{ height: StatusBar.currentHeight || 0, backgroundColor: 'white' }} />

            <View style={tw`bg-purple-600 py-3 px-4 flex-row items-center justify-between`}>
                <Text style={tw`text-white text-lg font-bold`}>Danh sách ngân sách</Text>
                <TouchableOpacity
                    style={tw`bg-white rounded-full p-2`}
                    onPress={() => navigation.navigate('BudgetAdd')}
                >
                    <Ionicons name="add" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={tw`flex-1 px-4`}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />  // Kéo xuống để tải lại dữ liệu
                }
            >
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
