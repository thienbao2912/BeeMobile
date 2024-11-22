import React, { useState } from "react";
import { ScrollView, Platform } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import tw from "twrnc";
import ExpenseList from './ExpenseScreen/ExpenseList';
import IncomeList from './IncomeScreen/IncomeList';
const CategoryListScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Danh mục chi tiêu");
  return (
    <ScrollView>
      <SegmentedControl
        values={[ "Danh mục chi tiêu", "Danh mục thu nhập"]}
        selectedIndex={selectedTab === "Danh mục chi tiêu" ? 0 : 1}
        onChange={(event) => {
          const { nativeEvent } = event;
          setSelectedTab(nativeEvent.value);
        }}
        style={tw`mt-4 mb-2 ${
          Platform.OS === "android" ? "shadow-lg border border-gray-300" : ""
        }`}
        tintColor={Platform.OS === "android" ? "#5A5DD1" : "#5A5DD1"}
        backgroundColor={Platform.OS === "android" ? "#E0E0E0" : "#F0F0F0"}
        fontStyle={{ fontWeight: "600", fontSize: 14 }}
        activeFontStyle={{ color: "#FFF", fontWeight: "bold" }}
      />
      {selectedTab === 'Danh mục chi tiêu' ?(
        <ExpenseList />
      ):(
        <IncomeList />
      )}
    </ScrollView>
  );
};

export default CategoryListScreen;
