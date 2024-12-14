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
import { useNavigation } from "@react-navigation/native";

export default function ExpenseEditCate({ route }) {
  const { category } = route.params;
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || "");
  const [type, setType] = useState(category.type || "expense");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(category.userId._id); // Truyền userId từ category
  const [categoryId, setCategoryId] = useState(category._id)
  const status = "active"; // Trạng thái mặc định
  const navigation = useNavigation();
  
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
      navigation.navigate("CategoryListScreen")
    } catch (error) {
      console.error("Lỗi cập nhật danh mục:", error);
      Alert.alert("Lỗi", "Không thể cập nhật danh mục.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={tw`flex-1 p-4 bg-white`}>
     

      {/* Tên danh mục */}
      <View style={tw`mb-4 mt-4`}>
        <Text style={tw`text-lg font-semibold text-gray-700`}>Tên danh mục: </Text>
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
            style={tw`flex-1 py-3 bg-${type === "expense" ? "indigo-500" : "gray-200"} rounded-lg mr-2`}
            onPress={() => setType("expense")}
          >
            <Text style={tw`text-center text-${type === "expense" ? "white" : "black"}`}>
              Chi tiêu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 py-3 bg-${type === "income" ? "indigo-500" : "gray-200"} rounded-lg`}
            onPress={() => setType("income")}
          >
            <Text style={tw`text-center text-${type === "income" ? "white" : "black"}`}>
              Thu nhập
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nút lưu */}
      <TouchableOpacity
        style={tw`bg-indigo-600 rounded-lg mt-6 p-3 items-center`}
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
