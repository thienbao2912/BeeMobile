import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import tw from 'twrnc';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ProgressBar } from 'react-native-paper';
import { fetchSavingGoalById, updateSavingGoal } from '../../services/SavingsGoalService';

export default function EditGoal({ route, navigation }) {
  const { goalId } = route.params;
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const loadSavingGoal = async () => {
      try {
        const goal = await fetchSavingGoalById(goalId);
        setGoalName(goal.name);
        setGoalAmount(goal.targetAmount.toString());
        setSavedAmount(goal.currentAmount.toString());
        setStartDate(new Date(goal.startDate));
        setEndDate(new Date(goal.endDate));
        setSelectedCategory(goal.categoryId);
      } catch (error) {
        console.error('Error loading saving goal:', error);
      }
    };

    loadSavingGoal();
  }, [goalId]);

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

  const handleSave = async () => {
    const goalData = {
      name: goalName,
      targetAmount: parseFloat(goalAmount),
      currentAmount: parseFloat(savedAmount),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      categoryId: selectedCategory,
    };

    try {
      await updateSavingGoal(goalId, goalData);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating saving goal:', error);
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  return (
    <ScrollView style={tw`p-5`}>
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
        <Text style={tw`font-bold mb-3`}>Danh mục</Text>
        <View style={tw`flex-row flex-wrap justify-between mb-5`}>
          {['Ăn', 'Uống', 'Mua sắm', 'Giáo dục', 'Di chuyển', 'Du lịch'].map((category, index) => (
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
      <TouchableOpacity style={tw`bg-purple-600 py-4 rounded-lg items-center`} onPress={handleSave}>
        <Text style={tw`text-white font-bold`}>Lưu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
