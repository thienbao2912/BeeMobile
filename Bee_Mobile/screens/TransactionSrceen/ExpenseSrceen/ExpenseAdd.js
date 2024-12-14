import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from 'moment';
import 'moment/locale/vi';
import { fetchAllCategories, addTransaction } from '../../../services/Transaction';
import * as SecureStore from 'expo-secure-store';
import tw from 'twrnc';

moment.locale('vi');

const ExpenseAdd = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showExpenseList, setShowExpenseList] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('DD/MM/YYYY'));
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingCategories, setLoadingCategories] = useState(false);
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [isButtonDisabled, setButtonDisabled] = useState(false);

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
          const expenseCategories = response.data.filter(category => category.type === 'expense');
          setCategories(expenseCategories);
        } else {
          console.error("Categories không phải array:", response.data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Lỗi fetch categories:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddExpense = async () => {
    if (isButtonDisabled) return;
    const cleanedDescription = description.trim();
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    if (!cleanedDescription || !selectedCategory || isNaN(numericAmount) || !userId) {
      return;
    }
    const newExpense = {
      userId,
      type: 'expense',
      amount: numericAmount,
      description: cleanedDescription,
      categoryId: selectedCategory,
      date: moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    };
    try {
      setButtonDisabled(true);
      await addTransaction(newExpense);
      setAmount('');
      setDescription('');
      setSelectedCategory(null);
      setSelectedDate(moment().format('DD/MM/YYYY'));navigation.navigate('ExpenseList', { refresh: true });
    } catch (error) {
      console.error('Lỗi thêm chi tiêu:', error);
    } finally {
      setButtonDisabled(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || moment().toDate();
    setSelectedDate(moment(currentDate).format('DD/MM/YYYY'));
    setDatePickerVisible(false);
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView>
      <TouchableOpacity style={tw`self-end mb-4`} onPress={() => setShowExpenseList(!showExpenseList)}>
        <Ionicons name="ellipsis-horizontal" size={24} color="#5A5DD1" />
      </TouchableOpacity>
      {showExpenseList && (
        <TouchableOpacity onPress={() => navigation.navigate('ExpenseList')} style={tw`bg-indigo-600 rounded-lg p-2 self-end mb-2`}>
          <Text style={tw`text-white font-bold`}>Sổ giao dịch</Text>
        </TouchableOpacity>
      )}
  <View style={tw`flex-row items-center border-b border-indigo-100 p-3`}>
        <Image source={require("../../../assets/images/money-bags.png")} style={{ width: 27, height: 27 }} />
        <TextInput
          placeholder="Số tiền"
          style={tw`text-2xl ml-2 text-indigo-700`}
          value={amount}
          onChangeText={(input) => {
            const numericValue = input.replace(/\D/g, "");
            const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            setAmount(formattedValue);
          }}
          keyboardType="numeric"
          autoFocus
        />
      </View>

      {/* Chọn Ngày */}
      <TouchableOpacity onPress={showDatePicker} style={tw`bg-white border-b border-indigo-100 p-3`}>
        <View style={tw`flex-row items-center`}>
          <Ionicons name="calendar" size={24} color="#4B5563" />
          <Text style={tw`flex-1 ml-3 text-lg text-gray-700`}>
            {selectedDate || "Chọn ngày"}
          </Text>
        </View>
      </TouchableOpacity>
      {isDatePickerVisible && (
        <DateTimePicker
          value={moment(selectedDate, "DD/MM/YYYY").toDate()}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Input Ghi Chú */}
      <View style={tw`flex-row items-center bg-white border-b border-indigo-100 p-3`}>
        <Ionicons name="document-text" size={24} color="#4B5563" />
        <TextInput
          placeholder="Ghi chú"
          style={tw`flex-1 ml-3 text-lg text-gray-700`}
          value={description}
          onChangeText={(text) => setDescription(text.replace(/\n{2,}/g, "\n"))}
          multiline
        />
      </View>

      {/* Chọn Danh Mục */}
      <View style={tw`flex-row items-center bg-white border-b border-indigo-100 p-3 mb-4`}>
        <Ionicons name="list" size={24} color="#4B5563" />
        <TouchableOpacity style={tw`flex-1 ml-3`}>
          <Text style={tw`text-lg text-gray-700`}>
            {selectedCategory ? categories.find((cat) => cat._id === selectedCategory)?.name : "Chọn danh mục"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`p-2 bg-indigo-600 rounded-full shadow`}
          onPress={() => navigation.navigate("AddCategoryScreen")}
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
          selectedCategory === category._id ? tw`border-2 bg-indigo-50 border-indigo-400` : ''
        ]}
        onPress={() => setSelectedCategory(category._id)}
      >
        <Image
          source={{ uri: category.image }}
          style={tw`w-10 h-10 mb-2`}
          resizeMode="contain"
        />
        <Text style={tw`text-center`}>
          {category.name.length > 11 ? category.name.substring(0, 11) + '...' : category.name}
        </Text>
        {selectedCategory === category._id && (
          <Ionicons name="checkmark-circle" size={24} color="#8270DB" style={tw`absolute top-0 right-0`} />
        )}
      </TouchableOpacity>
    ))}
  </View>
) : (
  <Text>Không tìm thấy danh mục nào.</Text>
)}

      <TouchableOpacity
       style={[
        tw`p-3 rounded-lg mt-2`,
        isLoading ? tw`bg-indigo-200` : tw`bg-indigo-500` // Thay đổi màu khi đang xử lý
      ]}
        onPress={handleAddExpense}
        disabled={isButtonDisabled}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" /> // Hiển thị biểu tượng loading
        ) : (
          <Text style={tw`text-white font-bold text-center`}>
            {isButtonDisabled ? 'Đang thêm nha...' : 'Thêm chi tiêu'}
          </Text>
        )}
      </TouchableOpacity>
      
    </ScrollView>
    
  );
};

export default ExpenseAdd;