import React, { useState, useEffect } from 'react';
import tw from 'twrnc';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    FlatList,
    SafeAreaView,
    ScrollView,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import { Button, Card } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getCategories, updateBudget } from '../../services/Budget';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Utility function to format the number as currency
// Utility function to format the number as currency with 'đ' after the amount
const formatCurrency = (amount) => {
    if (amount) {
        const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount);
        return `${formattedAmount} ₫`;
    }
    return '0 ₫';
};

const BudgetEdit = ({ route }) => {
    const { budget } = route.params;
    const navigation = useNavigation();

    const [amount, setAmount] = useState(budget.amount.toString());
    const [categoryId, setCategoryId] = useState(budget.categoryId);
    const [startDate, setStartDate] = useState(new Date(budget.startDate));
    const [endDate, setEndDate] = useState(new Date(budget.endDate));
    const [remainingBudget, setRemainingBudget] = useState(budget.remainingBudget.toString());
    const [totalExpenses, setTotalExpenses] = useState(budget.totalExpenses.toString());
    const [categories, setCategories] = useState([]);
    const [statusBudget, setStatusBudget] = useState(budget.statusBudget);
    const [modalVisible, setModalVisible] = useState(false);
    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Trạng thái kiểm soát chế độ chỉnh sửa

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (response?.data && Array.isArray(response.data)) {
                    // Filter categories to only include those with type 'expenses'
                    const filteredCategories = response.data.filter((category) => category.type === 'expense');
                    setCategories(filteredCategories);
                } else {
                    setCategories([]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error.message);
                setCategories([]);
            }
        };

        fetchCategories();
    }, []);
    const handleSave = async () => {
        const userId = await SecureStore.getItemAsync('userId');
        try {
            const updateData = {
                amount: parseFloat(amount.replace(/[^\d.-]/g, '')),
                categoryId,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                userId: userId,
            };

            console.log("amount", updateData.amount); // Kiểm tra giá trị sau khi đã chuyển đổi

            await updateBudget(budget._id, updateData);
            navigation.navigate('BudgetList', { refresh: true });
            setIsEditing(false); // Đổi lại chế độ hiển thị sau khi lưu
        } catch (error) {
            console.error('Error saving budget:', error);
        }
    };

    const handleCancel = () => {
        setAmount(budget.amount.toString());
        setCategoryId(budget.categoryId);
        setStartDate(new Date(budget.startDate));
        setEndDate(new Date(budget.endDate));
        setRemainingBudget(budget.remainingBudget.toString());
        setTotalExpenses(budget.totalExpenses.toString());
        setStatusBudget(budget.statusBudget);
        setIsEditing(false); // Hủy bỏ chỉnh sửa
    };

    const calculateDays = (start, end) => {
        const timeDifference = end - start;
        return Math.ceil(timeDifference / (1000 * 3600 * 24)); // Chuyển đổi thành số ngày
    };

    const daysDifference = calculateDays(startDate, endDate);

    const handleConfirmStartDate = (date) => {
        setStartDate(date);
        setStartDatePickerVisible(false);
    };

    const handleConfirmEndDate = (date) => {
        setEndDate(date);
        setEndDatePickerVisible(false);
    };

    const getCategoryNameById = (categoryId) => {
        const category = categories.find((item) => item._id === categoryId);
        return category ? category.name : 'Chọn danh mục';
    };

    // Hàm để đóng modal khi nhấn vào phần ngoài modal
    const handleCloseModal = () => {
        setModalVisible(false);
    };

    // Xác định trạng thái thời gian
    const getTimeStatus = () => {
        const now = new Date();
        return now < endDate ? 0 : 1; // Nếu thời gian hiện tại < ngày kết thúc thì đang hoạt động
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white px-4`}>
            <ScrollView contentContainerStyle={tw`pt-4 pb-8`}>
                <View style={tw`mb-3 flex-row items-center justify-between flex-wrap`}>
                    <Text style={[tw`font-bold text-lg mb-2 text-purple-500`, { textShadowColor: '#', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 3 }]}>
                        Ngân sách: {categories.find((cat) => cat._id === categoryId)?.name || budget.categoryId?.name || 'Không có tên'}
                    </Text>
                    {/* Trạng thái thời gian, căn phải */}
                    <View style={tw`flex-row items-center ml-auto`}>
                        {getTimeStatus() === 0 && (
                            <View style={tw`w-2 h-2 bg-green-500 rounded-full mr-2`} />
                        )}
                        <Text style={tw`text-sm ${getTimeStatus() === 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {getTimeStatus() === 0 ? 'Đang hoạt động' : 'Đã hết hạn'}
                        </Text>
                    </View>
                </View>

                {/* Amount and Category */}
                <View style={tw`flex-row justify-between mb-4`}>
                    <Card style={tw`flex-1 rounded-lg shadow-md p-3 mr-2`}>
                        <Card.Content>
                            <Text style={tw`font-bold text-sm mb-2`}>Số tiền</Text>
                            {isEditing ? (
                                <TextInput
                                    style={tw`border-b-2 border-gray-300 p-2 text-sm`}
                                    value={amount}
                                    onChangeText={(input) => {
                                        const numericValue = input.replace(/\D/g, '');
                                        const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                        setAmount(formattedValue);
                                    }}
                                    placeholder="Nhập số tiền"
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text style={tw`text-sm`}>{formatCurrency(amount)}</Text>
                            )}
                        </Card.Content>
                    </Card>

                    <Card style={tw`flex-1 rounded-lg shadow-md p-3 ml-2`}>
                        <Card.Content>
                            <Text style={tw`font-bold text-sm mb-2`}>Danh mục</Text>
                            {isEditing ? (
                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <View style={tw`flex-row items-center`}>
                                        <Image
                                            source={{ uri: categories.find((cat) => cat._id === categoryId)?.image || budget.categoryId?.image }}
                                            style={tw`w-8 h-8 rounded-full mr-2`}
                                        />
                                        <Text style={tw`text-sm`}>
                                            {categories.find((cat) => cat._id === categoryId)?.name || budget.categoryId?.name || 'Không có tên'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <View style={tw`flex-row items-center`}>
                                    <Image
                                        source={{ uri: budget.categoryId?.image }}
                                        style={tw`w-8 h-8 rounded-full mr-2`}
                                    />
                                    <Text style={tw`text-sm`}>
                                        {budget.categoryId?.name || 'Không có tên'}
                                    </Text>
                                </View>
                            )}
                        </Card.Content>
                    </Card>

                </View>
                <Card style={tw`mb-4 rounded-lg shadow-md p-1`}>
                    <Card.Content>
                        <Text style={tw`font-bold text-sm mb-2`}>Thời gian: {daysDifference} ngày</Text>
                        <View style={tw`flex-row justify-between`}>
                            <TouchableOpacity
                                onPress={() => setStartDatePickerVisible(true)}
                                style={tw`flex-1 border p-2 rounded-md bg-gray-100 mr-4`} // Thêm marginRight
                            >
                                <Text style={tw`text-sm`}>Ngày bắt đầu</Text>
                                <Text style={tw`text-xs`}>{startDate.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isStartDatePickerVisible}
                                mode="date"
                                date={startDate}
                                onConfirm={handleConfirmStartDate}
                                onCancel={() => setStartDatePickerVisible(false)}
                            />
                            <TouchableOpacity
                                onPress={() => setEndDatePickerVisible(true)}
                                style={tw`flex-1 border p-2 rounded-md bg-gray-100`}
                            >
                                <Text style={tw`text-sm`}>Ngày kết thúc</Text>
                                <Text style={tw`text-xs`}>{endDate.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isEndDatePickerVisible}
                                mode="date"
                                date={endDate}
                                onConfirm={handleConfirmEndDate}
                                onCancel={() => setEndDatePickerVisible(false)}
                            />
                        </View>
                    </Card.Content>
                </Card>

                {/* Remaining Budget and Total Expenses */}
                <View style={tw`flex-row justify-between mb-4`}>
                    <Card style={tw`flex-1 rounded-lg shadow-md p-3 mr-2`}>
                        <Card.Content>
                            <Text style={tw`font-bold text-sm mb-2`}>Số dư còn lại</Text>
                            <Text style={tw`text-sm`}>{formatCurrency(remainingBudget)}</Text>
                        </Card.Content>
                    </Card>

                    <Card style={tw`flex-1 rounded-lg shadow-md p-3 ml-2`}>
                        <Card.Content>
                            <Text style={tw`font-bold text-sm mb-2`}>Tổng chi tiêu</Text>
                            <Text style={tw`text-sm`}>{formatCurrency(totalExpenses)}</Text>
                        </Card.Content>
                    </Card>
                </View>

                <View style={tw`mb-4`}>
                    {statusBudget === 0 ? null : (
                        <View style={tw`flex-row items-center mt-2`}>
                            {statusBudget === 1 && (
                                <Icon name="times-circle" size={20} color="red" style={tw`mr-2`} />
                            )}
                            {statusBudget === 2 && (
                                <Icon name="exclamation-triangle" size={20} color="red" style={tw`mr-2`} />
                            )}

                            <Text style={tw`text-sm ${statusBudget === 1 || statusBudget === 2 ? 'text-red-500' : ''}`}>
                                {statusBudget === 1 ? 'Ngân sách đã hết' : 'Chi tiêu vượt ngân sách'}
                            </Text>
                        </View>
                    )}
                </View>


                {/* Action buttons */}
                {isEditing ? (
                    <View style={tw`w-full flex-row justify-between`}>
                        <TouchableOpacity onPress={handleCancel} style={tw`bg-red-400 p-3 rounded-lg w-[48%]`}>
                            <Text style={tw`text-white text-center`}>Hủy bỏ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave} style={tw`bg-blue-500 p-3 rounded-lg w-[48%]`}>
                            <Text style={tw`text-white text-center`}>Lưu</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={() => setIsEditing(true)} style={tw`bg-green-500 p-3 rounded-lg`}>
                        <Text style={tw`text-white text-center`}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <Modal visible={modalVisible} transparent onRequestClose={handleCloseModal}>
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                        <View style={tw`w-11/12 max-h-3/4 bg-white rounded-xl p-4`}>
                            <Text style={tw`text-lg font-bold mb-4`}>Chọn danh mục</Text>
                            <FlatList
                                data={categories}
                                keyExtractor={(item) => item._id}
                                numColumns={3}  // Hiển thị 3 cột
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={tw`w-1/3 p-2`}  // Mỗi phần tử chiếm 1/3 chiều rộng
                                        onPress={() => {
                                            setCategoryId(item._id);
                                            setModalVisible(false);
                                        }}
                                    >
                                        <View style={tw`flex-1 bg-white rounded-lg shadow p-3 justify-center items-center`}>
                                            {/* Hình ảnh của danh mục */}
                                            <Image
                                                source={{ uri: item.image }}
                                                style={tw`w-16 h-16 rounded-full mb-2 mx-auto`}  // Thay đổi kích thước hình ảnh
                                            />
                                            {/* Tên danh mục */}
                                            <Text style={tw`text-center text-sm flex-wrap`}>{item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </SafeAreaView>
    );
};

export default BudgetEdit;
