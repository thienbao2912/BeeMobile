import React, { useState } from 'react';
import { ScrollView, Platform } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control'; 
import ExpenseAdd from './ExpenseSrceen/ExpenseAdd';
import IncomeAdd from './IncomeSrceen/IncomeAdd';
import tw from 'twrnc';

const AddTransactionScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Chi tiêu');

  return (
    <ScrollView contentContainerStyle={tw`flex-grow p-4 bg-white mx-2 rounded-lg mt-2`}>
      <SegmentedControl
        values={['Chi tiêu', 'Thu nhập']}
        selectedIndex={selectedTab === 'Chi tiêu' ? 0 : 1}
        onChange={(event) => {
          const { nativeEvent } = event;
          setSelectedTab(nativeEvent.value);
        }}
        style={tw`mt-4 mb-2 ${Platform.OS === 'android' ? 'shadow-lg border border-gray-300' : ''}`} 
        tintColor={Platform.OS === 'android' ? '#5A5DD1' : '#5A5DD1'}
        backgroundColor={Platform.OS === 'android' ? '#E0E0E0' : '#F0F0F0'}
        fontStyle={{ fontWeight: '600', fontSize: 14 }}
        activeFontStyle={{ color: '#FFF', fontWeight: 'bold' }}
      />

      {selectedTab === 'Chi tiêu' ? (
        <ExpenseAdd />
      ) : (
        <IncomeAdd />
      )}
    </ScrollView>
  );
};

export default AddTransactionScreen;
