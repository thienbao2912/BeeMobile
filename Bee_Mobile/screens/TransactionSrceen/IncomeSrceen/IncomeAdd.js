import React, { useState, useEffect, useRef } from 'react';
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
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import 'moment/locale/vi';
import { fetchAllCategories, addTransaction } from '../../../services/Transaction';
import * as SecureStore from 'expo-secure-store';
import tw from 'twrnc';
moment.locale('vi');
const IncomeAdd = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showIncomeList, setShowIncomeList] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('DD/MM/YYYY'));
  const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate);
  const [isModalVisible, setModalVisible] = useState(false);
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
          const incomeCategories = response.data.filter(category => category.type === 'income');
          setCategories(incomeCategories);
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

  const handleAddIncome = async () => {
    if (isButtonDisabled) return;
    const cleanedDescription = description.trim();
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    if (!cleanedDescription || !selectedCategory || isNaN(numericAmount) || !userId) {
      Alert.alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    const newIncome = {
      userId,
      type: 'income',
      amount: numericAmount,
      description: cleanedDescription,
      categoryId: selectedCategory,
      date: moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    };
    try {
      // setLoading(true);
      setButtonDisabled(true);
      await addTransaction(newIncome);
      setAmount('');
      setDescription('');
      setSelectedCategory(null);
      setSelectedDate(moment().format('DD/MM/YYYY'));
      navigation.navigate('ExpenseList', { refresh: true });
      // Alert.alert('Thêm chi tiêu thành công.');
    } catch (error) {
      console.error('Lỗi thêm chi tiêu:', error);
    } finally {
      setButtonDisabled(false);
    }
  };
  const confirmDateSelection = () => {
    setSelectedDate(tempSelectedDate);
    setModalVisible(false);
  };

  const cancelDateSelection = () => {
    setTempSelectedDate(selectedDate);
    setModalVisible(false);
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <ScrollView>
      <TouchableOpacity style={tw`self-end mb-4`} onPress={() => setShowIncomeList(!showIncomeList)}>
        <Ionicons name="ellipsis-horizontal" size={24} color="#5A5DD1" />
      </TouchableOpacity>
      {showIncomeList && (
        <TouchableOpacity onPress={() => navigation.navigate('ExpenseList')} style={tw`bg-indigo-600 rounded-lg p-2 self-end mb-2`}>
          <Text style={tw`text-white font-bold`}>Sổ giao dịch</Text>
        </TouchableOpacity>
      )}
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
          autoFocus
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
      <Modal visible={isModalVisible} transparent={true} animationType="none">
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-violet-100 rounded-lg p-4 w-11/12`}>
            <CalendarPicker
              onDateChange={(date) => {
                const formattedDate = moment(date).format('DD/MM/YYYY');
                setTempSelectedDate(formattedDate);
              }}
              selectedDate={moment(tempSelectedDate, 'DD/MM/YYYY')}
              maxDate={moment().toDate()}
              previousTitle={<Text style={{ color: '#5A5DD1', fontSize: 20, }}>◀</Text>}
              nextTitle={<Text style={{ color: '#5A5DD1', fontSize: 20 }}>▶</Text>}
              weekdays={['CN', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7']}
              months={[
                'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
              ]}
              customDatesStyles={[
                {
                  date: moment(tempSelectedDate, 'DD/MM/YYYY').toDate(),
                  style: { backgroundColor: '#5A5DD1' },
                  textStyle: { color: '#fff' },
                },
              ]}
              selectedDayColor="#5A5DD1"
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
      {isLoadingCategories ? (
  <ActivityIndicator size="large" color="#5A5DD1" />
) : categories.length > 0 ? (
  categories.reduce((rows, category, index) => {
    if (index % 3 === 0) {
      rows.push(
        <View key={index} style={tw`flex-row justify-between mb-2`}>
          {/* Danh mục thứ nhất */}
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
            <Text style={tw`text-center`}>
              {category.name.length > 20 ? category.name.substring(0, 20) + '...' : category.name}
            </Text>
            {selectedCategory === category._id && (
              <Ionicons name="checkmark-circle" size={24} color="#8270DB" style={tw`absolute top-0 right-0`} />
            )}
          </TouchableOpacity>

          {/* Danh mục thứ hai */}
          {categories[index + 1] && (
            <TouchableOpacity
              key={categories[index + 1]._id}
              style={[
                tw`flex-1 items-center p-2 bg-gray-50 rounded-lg mr-2`,
                selectedCategory === categories[index + 1]._id ? tw`border-2 bg-indigo-50 border-indigo-400` : ''
              ]}
              onPress={() => setSelectedCategory(categories[index + 1]._id)}
            >
              <Image
                source={{ uri: categories[index + 1].image }}
                style={tw`w-10 h-10 mb-2`}
                resizeMode="contain"
              />
              <Text style={tw`text-center`}>
                {categories[index + 1].name.length > 20 ? categories[index + 1].name.substring(0, 20) + '...' : categories[index + 1].name}
              </Text>
              {selectedCategory === categories[index + 1]._id && (
                <Ionicons name="checkmark-circle" size={24} color="#8270DB" style={tw`absolute top-0 right-0`} />
              )}
            </TouchableOpacity>
          )}

          {/* Danh mục thứ ba */}
          {categories[index + 2] && (
            <TouchableOpacity
              key={categories[index + 2]._id}
              style={[
                tw`flex-1 items-center p-2 bg-gray-50 rounded-lg`,
                selectedCategory === categories[index + 2]._id ? tw`border-2 bg-indigo-50 border-indigo-400` : ''
              ]}
              onPress={() => setSelectedCategory(categories[index + 2]._id)}
            >
              <Image
                source={{ uri: categories[index + 2].image }}
                style={tw`w-10 h-10 mb-2`}
                resizeMode="contain"
              />
              <Text style={tw`text-center`}>
                {categories[index + 2].name.length > 20 ? categories[index + 2].name.substring(0, 20) + '...' : categories[index + 2].name}
              </Text>
              {selectedCategory === categories[index + 2]._id && (
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
  <Text>Không tìm thấy danh mục nào.</Text>
)}
      <TouchableOpacity
        style={[
          tw`p-4 rounded-lg`,
          isLoading ? tw`bg-indigo-200` : tw`bg-indigo-600` // Thay đổi màu khi đang xử lý
        ]}
        onPress={handleAddIncome}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" /> // Hiển thị biểu tượng loading
        ) : (
          <Text style={tw`text-white font-bold text-center`}>
            {isButtonDisabled ? 'Đang thêm nha...' : 'Thêm thu nhập'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};
export default IncomeAdd;
