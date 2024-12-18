import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/vi';
import { addSavingsFund, fetchAllCategories } from '../../services/SavingsFundService';
import * as SecureStore from 'expo-secure-store';
import tw from 'twrnc';
import { showMessage } from 'react-native-flash-message';

moment.locale('vi');

const SavingFundAdd = () => {
  const [targetAmount, setTargetAmount] = useState('');
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [startDate, setStartDate] = useState(moment().format('DD/MM/YYYY'));
  const [endDate, setEndDate] = useState(moment().format('DD/MM/YYYY'));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingCategories, setLoadingCategories] = useState(false);
  const [userId, setUserId] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const loadUserId = async () => {
      const id = await SecureStore.getItemAsync('userId');
      setUserId(id);
    };
    loadUserId();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetchAllCategories();
        if (Array.isArray(response.data)) {
          const expenseCategories = response.data.filter(
            (category) => category.type === 'expense'
          );
          setCategories(expenseCategories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddSavingFund = async () => {
    if (isLoading || !targetAmount || !name || !selectedCategory || !userId) {
      showMessage({
        message: "Vui lòng nhập đầy đủ các trường thông tin.",
        type: "warning",
        icon: "warning",
        floating: true,    
      });
      return;
    }

   const numericAmount = parseFloat(targetAmount.replace(/,/g, ''));
  
  if (isNaN(numericAmount)) {
    showMessage({
      message: "Số tiền không hợp lệ.",
      type: "warning",
      icon: "warning",
      floating: true,
    });
    return;
  }
   // Kiểm tra số tiền lớn hơn 10,000
   if (numericAmount < 10000) {
    showMessage({
      message: "Số tiền mục tiêu phải lớn hơn 10,000.",
      type: "warning",
      icon: "warning",
      floating: true,
    });
    return;
  }


    const newSavingFund = {
      userId,
      name,
      targetAmount: numericAmount,
      categoryId: selectedCategory,
      startDate: moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      endDate: moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    };

    try {
      setLoading(true);
      await addSavingsFund(newSavingFund);
      setTargetAmount('');
      setName('');
      setSelectedCategory(null);
      setStartDate(moment().format('DD/MM/YYYY'));
      setEndDate(moment().format('DD/MM/YYYY'));
navigation.navigate('SavingFundList', { refresh: true });
} catch (error) {
  let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!';
  if (error.message) {
    errorMessage = error.message;
  } else if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  }
  showMessage({
    message: errorMessage,
    type: "danger",
    icon: "danger",
    floating: true,
});


    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate, type) => {
    if (type === 'start') {
      setShowStartDatePicker(false);
      if (selectedDate) {
        setStartDate(moment(selectedDate).format('DD/MM/YYYY'));
      }
    } else {
      setShowEndDatePicker(false);
      if (selectedDate) {
        setEndDate(moment(selectedDate).format('DD/MM/YYYY'));
      }
    }
  };

  return (
    <ScrollView>
      <View style={tw`bg-white rounded-lg mt-2 mx-2 p-2`}>
        <View style={tw`flex-row items-center border-b border-indigo-200 p-2 mt-2 mb-4`}>
          <Ionicons name="people" size={24} color="#707070" />
          <TextInput
            placeholder="Tên quỹ"
            style={tw`flex-1 ml-2 text-base`}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={tw`flex-row items-center border-b border-indigo-100 p-2 mb-4`}>
        <Ionicons name="card-outline" size={27} color="#707070" />
          <TextInput
            placeholder="Số tiền mục tiêu"
            style={tw`flex-1 text-xl ml-2 text-indigo-600`}
            value={targetAmount}
            onChangeText={(input) => {
              const numericValue = input.replace(/\D/g, '');
              const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              setTargetAmount(formattedValue);
            }}
            keyboardType="numeric"
          />
        </View>
        <View style={tw`flex-row items-center h-10 mt-2 mb-2`}>
  <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={tw`flex-1 mr-2`}>
    <View style={tw`flex-row items-center border border-indigo-200 bg-indigo-50 rounded-lg px-2 h-10 mb-4`}>
      <Ionicons name="calendar" size={24} color="#707070" />
      <TextInput style={tw`flex-1 ml-2`} value={startDate} editable={false} />
    </View>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={tw`flex-1`}>
    <View style={tw`flex-row items-center border border-indigo-200 bg-indigo-50 rounded-lg px-2 h-10 mb-4`}>
      <Ionicons name="calendar" size={24} color="#707070" />
      <TextInput style={tw`flex-1 ml-2`} value={endDate} editable={false} />
    </View>
  </TouchableOpacity>
</View>


        {showStartDatePicker && (
          <DateTimePicker
            value={moment(startDate, 'DD/MM/YYYY').toDate()}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, 'start')}
          />
        )}
       
        {showEndDatePicker && (
          <DateTimePicker
            value={moment(endDate, 'DD/MM/YYYY').toDate()}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, 'end')}
          />
)}
          <View style={tw`flex-row items-center border-b border-indigo-200 p-2 mb-4`}>
        <Ionicons name="list" size={24} color="#707070" />
        <TouchableOpacity style={tw`flex-1 ml-2`} onPress={() => Alert.alert('Chọn danh mục')}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-lg`}>
              {selectedCategory ? categories.find(cat => cat._id === selectedCategory)?.name : 'Chọn danh mục'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`p-2 bg-indigo-600 rounded-full`}
          onPress={() => navigation.navigate('AddCategoryScreen')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
        {isLoadingCategories ? (
          <ActivityIndicator size="large" color="#5A5DD1" />
        ) : categories.length > 0 ? (
          <View style={tw`flex-row flex-wrap`}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category._id}
                style={[
                  tw`w-1/3 p-1 items-center bg-gray-40 rounded`,
                  selectedCategory === category._id
                    ? tw`border-2 bg-indigo-50 border-indigo-400`
                    : '',
                ]}
                onPress={() => setSelectedCategory(category._id)}
              >
                <Image
                  source={{ uri: category.image }}
                  style={tw`w-10 h-10 mb-2`}
                  resizeMode="contain"
                />
                <Text style={tw`text-center`}>
                  {category.name.length > 11
                    ? category.name.substring(0, 11) + '...'
                    : category.name}
                </Text>
                {selectedCategory === category._id && (
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
             <Text style={tw`text-center mb-2`}>Không tìm thấy danh mục nào.</Text>       
        )}   
        <TouchableOpacity
          style={[
            tw`p-3 rounded-lg mt-4`,
            isLoading ? tw`bg-indigo-200` : tw`bg-indigo-600`,
          ]}
          onPress={handleAddSavingFund}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={tw`text-white font-bold text-center`}>
              Thêm quỹ tiết kiệm
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SavingFundAdd;