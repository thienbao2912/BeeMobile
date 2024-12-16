import React, { useState, useCallback } from "react";
import { ScrollView, Platform, View } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import tw from "twrnc";
import ExpenseList from "./ExpenseScreen/ExpenseList";
import IncomeList from "./IncomeScreen/IncomeList";
import { useFocusEffect } from "@react-navigation/native";
const CategoryListScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Danh mục chi tiêu");
  const [refreshKey, setRefreshKey] = useState(0); // State để kích hoạt load lại dữ liệu

  // Hàm để làm mới dữ liệu
  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [])
  );
  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Thanh điều hướng tab */}
      <SegmentedControl
        values={["Danh mục chi tiêu", "Danh mục thu nhập"]}
        selectedIndex={selectedTab === "Danh mục chi tiêu" ? 0 : 1}
        onChange={(event) => {
          const { nativeEvent } = event;
          setSelectedTab(nativeEvent.value);
        }}
        style={tw`m-4 ${
          Platform.OS === "android" ? "shadow-lg border border-gray-300" : ""
        }`}
        tintColor={Platform.OS === "android" ? "#5A5DD1" : "#5A5DD1"}
        backgroundColor={Platform.OS === "android" ? "#E0E0E0" : "#F0F0F0"}
        fontStyle={{ fontWeight: "600", fontSize: 14 }}
        activeFontStyle={{ color: "#FFF", fontWeight: "bold" }}
      />

      {/* Nội dung dựa trên tab */}
      <ScrollView
        contentContainerStyle={``
          
        }
      >
        {selectedTab === "Danh mục chi tiêu" ? (
          <ExpenseList refreshKey={refreshKey} onRefresh={handleRefresh} />
        ) : (
          <IncomeList refreshKey={refreshKey} onRefresh={handleRefresh} />
        )}
      </ScrollView>
    </View>
  );
};

export default CategoryListScreen;
