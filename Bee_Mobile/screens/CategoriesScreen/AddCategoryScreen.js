import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import tw from "twrnc";
import { addCategory } from "../../services/CategoriesService";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const AddCategoryScreen = () => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryType, setCategoryType] = useState("Khoản chi");
  const [selectedIcon, setSelectedIcon] = useState("category"); // Lưu trữ tên icon (hoặc URL hình ảnh)
  const [iconModalVisible, setIconModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  // Danh sách các hình ảnh với đường dẫn
  const iconList = [
    "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Fserum.png?alt=media&token=3038a34d-dac5-44c8-8fd8-c18fdd57f3b2",
    "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Fmoney-bags.png?alt=media&token=f4afaeaa-2df0-4cd3-a43b-48a708a4a1aa",
    "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Ftrolley.png?alt=media&token=95a991dc-1296-43f4-9025-7b28c46b1e88",
    "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Fcalendar.png?alt=media&token=2b1cba37-5a7a-40e4-9089-b5cfe5415661",
    "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Fbeach-umbrella.png?alt=media&token=af15ef7c-7c48-4e4a-90d6-584b889cdbcc",
    "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Fcorgi%20(1).png?alt=media&token=37715603-0b48-462c-bba2-3a2bf1b7bd9e",
    "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Fvehicle.png?alt=media&token=b32e1352-3a10-470f-b81a-e39a8d3d92fb",
    "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Fcocktail.png?alt=media&token=3fa3ab8c-ba13-42b7-921a-9d4abd53e120",
    "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Fpaying.png?alt=media&token=87a91932-254a-4492-8e44-2234c5beb175",
    "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Fprofits.png?alt=media&token=f746cec4-e9dd-48cf-bf3f-1c06709f5733",
    "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Fhealthy.png?alt=media&token=7025f847-2a36-4ded-84ff-75455f22c18a",
    "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Ftravel-luggage.png?alt=media&token=adf8bdfc-8457-47a6-b63d-ee672dc2bbf6",
    "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Fdiet.png?alt=media&token=3f36f899-61c4-45b4-9989-35abaaa1b1e1",
  ];

  useEffect(() => {
    const loadUserId = async () => {
      const id = await SecureStore.getItemAsync("userId");
      setUserId(id);
      console.log(id);
    };
    loadUserId();
  }, []);

  const handleSelectIcon = (icon) => {
    setSelectedIcon(icon); // Cập nhật giá trị icon đã chọn
    setIconModalVisible(false); // Đóng modal sau khi chọn
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Đặt giá trị mặc định cho selectedIcon nếu chưa được chọn
      const iconToSave =
        selectedIcon === "category"
          ? "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Fserum.png?alt=media&token=3038a34d-dac5-44c8-8fd8-c18fdd57f3b2"
          : selectedIcon;

      const newCategory = {
        _id: null,
        userId: `ObjectId('${userId}')`,
        status: "active",
        type: categoryType, // Lưu giá trị 'income' hoặc 'expense'
        name: categoryName,
        image: iconToSave, // Đảm bảo giá trị icon hợp lệ
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description,
      };

      await addCategory(newCategory);

      console.log("Danh mục đã được lưu:", newCategory);
      setCategoryName("");
      setCategoryType("expense");
      setSelectedIcon("category");
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 p-4 bg-white`}>
      {/* Hiển thị thông báo lỗi nếu tên danh mục trống */}
      {error ? <Text style={tw`text-red-500 mb-2`}>{error}</Text> : null}

      {/* Icon và tên danh mục */}
      <View style={tw`flex-row items-center mb-4`}>
        <TouchableOpacity
          onPress={() => setIconModalVisible(true)}
          style={tw`mr-4`}
        >
          <Image
            source={{
              uri:
                selectedIcon === "category"
                  ? "https://firebasestorage.googleapis.com/v0/b/asmreactjs-c0ddc.appspot.com/o/categories%2Fserum.png?alt=media&token=3038a34d-dac5-44c8-8fd8-c18fdd57f3b2"
                  : selectedIcon,
            }}
            style={tw`w-12 h-12`} // Kích thước icon
          />
        </TouchableOpacity>

        <TextInput
          placeholder="Tên danh mục"
          value={categoryName}
          onChangeText={(text) => {
            setCategoryName(text);
            setError(""); // Xóa thông báo lỗi khi người dùng bắt đầu nhập
          }}
          style={tw`border border-gray-300 p-3 rounded-lg flex-1`}
        />
      </View>

      {/* Chọn loại danh mục */}
      <Text style={tw`mb-2 text-gray-700 font-semibold`}>Loại danh mục</Text>
      <SegmentedControl
        values={["Khoản chi", "Khoản thu"]}
        selectedIndex={categoryType === "expense" ? 0 : 1} // "expense" là 0, "income" là 1
        onChange={(event) => {
          const selectedValue = event.nativeEvent.value;
          setCategoryType(selectedValue === "Khoản chi" ? "expense" : "income"); // Chuyển đổi giá trị API
        }}
        style={tw`mb-4`}
      />

      {/* Nút lưu */}
      <TouchableOpacity
        style={[
          tw`p-4 rounded-lg mt-4`,
          isLoading ? tw`bg-indigo-200` : tw`bg-indigo-600`,
        ]}
        onPress={handleSaveCategory}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={tw`text-white font-bold text-center`}>
            {isLoading ? "Đang lưu..." : "Lưu danh mục"}
          </Text>
        )}
      </TouchableOpacity>

      {/* Nút điều hướng đến danh sách danh mục */}
      <TouchableOpacity
        style={tw`p-3 mt-4 bg-indigo-600 rounded-lg flex-row items-center justify-center space-x-2 mb-4`}
        onPress={() => navigation.navigate("CategoryListScreen")}
      >
        <Ionicons name="list" size={24} color="white" />
        <Text style={tw`text-white font-semibold`}>Danh sách danh mục</Text>
      </TouchableOpacity>

      {/* Modal chọn icon */}
      <Modal
        visible={iconModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white p-5 rounded-lg w-3/4`}>
            <Text style={tw`text-lg font-bold mb-4`}>Chọn icon</Text>
            <ScrollView contentContainerStyle={tw`flex-row flex-wrap`}>
              {iconList.map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedIcon(icon);
                    setIconModalVisible(false);
                  }}
                  style={tw`p-2 m-1`}
                >
                  <Image
                    source={{ uri: icon }} // Hiển thị ảnh từ URL
                    style={tw`w-14 h-12`} // Điều chỉnh kích thước icon
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={tw`mt-4 p-3 rounded-lg bg-gray-300`}
              onPress={() => setIconModalVisible(false)}
            >
              <Text style={tw`text-center text-gray-700 font-semibold`}>
                Đóng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddCategoryScreen;
