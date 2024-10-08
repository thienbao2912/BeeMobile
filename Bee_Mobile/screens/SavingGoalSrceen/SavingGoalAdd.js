import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import tw from 'twrnc';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ProgressBar } from "react-native-paper";

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

        <View style={tw`bg-white p-4 rounded-lg mb-4`}>
          {[{ title: "Mua giường thú cưng", saved: 200000, target: 200000 }].map((goal, index) => {
            const progress = goal.saved / goal.target;
            const progressPercentage = Math.floor(progress * 100);

            let progressBarColor = "red";
            if (progress >= 0.8) {
              progressBarColor = "green";
            } else if (progress >= 0.5) {
              progressBarColor = "#FFF9C4";
            }

            let statusText = "";
            let statusColor = "";

            if (progress === 1) {
              statusText = "Hoàn thành";
              statusColor = "green";
            } else if (progress === 0) {
              statusText = "Chưa tiết kiệm";
              statusColor = "red";
            } else {
              statusText = `Còn lại ${100 - progressPercentage}%`;
              statusColor = progress >= 0.5 ? "green" : "red";
            }

            return (
              <View key={index} style={tw`border rounded-lg p-4 mb-4 bg-white`}>
                <View style={tw`flex-row items-center`}>
                  <Image
                    source={require("../../assets/images/favicon.png")}
                    style={tw`w-12 h-12 rounded-full mr-4`}
                  />
                  <View style={tw`flex-1`}>
                    <Text style={tw`font-bold text-lg`}>{goal.title}</Text>
                    <Text style={tw`text-gray-500`}>
                      {goal.saved.toLocaleString()}đ - {goal.target.toLocaleString()}đ
                    </Text>
                  </View>
                </View>

                <ProgressBar
                  progress={progress}
                  color={progressBarColor}
                  style={tw`h-2 rounded-full mt-2`}
                />

                <View style={tw`flex-row justify-between mt-1`}>
                  <Text style={[tw`text-xs text-gray-600`, { color: statusColor }]}>
                    {progressPercentage}%
                  </Text>
                  <Text style={[tw`text-xs font-semibold`, { color: statusColor }]}>
                    {statusText}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={tw`bg-purple-600 py-4 rounded-lg items-center`}>
          <Text style={tw`text-white font-bold`}>Lưu</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
