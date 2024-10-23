import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Image, Alert } from 'react-native';
import tw from 'twrnc';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addSavingGoal } from '../../services/SavingsGoalService/index';
import * as SecureStore from 'expo-secure-store';

export default function AddGoal() {
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

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

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const handleSaveGoal = async () => {
    const userId = await SecureStore.getItemAsync('userId');  // Lấy userId từ SecureStore

    const newGoal = {
      name: goalName,
      targetAmount: parseInt(goalAmount, 10),
      currentAmount: parseInt(savedAmount, 10),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      categoryId: selectedCategory,  // Sử dụng categoryId thay vì category
      userId: userId  // Thêm userId
    };

    try {
      const result = await addSavingGoal(newGoal);
      Alert.alert('Thành công', 'Mục tiêu tiết kiệm đã được lưu!', [{ text: 'OK' }]);
      
      setGoalName('');
      setGoalAmount('');
      setSavedAmount('');
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
          <Text style={tw`font-bold mb-1`}>Tên mục tiêu</Text>
          <TextInput
            placeholder="Tên mục tiêu"
            value={goalName}
            onChangeText={setGoalName}
            style={tw`border border-gray-300 p-3 rounded-lg mb-3`}
          />

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
              <Text style={tw`font-bold mb-1`}>Số tiền mục tiêu</Text>
              <TextInput
                placeholder="Số tiền mục tiêu"
                value={goalAmount}
                onChangeText={(text) => handleNumericInput(text, setGoalAmount)}
                keyboardType="numeric"
                style={tw`border border-gray-300 p-3 rounded-lg`}
              />
            </View>

            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={tw`font-bold mb-1`}>Số tiền tiết kiệm</Text>
              <TextInput
                placeholder="Số tiền tiết kiệm"
                value={savedAmount}
                onChangeText={(text) => handleNumericInput(text, setSavedAmount)}
                keyboardType="numeric"
                style={tw`border border-gray-300 p-3 rounded-lg`}
              />
            </View>
          </View>
        </View>

        <View style={tw`bg-white p-4 rounded-lg mb-4`}>
          <Text style={tw`font-bold text-lg mb-3`}>Danh mục</Text>
          <View style={tw`flex-row flex-wrap justify-between mb-5`}>
            {['66a4a378dca6b1337cf361cd', 'Uống', 'Mua sắm', 'Giáo dục', 'Di chuyển', 'Du lịch'].map((category, index) => (
              <TouchableOpacity
                key={index}
                style={tw`w-1/3 p-3 border border-gray-300 rounded-lg mb-3 items-center ${selectedCategory === category ? 'bg-gray-200' : ''}`}
                onPress={() => handleCategoryPress(category)}
              >
                <Image
                  source={require('../../assets/images/favicon.png')}
                  style={tw`w-8 h-8 mb-2`}
                />
                <Text>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSaveGoal}
          style={tw`bg-blue-500 p-4 rounded-lg items-center`}
        >
          <Text style={tw`text-white font-bold`}>Lưu mục tiêu</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
