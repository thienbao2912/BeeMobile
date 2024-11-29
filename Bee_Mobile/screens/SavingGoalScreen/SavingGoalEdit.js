import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Image, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ProgressBar } from 'react-native-paper';
import { fetchSavingGoalById, updateSavingGoal, fetchAllCategories } from '../../services/SavingsGoalService';
import { showMessage } from 'react-native-flash-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

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
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetchAllCategories();
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error("Categories không phải array:", response.data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Lỗi fetch categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
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
      showMessage({
        message: "Cập nhật thành công!",
        type: "success",
    });
    } catch (error) {
      console.error('Error updating saving goal:', error);
      showMessage({
        message: "Cập nhật thất bại!",
        type: "danger",
    });
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
  <Text style={tw`font-bold text-lg mb-3`}>Danh mục</Text>
  <View style={tw`flex-wrap flex-row justify-between mb-5`}>
    {isLoading ? (
      <ActivityIndicator size="large" color="#5A5DD1" />
    ) : categories.length > 0 ? (
      <View style={tw`flex-row flex-wrap`}>
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={cat._id}
            style={[
              tw`w-1/3 items-center p-2 bg-gray-50 rounded-lg mb-2`,
              selectedCategory === cat._id ? tw`border-2 bg-indigo-50 border-indigo-400` : null,
            ]}
            onPress={() => setSelectedCategory(cat._id)}
          >
            <Image
              source={{ uri: cat.image }}
              style={tw`w-10 h-10 mb-2`}
              resizeMode="contain"
            />
            <Text style={tw`text-center`}>{cat.name}</Text>
            {selectedCategory === cat._id && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#8270DB"
                style={tw`absolute top-0 right-0`}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    ) : (
      <Text style={tw`text-center text-gray-500`}>
        Không có danh mục nào.
      </Text>
    )}
  </View>
  {errors.category && (
    <Text style={tw`text-red-500`}>{errors.category}</Text>
  )}
</View>
      <TouchableOpacity style={tw`bg-purple-600 py-4 rounded-lg items-center`} onPress={handleSave}>
        <Text style={tw`text-white font-bold`}>Lưu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
