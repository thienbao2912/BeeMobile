import React, { useEffect, useState, useRef } from "react";
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
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from 'moment';
import 'moment/locale/vi'; 
import { fetchTransactionById, editTransaction, fetchAllCategories } from "../../../services/Transaction"; 
import * as SecureStore from 'expo-secure-store';
import { showMessage } from 'react-native-flash-message';
import tw from "twrnc";


moment.locale('vi');

const CategorySelector = ({ categories, selectedCategory, onSelect }) => (
  <View>
  {categories.length > 0 ? (
  categories.reduce((rows, category, index) => {
    if (index % 3 === 0) { 
      rows.push(
        <View key={index} style={tw`flex-row justify-between mb-2`}>
          <CategoryButton 
            category={category} 
            isSelected={selectedCategory === category._id} 
            onSelect={onSelect} 
          />
          {categories[index + 1] && (
            <CategoryButton 
              category={categories[index + 1]} 
              isSelected={selectedCategory === categories[index + 1]._id} 
              onSelect={onSelect} 
            />
          )}
          {categories[index + 2] && (
            <CategoryButton 
              category={categories[index + 2]} 
              isSelected={selectedCategory === categories[index + 2]._id} 
              onSelect={onSelect} 
            />
          )}
        </View>
      );
    }
    return rows;
  }, [])
) : (
  <Text>Không tìm thấy danh mục nào.</Text>
)}

  </View>
);

const CategoryButton = ({ category, isSelected, onSelect }) => (
  <TouchableOpacity
    style={[tw`flex-1 items-center p-2 bg-gray-50 rounded-lg`, isSelected ? tw`border-2 bg-indigo-50 border-indigo-400` : '']}
    onPress={() => onSelect(category._id)}
  >
    <Image
      source={{ uri: category.image }}
      style={tw`w-10 h-10 mb-2`}
      resizeMode="contain"
    />
    <Text style={tw`text-center`}>{category.name}</Text>
    {isSelected && (
      <Ionicons name="checkmark-circle" size={24} color="#8270DB" style={tw`absolute top-0 right-0`} />
    )}
  </TouchableOpacity>
);

const ExpenseEdit = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { transactionId } = route.params; 
  const [transaction, setTransaction] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment().format('DD/MM/YYYY'));
   const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true); // New loading state for categories
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
      setIsLoadingCategories(true); 
      try {
        const response = await fetchAllCategories();
        if (Array.isArray(response.data)) {
          const expenseCategories = response.data.filter(category => category.type === 'expense');
          setCategories(expenseCategories);
        }
        else {
          console.error("Categories không phải array:", response.data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Lỗi fetch categories:", error);
      } finally {
        setIsLoadingCategories(false); 
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const loadTransaction = async () => {
      if (!userId) return; 
      try {
        const response = await fetchTransactionById(transactionId, userId);
        if (response && response.data) {
          setTransaction(response.data);
          setAmount(response.data.amount.toString());
          setDescription(response.data.description);
          setSelectedCategory(response.data.categoryId);
          setSelectedDate(moment(response.data.date).format('DD/MM/YYYY'));
        } else {
          Alert.alert("Không tìm thấy dữ liệu giao dịch.");
        }
      } catch (error) {
        console.error("Lỗi tải giao dịch", error);
        Alert.alert("Lỗi tải giao dịch");
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [transactionId, userId]);

  const handleEditExpense = async () => {
    const cleanedDescription = description.trim();
    const numericAmount = parseFloat(amount.replace(/,/g, ''));

    if (!cleanedDescription || !selectedCategory || isNaN(numericAmount) || !userId) {
      Alert.alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const updatedExpense = {
      userId,
      type: 'expense',
      amount: numericAmount,
      description: cleanedDescription,
      categoryId: selectedCategory,
      date: moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    };

    try {
      setLoading(true);
      await editTransaction(transactionId, updatedExpense);
      // Alert.alert("Cập nhật thành công");
      navigation.navigate('ExpenseList', { refresh: true});
      showMessage({
        message: "Cập nhật thành công!",
        type: "success",
    });
    } catch (error) {
      console.error("Lỗi chỉnh sửa chi tiêu:", error);
      showMessage({
        message: "Cập nhật thất bại!",
        type: "danger",
    });
    } finally {
      setLoading(false);
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


  if (loading || isLoadingCategories) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={tw`flex-grow p-4 bg-white mx-2 rounded-lg`}>
       <View style={tw`flex-row items-center border-b border-indigo-100 p-2 mb-4`}>
      <Image source={require('../../../assets/images/money-bags.png')} style={{ width: 27, height: 27 }} />  
      <TextInput
        placeholder="Số tiền"
        style={tw`flex-1 text-2xl ml-2 text-indigo-600`}  
        value={amount}
        onChangeText={(input) => {
          const numericValue = input.replace(/\D/g, '');
          const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          setAmount(formattedValue);
        }}
        keyboardType="numeric"
      />
      </View>
          
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
     <View style={tw`flex-row items-center bg-white border-b border-indigo-100 p-3`}>
      <Ionicons name="document-text" size={24} color="#4B5563" />
      <TextInput
      placeholder="Ghi chú"
        style={tw`flex-1 ml-2`}
        value={description}
        onChangeText={(text) => setDescription(text.replace(/\n{2,}/g, '\n'))}
          multiline
      />
  </View>


  <View style={tw`flex-row items-center bg-white border-b border-indigo-100 p-3 mb-4`}>
     <Ionicons name="list" size={24} color="#4B5563" />
  <TouchableOpacity style={tw`flex-1 ml-2`}>
    <View style={tw`flex-row items-center`}>
      <Text style={tw`text-lg`}>
        {selectedCategory ? categories.find(cat => cat._id === selectedCategory)?.name : 'Chọn danh mục'}
      </Text>
    </View>
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
                  tw`w-1/3 p-1 items-center`,
                  selectedCategory === category._id
                    ? tw`border-2 bg-indigo-50 border-indigo-400` // Highlight selected category
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
         style={tw`bg-indigo-600 p-4 rounded-lg`} 
         onPress={handleEditExpense}
         disabled={loading}
         >

        {loading ? (
          <ActivityIndicator size="small" color="#fff" /> 
        ) : (
          <Text style={tw`text-white font-bold text-center`}>
            {isButtonDisabled ? 'Đang cập nhật...' : 'Cập nhật'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ExpenseEdit;
