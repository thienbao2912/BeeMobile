import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import tw from "twrnc";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  addSavingGoal,
  fetchAllCategories,
} from "../../services/SavingsGoalService";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

export default function AddGoal({ navigation }) {
  const [goalName, setGoalName] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");
    setEndDate(currentDate);
  };

  const handleNumericInput = (text, setState) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setState(numericValue);
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const validateFields = () => {
    let tempErrors = {};
    if (!goalName) {
      tempErrors.goalName = "Tên mục tiêu không được để trống.";
    } else if (goalName.length < 3) {
      tempErrors.goalName = "Tên mục tiêu phải có ít nhất 3 ký tự.";
    } else if (!/[a-zA-Z]/.test(goalName)) {
      tempErrors.goalName = "Tên mục tiêu phải chứa ít nhất một chữ cái.";
    }
    if (!goalAmount) tempErrors.goalAmount = "Số tiền mục tiêu không được để trống.";
    if (!savedAmount) tempErrors.savedAmount = "Số tiền tiết kiệm không được để trống.";
    if (!selectedCategory) tempErrors.category = "Bạn phải chọn một danh mục.";
    if (new Date(endDate) <= new Date(startDate))
      tempErrors.date = "Ngày kết thúc phải sau ngày bắt đầu.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSaveGoal = async () => {
    if (!validateFields()) return;

    const userId = await SecureStore.getItemAsync("userId");
    const newGoal = {
      name: goalName,
      targetAmount: parseInt(goalAmount, 10),
      currentAmount: parseInt(savedAmount, 10),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      categoryId: selectedCategory,
      userId: userId,
    };

    try {
      await addSavingGoal(newGoal);
      navigation.navigate("SavingGoalList");

      // Reset form
      setGoalName("");
      setGoalAmount("");
      setSavedAmount("");
      setStartDate(new Date());
      setEndDate(new Date());
      setSelectedCategory("");
      setErrors({});
    } catch (error) {
      console.error("Error saving goal: ", error.message);
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
            style={tw`border border-gray-300 p-3 rounded-lg mb-1`}
          />
          {errors.goalName && <Text style={tw`text-red-500`}>{errors.goalName}</Text>}

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
          {errors.date && <Text style={tw`text-red-500`}>{errors.date}</Text>}

          <View style={tw`flex-row justify-between mb-3`}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <Text style={tw`font-bold mb-1`}>Số tiền mục tiêu</Text>
              <TextInput
                placeholder="Số tiền mục tiêu"
                value={goalAmount}
                onChangeText={(text) => handleNumericInput(text, setGoalAmount)}
                keyboardType="numeric"
                style={tw`border border-gray-300 p-3 rounded-lg mb-1`}
              />
              {errors.goalAmount && <Text style={tw`text-red-500`}>{errors.goalAmount}</Text>}
            </View>

            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={tw`font-bold mb-1`}>Số tiền tiết kiệm</Text>
              <TextInput
                placeholder="Số tiền tiết kiệm"
                value={savedAmount}
                onChangeText={(text) => handleNumericInput(text, setSavedAmount)}
                keyboardType="numeric"
                style={tw`border border-gray-300 p-3 rounded-lg mb-1`}
              />
              {errors.savedAmount && <Text style={tw`text-red-500`}>{errors.savedAmount}</Text>}
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


        <TouchableOpacity
          style={tw`bg-indigo-500 p-4 rounded-lg`}
          onPress={handleSaveGoal}
        >
          <Text style={tw`text-white text-center font-bold`}>Lưu Mục Tiêu</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
