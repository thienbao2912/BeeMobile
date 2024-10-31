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
  Animated, 
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import 'moment/locale/vi'; 
import { fetchTransactionById, editTransaction, fetchAllCategories } from "../../../services/Transaction"; 
import * as SecureStore from 'expo-secure-store';
import tw from "twrnc";

moment.locale('vi');

const CategorySelector = ({ categories, selectedCategory, onSelect }) => (
  <View>
   {categories.length > 0 ? (
  categories.reduce((rows, category, index) => {
    if (index % 3 === 0) { // Cứ mỗi 3 mục thì tạo một hàng mới
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

const IncomeEdit = () => {
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
  const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate); 
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true); // New loading state for categories

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
          const incomeCategories = response.data.filter(category => category.type === 'income');
          setCategories(incomeCategories);
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

  const handleEditIncome = async () => {
    const cleanedDescription = description.trim();
    const numericAmount = parseFloat(amount.replace(/,/g, ''));

    if (!cleanedDescription || !selectedCategory || isNaN(numericAmount) || !userId) {
      Alert.alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const updatedIncome = {
      userId,
      type: 'income',
      amount: numericAmount,
      description: cleanedDescription,
      categoryId: selectedCategory,
      date: moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    };

    try {
      setLoading(true);
      await editTransaction(transactionId, updatedIncome);
      // Alert.alert("Cập nhật thành công");
      navigation.navigate('ExpenseList', { refresh: true});
    } catch (error) {
      console.error("Lỗi chỉnh sửa chi tiêu:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDatePicker = () => setModalVisible(true);

  const confirmDateSelection = (date) => {
    setSelectedDate(moment(date).format('DD/MM/YYYY'));
    setModalVisible(false);
  };

  const cancelDateSelection = () => {
    setTempSelectedDate(selectedDate);
    setModalVisible(false);
  };
  if (loading || isLoadingCategories) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={tw`flex-grow p-4 bg-white mx-2 rounded-lg`}>
       <View style={tw`flex-row items-center border-b border-violet-100 p-2 mb-4`}>
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
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={tw`flex-row items-center bg-indigo-50 rounded-lg px-2 h-10 mb-4`}>
          <Ionicons name="calendar" size={24} color="#D3D3D3" />
          <TextInput
            style={tw`flex-1 ml-2`}
            value={selectedDate}
            placeholder="Chọn ngày"
            editable={false}
          />
        </View>
      </TouchableOpacity>

      <View style={tw`flex-row items-center border-2 border-blue-100 bg-white rounded-lg p-2 mb-4`}>
      <TextInput
      placeholder="Ghi chú"
        style={tw`flex-1 ml-2`}
        value={description}
        onChangeText={(text) => setDescription(text.replace(/\n{2,}/g, '\n'))}
          multiline
      />
  </View>


  <View style={tw`flex-row items-center border-b border-violet-100 p-2 mb-4`}>
      <Ionicons name="list" size={24} color="#D3D3D3" />
  <TouchableOpacity style={tw`flex-1 ml-2`} onPress={() => Alert.alert('Chọn danh mục')}>
    <View style={tw`flex-row items-center`}>
      <Text style={tw`text-lg`}>
        {selectedCategory ? categories.find(cat => cat._id === selectedCategory)?.name : 'Chọn danh mục'}
      </Text>
    </View>
  </TouchableOpacity>
</View>
     
      <Modal visible={isModalVisible} transparent={true} animationType="none">
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-violet-100 rounded-lg p-4 w-11/12`}>
            <CalendarPicker
              onDateChange={confirmDateSelection}
              selectedDate={moment(selectedDate, 'DD/MM/YYYY')}
              maxDate={moment().toDate()}
              previousTitle={<Text style={{ color: '#5A5DD1', fontSize: 20 }}>◀</Text>}
              nextTitle={<Text style={{ color: '#5A5DD1', fontSize: 20 }}>▶</Text>}
            />
            <View style={tw`flex-row justify-between mt-4`}>
        <TouchableOpacity
          style={tw`bg-gray-300 p-2 rounded-lg flex-1 mr-2`}
          onPress={cancelDateSelection}
        >
          <Text style={tw`text-center`}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-indigo-800 p-2 rounded-lg flex-1`}
          onPress={confirmDateSelection}
        >
          <Text style={tw`text-white text-center`}>Chọn</Text>
        </TouchableOpacity>
      </View>
          </View>
        </View>
      </Modal>

      <CategorySelector 
        categories={categories} 
        selectedCategory={selectedCategory} 
        onSelect={setSelectedCategory} 
      />
         <TouchableOpacity style={tw`bg-indigo-600 p-4 rounded-lg`} onPress={handleEditIncome}>
        <Text style={tw`text-white text-center font-bold`}>Cập nhật chi tiêu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default IncomeEdit;
