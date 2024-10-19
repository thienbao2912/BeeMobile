import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Image, ScrollView, Animated, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LocaleConfig, Calendar } from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/vi'; 


LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ],
  monthNamesShort: [
    'Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6',
    'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'
  ],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay'
};
LocaleConfig.defaultLocale = 'vi';

const IncomeAdd = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showIncomeList, setShowIncomeList] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('DD/MM/YYYY')); // Set default to today's date
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState(moment().format('YYYY-MM-DD')); // Default to today’s date
  const scaleValue = new Animated.Value(0);

  const navigation = useNavigation();

  const handleDayPress = (day) => {
    setTempDate(day.dateString);
  };

  const handleOkPress = () => {
    setSelectedDate(moment(tempDate).format('DD/MM/YYYY')); // Format the selected date as "Ngày tháng năm"
    setModalVisible(false);
  };

  const handleCancelPress = () => {
    setTempDate(selectedDate ? moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'));
    setModalVisible(false);
  };

  useEffect(() => {
    if (isModalVisible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [isModalVisible]);

  const categories = [
    { id: 1, name: 'Lương', image: require('../../../assets/images/salary.png') },
    { id: 2, name: 'Đầu tư', image: require('../../../assets/images/profits.png') },
    { id: 3, name: 'Tiết kiệm', image: require('../../../assets/images/piggy-bank.png') },
    { id: 4, name: 'Làm việc', image: require('../../../assets/images/hard-work.png') }
  ];

  const handleAmountChange = (input) => {
    const numericValue = input.replace(/\D/g, '');
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setAmount(formattedValue);
  };

  const handleAddIncome = () => {
    const cleanedDescription = description.trim(); // Loại bỏ khoảng trắng ở đầu và cuối
    const numericAmount = amount.replace(/,/g, '');

    if (!cleanedDescription) {
      console.log("Vui lòng nhập mô tả hợp lệ.");
      return;
    }

    console.log("Send:", { numericAmount, cleanedDescription, selectedCategory, selectedDate });
    // Reset
    setAmount('');
    setDescription('');
    setSelectedCategory(null);
    setSelectedDate(moment().format('DD/MM/YYYY')); 
  };

  return (
    <ScrollView contentContainerStyle={styles.card}>
      <TouchableOpacity style={styles.listButton} onPress={() => setShowIncomeList(!showIncomeList)}>
        <Ionicons name="ellipsis-horizontal" size={24} color="#5A5DD1" />
      </TouchableOpacity>

      {showIncomeList && (
        <TouchableOpacity onPress={() => navigation.navigate('CategoryList')} style={styles.listContainer}>
          <Text style={styles.listText}>Sổ thu nhập</Text>
        </TouchableOpacity>
      )}

      <View style={styles.inputBorder}>
        <Ionicons name="cash-outline" size={24} color="#D3D3D3" />
        <TextInput
          placeholder="Số tiền"
          style={styles.amount}
          value={amount}
          onChangeText={handleAmountChange}
          keyboardType="numeric"
          autoFocus
        />
      </View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View pointerEvents="none" style={styles.inputDate}>
          <Ionicons name="calendar" size={24} color="#D3D3D3" />
          <TextInput
            style={styles.input}
            value={selectedDate}
            placeholder="Chọn ngày"
            editable={false}
          />
        </View>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="none">
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.calendarContainer, { transform: [{ scale: scaleValue }] }]}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={{
                [tempDate]: { selected: true, selectedColor: '#5A5DD1' },
              }}
              maxDate={moment().format('YYYY-MM-DD')}
              firstDay={1}
              theme={{
                backgroundColor: '#FFF4F5',
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
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPress}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.okButton} onPress={handleOkPress}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
      <View style={styles.inputDescription}>
        <Ionicons name="document-text" size={24} color="#D3D3D3" />
        <TextInput
          placeholder="Mô tả"
          style={styles.input}
          value={description}
          onChangeText={(text) => setDescription(text.replace(/\n{2,}/g, '\n'))} // Không cho phép nhiều dòng trống liên tiếp
          multiline
          numberOfLines={3}
        />
      </View>


      <View style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.name)}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.selectedCategory,
              index % 2 === 0 ? styles.firstInRow : styles.secondInRow,
            ]}
          >
            <Image source={category.image} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
        <Text style={styles.addButtonText}>Thêm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    borderRadius: 15
  },
  listButton: {
    alignItems: 'flex-end',
    padding: 5,
    marginBottom: 10
  },
  listContainer: {
    backgroundColor: '#5A5DD1',
    borderRadius: 10,
    padding: 10,
    alignSelf: 'flex-end',
    marginBottom: 10
  },
  listText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  inputDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#ffff',
    borderWidth: 2,
    borderColor:'#EEF1FF',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 70
  },
  inputDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#EEF1FF',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 40
  },
  inputBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  amount: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    height: 40,
    color: '#5A5DD1'
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: '#FFF4F5',
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    width: '40%',
    alignItems: 'center',
  },
  okButton: {
    backgroundColor: '#5A5DD1',
    // FF69B4
    borderRadius: 8,
    padding: 10,
    width: '40%',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    backgroundColor: '#F3F4F5',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 15,
  },
  selectedCategory: {
    borderWidth: 1,
    borderColor: '#5A5DD1',
    backgroundColor: '#EEF1FF',
  },
  categoryImage: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  categoryText: {
    color: '#333',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#5A5DD1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default IncomeAdd;
