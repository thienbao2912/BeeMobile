import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import tw from "twrnc";
import {
  fetchAllCategories,
  fetchAllCategoriesByUser,
} from "../../../services/CategoriesService";
import { useNavigation } from "@react-navigation/native";

const ExpenseListCate = ({ route, refreshKey }) => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [isLoading, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        // Lấy userId từ SecureStore
        const userId = await SecureStore.getItemAsync("userId");
        if (!userId) {
          console.error("UserId không tồn tại trong SecureStore");
          setLoadingCategories(false);
          return;
        }

        // Lấy danh mục mặc định
        const defaultCategoriesResponse = await fetchAllCategories();
        const defaultCategories =
          defaultCategoriesResponse?.data?.filter(
            (category) => category.type === "expense"
          ) || [];

        // Lấy danh mục do người dùng tạo
        const userCategoriesResponse = await fetchAllCategoriesByUser(userId);
        const userCategories =
          userCategoriesResponse?.data?.filter(
            (category) => category.type === "expense"
          ) || [];

        // Hợp nhất danh mục và loại bỏ trùng lặp bằng cách sử dụng _id duy nhất
        const combinedCategories = [
          ...defaultCategories,
          ...userCategories.filter(
            (userCategory) =>
              !defaultCategories.some(
                (defaultCategory) => defaultCategory._id === userCategory._id
              )
          ),
        ];

        setCategories(combinedCategories);
      } catch (error) {
        console.error("Lỗi khi fetch danh mục:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [refreshKey]);

  const isValidImage = (url) => {
    return url && (url.startsWith("http://") || url.startsWith("https://"));
  };

  const handleDetail = (category) => {
    navigation.navigate("ExpenseDetailCate", { category });
  };

  if (isLoading) {
    return <ActivityIndicator size={40} color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={tw`p-4`}>
    <View style={tw`flex-row flex-wrap justify-center `}>
      {categories.map((category, index) => (
        <TouchableOpacity
          key={category._id}
          style={[
            tw`w-1/4 p-2 m-3 rounded-lg bg-white shadow-lg`,
            
          ]}
          onPress={() => handleDetail(category)} // Điều hướng khi nhấn
        >
          <Image
            source={{
              uri: isValidImage(category.image)
                ? category.image
                : "https://via.placeholder.com/150",
            }}
            style={tw`w-18 h-18 rounded-full`}
            resizeMode="cover"
          />
          <Text style={tw`text-center font-semibold text-gray-800`}>
            {category.name.length > 20
              ? `${category.name.substring(0, 20)}...`
              : category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>
  

  );
};

export default ExpenseListCate;
