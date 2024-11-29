import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert, Image } from 'react-native';
import tw from 'twrnc';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addBudget, getCategories } from '../../services/Budget';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native'; // Thêm useNavigation
export default function AddBudget({}) {
    const navigation = useNavigation();
    const [budgetAmount, setBudgetAmount] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                if (Array.isArray(data.data)) {
                    // Filter categories with type 'expense'
                    const expenseCategories = data.data.filter(category => category.type === 'expense');
                    setCategories(expenseCategories);
                } else {
                    console.error('Dữ liệu danh mục không phải là mảng:', data);
                    Alert.alert('Lỗi', 'Dữ liệu danh mục không hợp lệ.');
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh mục:', error);
                Alert.alert('Lỗi', 'Không thể lấy danh mục, vui lòng thử lại sau.');
            }
        };
        fetchCategories();
    }, []);

    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(Platform.OS === 'ios');
        setStartDate(currentDate);
    };

    const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(Platform.OS === 'ios');
        setEndDate(currentDate);
    };

    const handleNumericInput = (text, setState) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setState(numericValue);
    };

    const handleCategoryPress = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const handleSaveBudget = async () => {
        if (!budgetAmount || !selectedCategory) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
            return;
        }

        const userId = await SecureStore.getItemAsync('userId');

        const newBudget = {
            amount: parseInt(budgetAmount, 10),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            categoryId: selectedCategory,
            userId: userId,
        };

        try {
            await addBudget(newBudget);
            Alert.alert('Thành công', 'Ngân sách đã được lưu!', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Sau khi lưu thành công, điều hướng về màn hình danh sách ngân sách
                        navigation.navigate('BudgetList', { refresh: true });
                    }
                }
            ]);
            setBudgetAmount('');
            setStartDate(new Date());
            setEndDate(new Date());
            setSelectedCategory('');
        } catch (error) {
            Alert.alert('Lỗi', error.message, [{ text: 'OK' }]);
        }
    };

    return (
        <View style={tw`flex-1`}>
            <ScrollView style={tw`p-5 flex-1`}>
                <View style={tw`bg-white p-4 rounded-lg mb-4`}>
                    <View style={tw`flex-row justify-between mb-3`}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Text style={tw`font-bold mb-1`}>Ngày bắt đầu</Text>
                            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                                <TextInput
                                    placeholder="Ngày bắt đầu"
                                    value={startDate.toLocaleDateString()}
                                    editable={false}
                                    style={tw`border border-gray-300 p-3 rounded-lg`}
                                />
                            </TouchableOpacity>
                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={startDate}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeStartDate}
                                />
                            )}
                        </View>

                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <Text style={tw`font-bold mb-1`}>Ngày kết thúc</Text>
                            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                                <TextInput
                                    placeholder="Ngày kết thúc"
                                    value={endDate.toLocaleDateString()}
                                    editable={false}
                                    style={tw`border border-gray-300 p-3 rounded-lg`}
                                />
                            </TouchableOpacity>
                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={endDate}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeEndDate}
                                />
                            )}
                        </View>
                    </View>

                    <View style={tw`flex-row justify-between mb-3`}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Text style={tw`font-bold mb-1`}>Số tiền ngân sách</Text>
                            <TextInput
                                placeholder="Số tiền ngân sách"
                                value={budgetAmount}
                                onChangeText={(text) => handleNumericInput(text, setBudgetAmount)}
                                keyboardType="numeric"
                                style={tw`border border-gray-300 p-3 rounded-lg`}
                            />
                        </View>
                    </View>
                </View>

                <View style={tw`bg-white p-4 rounded-lg mb-4`}>
                    <Text style={tw`font-bold text-lg mb-3`}>Danh mục</Text>
                    <View style={tw`flex-row flex-wrap justify-between`}>
                        {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((category) => (
                                <TouchableOpacity
                                    key={category._id}
                                    style={tw`w-1/3 p-3 border border-gray-300 rounded-lg mb-3 items-center ${selectedCategory === category._id ? 'bg-gray-200' : ''}`}
                                    onPress={() => handleCategoryPress(category._id)}
                                >
                                    {category.image && (
                                        <Image
                                            source={{ uri: category.image }}
                                            style={tw`w-10 h-10 rounded-full mb-2`}
                                        />
                                    )}
                                    <Text>{category.name}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text>Không có danh mục nào để hiển thị</Text>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSaveBudget}
                    style={tw`bg-blue-500 p-4 rounded-lg items-center mb-8`}
                >
                    <Text style={tw`text-white font-bold`}>Lưu ngân sách</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}