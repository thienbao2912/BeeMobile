import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import CustomDeleteModal from "../../../components/Popup";
import { deleteCategory, checkCategoryInUse  } from "../../../services/CategoriesService";

export default function ExpenseDetailCate({ route, navigation }) {
  const { category } = route.params; // Nhận dữ liệu category từ route params
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [isDelete, setIsDelete] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(false);
      console.log("Category data:", category);
      // console.log("User data:", users);
    };

    loadData();
  }, [category]);

  // Hàm xử lý chuyển đến trang sửa dữ liệu
  const handleEdit = () => {
    if (category) {
      navigation.navigate("ExpenseEditCate", { category });
    } else {
      Alert.alert("Thông báo", "Không có dữ liệu để sửa.");
    }
  };
  const handleDeleteExpense = () => {
    setIsModalVisible(true);
  };
  
  const confirmDeleteExpense = async () => {
    console.log("Deleting category with ID: ", category._id);
   
    
    try {
        // Kiểm tra xem danh mục có đang được sử dụng không
        const response = await checkCategoryInUse(category._id);
        if (response.message === "Danh mục đang được sử dụng và không thể xóa.") {
            // Nếu danh mục đang được sử dụng, thông báo lỗi và không thực hiện xóa
            Alert.alert("Lỗi", "Danh mục đang được sử dụng và không thể xóa.");
            return;
        }

        // Nếu danh mục không bị sử dụng, tiếp tục xóa
        await deleteCategory(category._id);
        navigation.navigate("CategoryListScreen");
    } catch (error) {
        console.error("Lỗi xóa danh mục", error);
        Alert.alert("Lỗi", error.message || "Lỗi xóa danh mục");
    } finally {
        setIsModalVisible(false);
    }
};

  

  const cancelDeleteExpense = () => {
    setIsModalVisible(false);
  };

  if (!category) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-gray-600 text-lg`}>
          Dữ liệu danh mục không tồn tại.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`bg-slate-50 flex-1 p-4 `}>
      <View style={tw` items-center mb-4`}>
        {/* Hiển thị hình ảnh */}
        <Image
          source={{
            uri: category.image || "https://via.placeholder.com/150",
          }}
          style={tw`w-40 h-40 rounded-lg mb-4`}
          resizeMode="cover"
        />
        {/* Tên danh mục */}
        <Text style={tw`text-2xl font-bold text-gray-800 text-center`}>
          {category.name}
        </Text>
      </View>

      <View style={tw`p-4 bg-white rounded-lg shadow`}>
        {/* Mô tả */}
        <Text style={tw`text-lg font-semibold text-gray-700 mb-2`}>Mô tả:</Text>
        <Text style={tw`text-gray-600 text-base`}>
          {category.description || "Không có mô tả."}
        </Text>

        {/* Loại danh mục */}
        <Text style={tw`text-lg font-semibold text-gray-700 mt-4 mb-2`}>
          Loại:
        </Text>
        <Text style={tw`text-gray-600 text-base`}>
          {category.type === "expense"
            ? "Chi tiêu"
            : category.type === "income"
            ? "Thu nhập"
            : "Không xác định."}
        </Text>
      </View>

      {/* Nút sửa */}
      <TouchableOpacity
        style={tw`bg-indigo-600 rounded-lg mt-4 p-3 items-center`}
        disabled={!isEditable || loading}
        onPress={handleEdit}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={tw`text-white text-lg font-semibold`}>
            {isEditable
              ? "Sửa danh mục"
              : "Đây là danh mục có sẵn không thể sửa"}
          </Text>
        )}
      </TouchableOpacity>
      {/*Nút xóa*/}
      <TouchableOpacity
        style={tw`bg-indigo-600 rounded-lg mt-4 p-3 items-center`}
        disabled={!isDelete || loading}
        onPress={handleDeleteExpense}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={tw`text-white text-lg font-semibold`}>
            {isDelete ? "Xóa danh mục" : "Đây là danh mục có sẵn không thể xóa"}
          </Text>
        )}
      </TouchableOpacity>

      <CustomDeleteModal
        isVisible={isModalVisible}
        onConfirm={confirmDeleteExpense}
        onCancel={cancelDeleteExpense}
        message="Bạn chắc chắn xóa danh mục này?"
      />
    </ScrollView>
  );
}
