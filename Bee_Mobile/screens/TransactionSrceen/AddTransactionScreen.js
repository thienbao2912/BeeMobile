import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control'; // Ensure this is the correct import
import ExpenseAdd from './ExpenseSrceen/ExpenseAdd'; // Verify path
import IncomeAdd from './IncomeSrceen/IncomeAdd'; // Verify path

const AddTransactionScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Chi tiêu'); // Default selected tab

  return (
    <ScrollView>
      <SegmentedControl
        values={['Chi tiêu', 'Thu nhập']}
        selectedIndex={selectedTab === 'Chi tiêu' ? 0 : 1} // Determine selected index
        onChange={(event) => {
          const { nativeEvent } = event; // Extract native event
          setSelectedTab(nativeEvent.value); // Update selected tab
        }}
        style={styles.segmentedControl}
        tintColor="#5A5DD1" // Background color of selected segment
        backgroundColor="#F0F0F0" // Background color of unselected segments
        fontStyle={{ fontWeight: '600' }} // Font style
        activeFontStyle={{ color: '#FFF' }} // Font color when segment is selected
      />

      {selectedTab === 'Chi tiêu' ? ( // Conditional rendering based on selected tab
        <ExpenseAdd />
      ) : (
        <IncomeAdd />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  segmentedControl: {
    marginTop: 15,
    marginVertical: 7,
    marginHorizontal: 50,
    height: 40,
  },
});

export default AddTransactionScreen;
