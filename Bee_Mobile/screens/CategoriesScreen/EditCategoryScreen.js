import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import * as SecureStore from "expo-secure-store";
import { updateCategory } from "../../services/CategoriesService";

export default function ExpenseEditCate({ route, navigation }) {
  const { category } = route.params;
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || "");
  const [type, setType] = useState(category.type || "expense");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(category.userId._id); // Truyền userId từ category
  const [categoryId, setCategoryId] = useState(category._id)
  const status = "active"; // Trạng thái mặc định

  console.log(userId);
  
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Tên danh mục không được để trống.");
      return;
    }

    setLoading(true);
    try {
      const updatedCategory = {
        userId,
        name: name.trim(),
        description: description.trim(),
        type,
        status, // Thêm trường status mặc định
      };

      await updateCategory(categoryId, updatedCategory);
      Alert.alert("Thành công", "Danh mục đã được cập nhật.");
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi cập nhật danh mục:", error);
      Alert.alert("Lỗi", "Không thể cập nhật danh mục.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={tw`flex-1 p-4 bg-white`}>
      <Text style={tw`text-2xl font-bold text-gray-800 mb-4 text-center`}>
        Sửa danh mục
      </Text>

      {/* Tên danh mục */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold text-gray-700`}>Tên danh mục:{category._id}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={tw`border p-3 mt-2 rounded-lg`}
          placeholder="Nhập tên danh mục"
        />
      </View>

      {/* Mô tả */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold text-gray-700`}>Mô tả:</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={tw`border p-3 mt-2 rounded-lg`}
          placeholder="Nhập mô tả"
          multiline
        />
      </View>

      {/* Loại danh mục */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold text-gray-700`}>Loại:</Text>
        <View style={tw`flex-row mt-2`}>
          <TouchableOpacity
            style={tw`flex-1 py-3 bg-${type === "expense" ? "blue-500" : "gray-200"} rounded-lg mr-2`}
            onPress={() => setType("expense")}
          >
            <Text style={tw`text-center text-${type === "expense" ? "white" : "black"}`}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 py-3 bg-${type === "income" ? "blue-500" : "gray-200"} rounded-lg`}
            onPress={() => setType("income")}
          >
            <Text style={tw`text-center text-${type === "income" ? "white" : "black"}`}>
              Income
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nút lưu */}
      <TouchableOpacity
        style={tw`bg-green-500 rounded-lg mt-6 p-4 items-center`}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={tw`text-white text-lg font-semibold`}>Lưu thay đổi</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
