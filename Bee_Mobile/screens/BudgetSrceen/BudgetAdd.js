import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert, Image } from 'react-native';
import tw from 'twrnc';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addBudget, getCategories } from '../../services/Budget';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function AddBudget({ }) {
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
                    onPress: () => navigation.navigate('BudgetList', { refresh: true }),
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
                {/* Input: Ngày bắt đầu và kết thúc */}
                <View style={tw`bg-white p-4 rounded-lg mb-4`}>
                    <View style={tw`flex-row justify-between mb-3`}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Text style={tw`font-bold mb-1`}>Ngày bắt đầu</Text>
                            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                                <View style={tw`flex-row items-center border border-gray-300 p-3 rounded-lg`}>
                                    <Ionicons name="calendar" size={20} color="gray" style={tw`mr-2`} />
                                    <Text style={tw`flex-1`}>{startDate.toLocaleDateString()}</Text>
                                </View>
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
                                <View style={tw`flex-row items-center border border-gray-300 p-3 rounded-lg`}>
                                    <Ionicons name="calendar-outline" size={20} color="gray" style={tw`mr-2`} />
                                    <Text style={tw`flex-1`}>{endDate.toLocaleDateString()}</Text>
                                </View>
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

                    {/* Input: Số tiền ngân sách */}
                    <View style={tw`mb-3`}>
                        <Text style={tw`font-bold mb-1`}>Số tiền ngân sách</Text>
                        <View style={tw`flex-row items-center border border-gray-300 p-3 rounded-lg`}>
                            <Ionicons name="cash-outline" size={20} color="gray" style={tw`mr-2`} />
                            <TextInput
                                placeholder="Số tiền ngân sách"
                                value={budgetAmount}
                                onChangeText={(text) => handleNumericInput(text, setBudgetAmount)}
                                keyboardType="numeric"
                                style={tw`flex-1`}
                            />
                        </View>
                    </View>
                </View>

                {/* Danh mục */}
                <View style={tw`bg-white p-4 rounded-lg mb-4`}>
                    <View style={tw`flex-row items-center justify-between mb-3 mr-1`}>
                        <Text style={tw`font-bold text-lg`}>Danh mục</Text>
                        <TouchableOpacity
                            style={tw`p-2 bg-indigo-600 rounded-full`}
                            onPress={() => navigation.navigate('AddCategoryScreen')}
                        >
                            <Ionicons name="add" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={tw`flex-row flex-wrap justify-between`}>
                        {categories.map((category, index) => (
                            <TouchableOpacity
                                key={category._id}
                                style={[
                                    tw`w-[30%] h-28 p-3 border rounded-lg mb-3 items-center justify-center relative`,
                                    selectedCategory === category._id
                                        ? tw`border-2 border-purple-600 bg-purple-50`
                                        : tw`border-gray-300`,
                                ]}
                                onPress={() => handleCategoryPress(category._id)}
                            >
                                {category.image && (
                                    <Image
                                        source={{ uri: category.image }}
                                        style={tw`w-12 h-12 rounded-full mb-2`}
                                    />
                                )}
                                <Text style={tw`text-center`} numberOfLines={1} ellipsizeMode="tail">
                                    {category.name}
                                </Text>
                                {selectedCategory === category._id && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={20}
                                        color="purple"
                                        style={tw`absolute top-1 right-1`} // Đặt dấu tích ở góc phải trên cùng
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                </View>

                {/* Button lưu */}
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
