import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Animated,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LocaleConfig, Calendar } from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/vi';
import { fetchAllCategories, addTransaction } from '../../../services/Transaction';
import * as SecureStore from 'expo-secure-store';
import tw from 'twrnc';

LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ],
  dayNames: [
    'Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư',
    'Thứ năm', 'Thứ sáu', 'Thứ bảy',
  ],
  today: 'Hôm nay',
};

LocaleConfig.defaultLocale = 'vi';

const ExpenseAdd = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showExpenseList, setShowExpenseList] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('DD/MM/YYYY'));
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState(moment().format('YYYY-MM-DD'));
  const [isLoading, setLoading] = useState(false);
  const scaleValue = new Animated.Value(0);
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUserId = async () => {
      const id = await SecureStore.getItemAsync('userId');
      setUserId(id);
    };

    loadUserId();
  }, []);

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

  const handleDayPress = (day) => {
    setTempDate(day.dateString);
  };

  const handleOkPress = () => {
    setSelectedDate(moment(tempDate).format('DD/MM/YYYY'));
    setModalVisible(false);
  };

  const handleCancelPress = () => {
    setTempDate(moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD'));
    setModalVisible(false);
  };

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: isModalVisible ? 1 : 0,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isModalVisible]);

  const handleAmountChange = (input) => {
    const numericValue = input.replace(/\D/g, '');
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setAmount(formattedValue);
  };

  const formatDate = (dateString) => {
    return moment(dateString, 'DD/MM/YYYY').format('YYYY-MM-DD');
  };

  const handleAddExpense = async () => {
    const cleanedDescription = description.trim();
    const numericAmount = parseFloat(amount.replace(/,/g, ''));

    if (!cleanedDescription || !selectedCategory || isNaN(numericAmount) || !userId) {
      Alert.alert("Error", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const newExpense = {
      userId,
      type: 'expense',
      amount: numericAmount,
      description: cleanedDescription,
      categoryId: selectedCategory,
      date: formatDate(selectedDate),
    };

    try {
      setLoading(true);
      await addTransaction(newExpense);
      Alert.alert('Thêm chi tiêu thành công.');
      navigation.navigate('ExpenseList');
    } catch (error) {
      console.error('Lỗi thêm chi tiêu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-grow p-4 bg-white mx-2 rounded-lg`}>
      <TouchableOpacity style={tw`self-end mb-4`} onPress={() => setShowExpenseList(!showExpenseList)}>
        <Ionicons name="ellipsis-horizontal" size={24} color="#5A5DD1" />
      </TouchableOpacity>

      {showExpenseList && (
        <TouchableOpacity onPress={() => navigation.navigate('ExpenseList')} style={tw`bg-indigo-600 rounded-lg p-2 self-end mb-2`}>
          <Text style={tw`text-white font-bold`}>Sổ giao dịch</Text>
        </TouchableOpacity>
      )}

      <View style={tw`flex-row items-center border-b border-gray-300 mb-4 py-2`}>
        <Ionicons name="cash-outline" size={24} color="#D3D3D3" />
        <TextInput
          placeholder="Số tiền"
          style={tw`flex-1 text-2xl ml-2 text-indigo-600`}
          value={amount}
          onChangeText={handleAmountChange}
          keyboardType="numeric"
          autoFocus
        />
      </View>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={tw`flex-row items-center bg-indigo-50 rounded-lg px-4 h-10 mb-4`}>
          <Ionicons name="calendar" size={24} color="#D3D3D3" />
          <TextInput
            style={tw`flex-1 ml-2 `}
            value={selectedDate}
            placeholder="Chọn ngày"
            editable={false}
          />
        </View>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="none">
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <Animated.View style={[tw`bg-red-100 rounded-lg p-4 w-11/12`, { transform: [{ scale: scaleValue }] }]}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={{ [tempDate]: { selected: true, selectedColor: '#5A5DD1' } }}
              maxDate={moment().format('YYYY-MM-DD')}
              firstDay={1}
              theme={{
                backgroundColor: '#FFFfff',
                calendarBackground: '#FFF4F5',
                textSectionTitleColor: '#5A5DD1',
                selectedDayBackgroundColor: '#5A5DD1',
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: '#5A5DD1',
                dayTextColor: '#5A5DD1',
                arrowColor: '#5A5DD1',
                monthTextColor: '#5A5DD1',
              }}
            />
            <View style={tw`flex-row justify-between mt-2`}>
              <TouchableOpacity style={tw`bg-gray-300 p-2 rounded-lg flex-1 mr-2`} onPress={handleCancelPress}>
                <Text style={tw`text-center`}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tw`bg-indigo-600 p-2 rounded-lg flex-1 ml-2`} onPress={handleOkPress}>
                <Text style={tw`text-white text-center`}>Chọn</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <View style={tw`flex-row items-center border-2 border-blue-100 bg-white rounded-lg p-2 mb-4`}>
        <Ionicons name="document-text" size={24} color="#D3D3D3" />
        <TextInput
          placeholder="Ghi chú"
          style={tw`flex-1 ml-2`}
          value={description}
          onChangeText={(text) => setDescription(text.replace(/\n{2,}/g, '\n'))}
          multiline
        />
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#5A5DD1" />
      ) : categories.length > 0 ? (
        categories.reduce((rows, category, index) => {
          if (index % 2 === 0) {
            rows.push(
              <View key={index} style={tw`flex-row justify-between mb-2`}>
              <TouchableOpacity
                key={category._id}
                style={[
                  tw`flex-1 items-center p-2 bg-gray-50 rounded-lg mr-2`,
                  selectedCategory === category._id ? tw`border-2 bg-indigo-50 border-indigo-400` : ''
                ]}
                onPress={() => setSelectedCategory(category._id)}
              >
                <Image
                  source={{ uri: category.image }}
                  style={tw`w-10 h-10 mb-2`}
                  resizeMode="contain"
                />
                <Text style={tw`text-center`}>{category.name}</Text>
            
                {selectedCategory === category._id && (
                  <Ionicons name="checkmark-circle" size={24} color="#8270DB" style={tw`absolute top-0 right-0`} />
                )}
              </TouchableOpacity>
            
              {categories[index + 1] && (
                <TouchableOpacity
                  key={categories[index + 1]._id}
                  style={[
                    tw`flex-1 items-center p-2 bg-gray-50 rounded-lg`,
                    selectedCategory === categories[index + 1]._id ? tw`border-2 bg-indigo-50 border-indigo-400` : ''
                  ]}
                  onPress={() => setSelectedCategory(categories[index + 1]._id)}
                >
                  <Image
                    source={{ uri: categories[index + 1].image }}
                    style={tw`w-10 h-10 mb-2`}
                    resizeMode="contain"
                  />
                  <Text style={tw`text-center`}>{categories[index + 1].name}</Text>
            
                  {selectedCategory === categories[index + 1]._id && (
                    <Ionicons name="checkmark-circle" size={24} color="#8270DB" style={tw`absolute top-0 right-0`} />
                  )}
                </TouchableOpacity>
              )}
            </View>
            
            );
          }
          return rows;
        }, [])
      ) : (
        <Text style={tw`text-center text-gray-500`}>Không có danh mục nào.</Text>
      )}


      <TouchableOpacity onPress={handleAddExpense} style={tw`bg-indigo-600 p-4 rounded-lg mt-4`}>
        <Text style={tw`text-white text-center text-lg font-bold`}>Thêm chi tiêu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ExpenseAdd;
