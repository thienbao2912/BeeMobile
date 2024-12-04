import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    ScrollView,
    Image,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import 'moment/locale/vi';
import { addSavingsFund, fetchAllCategories } from '../../services/SavingsFundService';
import * as SecureStore from 'expo-secure-store';
import tw from 'twrnc';
import { FontAwesome } from '@expo/vector-icons';
moment.locale('vi');
const SavingFundAdd = () => {
    const [targetAmount, setTargetAmount] = useState('');
    const [name, setName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [startDate, setStartDate] = useState(moment().format('DD/MM/YYYY'));
    const [endDate, setEndDate] = useState(moment().format('DD/MM/YYYY'));
    const [tempStartDate, setTempStartDate] = useState('');
    const [tempEndDate, setTempEndDate] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [isLoadingCategories, setLoadingCategories] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isButtonDisabled, setButtonDisabled] = useState(false);
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
    const handleAddSavingFund = async () => {
        if (isButtonDisabled) return;
        if (isLoading || !targetAmount || !name || !selectedCategory || !userId) return;
        const numericAmount = parseFloat(targetAmount.replace(/,/g, ''));
        if (isNaN(numericAmount)) return;
        const newSavingFund = {
            userId,
            name,
            targetAmount: numericAmount,
            categoryId: selectedCategory,
            startDate: moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            endDate: moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        };
        try {
            setButtonDisabled(true);
            await addSavingsFund(newSavingFund);
            setTargetAmount('');
            setName('');
            setSelectedCategory(null);
            setStartDate(moment().format('DD/MM/YYYY'));
            setEndDate(moment().format('DD/MM/YYYY')); navigation.navigate('SavingFundList', { refresh: true });
        } catch (error) {
            console.error('Error adding savings fund:', error);
        } finally {
            setButtonDisabled(false);
        }
    };
    const handleDateSelection = (dateType) => {
        if (dateType === 'start') {
            setStartDate(tempStartDate);
        } else {
            setEndDate(tempEndDate);
        }
        setModalVisible(false);
    };
    const cancelDateSelection = () => {
        setModalVisible(false);
    };
    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }
    return (
        <ScrollView>
            <View style={tw`bg-white rounded-lg mt-2 mx-2 p-2`}>
                <View style={tw`flex-row items-center border-2 border-indigo-100 bg-white rounded-lg p-2 mt-2 mb-4`}>
                    <Ionicons name="document-text" size={24} color="#9370DB" />
                    <TextInput
                        placeholder="Tên quỹ"
                        style={tw`flex-1 ml-2 text-base`}
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View style={tw`flex-row items-center border-b border-indigo-100 p-2 mb-4`}>
                    <FontAwesome name="dollar" size={24} color="#9370DB" />
                    <TextInput
                        placeholder="Số tiền mục tiêu"
                        style={tw`flex-1 text-2xl ml-2 text-indigo-600`}
                        value={targetAmount}
                        onChangeText={(input) => {
                            const numericValue = input.replace(/\D/g, '');
                            const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            setTargetAmount(formattedValue);
                        }}
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <View style={tw`flex-row items-center bg-indigo-50 rounded-lg px-2 h-10 mb-4`}>
                        <Ionicons name="calendar" size={24} color="#9370DB" />
                        <TextInput
                            style={tw`text-gray-500 flex-1 ml-2`}
                            value={`${startDate} - ${endDate}`}
                            placeholder="Chọn ngày"
                            editable={false}
                        />
                    </View>
                </TouchableOpacity>
                <Modal visible={isModalVisible} transparent={true} animationType="none">
                    <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                        <View style={tw`bg-white rounded-lg p-6 w-11/12`}>
                            <CalendarPicker
                                onDateChange={(date) => {
                                    const formattedDate = moment(date).format('DD/MM/YYYY');
                                    setTempStartDate(formattedDate);
                                    setTempEndDate(formattedDate);
                                }}
                                selectedDate={moment(tempStartDate, 'DD/MM/YYYY')}
                                minDate={moment().toDate()}
                                maxDate={moment().add(10, 'years').toDate()}
                                previousTitle={<Text style={{ color: '#5A5DD1', fontSize: 20 }}>◀</Text>}
                                nextTitle={<Text style={{ color: '#5A5DD1', fontSize: 20 }}>▶</Text>}
                                weekdays={['CN', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7']}
                                months={['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']}
                            />
                            <View style={tw`flex-row justify-between mt-6`}>
                                <TouchableOpacity
                                    style={tw`bg-gray-300 p-3 rounded-lg flex-1 mr-3`}
                                    onPress={cancelDateSelection}
                                ><Text style={tw`text-center`}>Hủy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={tw`bg-indigo-800 p-3 rounded-lg flex-1 mr-3`}
                                    onPress={() => handleDateSelection('start')}
                                >
                                    <Text style={tw`text-white text-center`}>Chọn Ngày Bắt Đầu</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={tw`bg-indigo-800 p-3 rounded-lg flex-1`}
                                    onPress={() => handleDateSelection('end')}
                                >
                                    <Text style={tw`text-white text-center`}>Chọn Ngày Kết Thúc</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={tw`flex-row items-center border-b border-indigo-100 p-2 mb-4`}>
                    <Ionicons name="list" size={24} color="#9370DB" />
                    <TouchableOpacity style={tw`flex-1 ml-2`}>
                        <Text style={tw`text-lg`}>
                            {selectedCategory ? categories.find(cat => cat._id === selectedCategory)?.name : 'Chọn danh mục'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {isLoadingCategories ? (
                    <ActivityIndicator size="large" color="#5A5DD1" />
                ) : categories.length > 0 ? (
                    categories.reduce((rows, category, index) => {
                        if (index % 3 === 0) {
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
                                        <Text style={tw`text-center`}>
                                            {category.name.length > 20 ? category.name.substring(0, 20) + '...' : category.name}
                                        </Text>
                                        {selectedCategory === category._id && (
                                            <Ionicons name="checkmark-circle" size={24} color="#8270DB" style={tw`absolute top-0 right-0`} />
                                        )}
                                    </TouchableOpacity>
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
                                                <Ionicons name="checkmark-circle" size={24} color="#8270DB" style={tw`absolute top-0 right-0`} />)}
                                        </TouchableOpacity>
                                    )}
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
                        isLoading ? tw`bg-indigo-200` : tw`bg-indigo-600`
                    ]}
                    onPress={handleAddSavingFund}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={tw`text-white font-bold text-center`}>
                            {isButtonDisabled ? 'Đang thêm...' : 'Thêm quỹ'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};
export default SavingFundAdd;