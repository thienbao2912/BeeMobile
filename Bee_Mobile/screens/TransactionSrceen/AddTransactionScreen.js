import React, { useState } from 'react';
import { ScrollView, View, Platform } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control'; 
import ExpenseAdd from './ExpenseSrceen/ExpenseAdd';
import IncomeAdd from './IncomeSrceen/IncomeAdd';
import tw from 'twrnc';

const AddTransactionScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Chi tiêu');

  return (
    <ScrollView contentContainerStyle={tw`flex-grow p-4 bg-white mx-2 rounded-lg mt-2`}>
      <View style={tw`mx-auto mb-1`} /* Centered and custom width */>
        <SegmentedControl
          values={['Chi tiêu', 'Thu nhập']}
          selectedIndex={selectedTab === 'Chi tiêu' ? 0 : 1}
          onChange={(event) => {
            const { nativeEvent } = event;
            setSelectedTab(nativeEvent.value);
          }}
          style={[tw`mt-2 rounded-md`, { width: 200 }]} // Adjust width here
          tintColor="#5A5DD1"
          backgroundColor={Platform.OS === 'android' ? '#ECECEC' : '#F0F0F0'}
          fontStyle={{
            fontWeight: '500',
            fontSize: 13,
            color: '#5A5DD1',
          }}
          activeFontStyle={{
            color: '#FFF',
            fontWeight: '600',
            fontSize: 13,
          }}
          segmentStyle={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 6,
            ...(Platform.OS === 'android' && { elevation: 2 }),
          }}
        />
      </View>

      {selectedTab === 'Chi tiêu' ? (
        <ExpenseAdd />
      ) : (
        <IncomeAdd />
      )}
    </ScrollView>
  );
};

export default AddTransactionScreen;