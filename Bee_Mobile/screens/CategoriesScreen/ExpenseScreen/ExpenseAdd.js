import React, { useState, useEffect, useRef } from "react";
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
import tw from "twrnc";
const ExpenseAdd = () => {
  return (
    <ScrollView>
      <View
        style={tw`flex-row items-center border-b border-violet-100 p-2 mb-4`}
      >
        <Image
          source={require("../../../assets/images/money-bags.png")}
          style={{ width: 27, height: 27 }}
        />
        <TextInput
          placeholder="Tên danh mục"
          style={tw`flex-1 text-2xl ml-2 text-indigo-600`}
          value="Tên danh mục"
          keyboardType="default"
          autoFocus
        />
      </View>
    </ScrollView>
  );
};
export default ExpenseAdd;
