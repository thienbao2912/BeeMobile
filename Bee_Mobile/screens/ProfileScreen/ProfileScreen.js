import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Modal,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { getUserProfile, updateUser } from "../../services/Auth";
import tw from "twrnc";

const logout = async (navigation) => {
  try {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("userId");
    await SecureStore.deleteItemAsync("userName");
    await SecureStore.deleteItemAsync("userRole");
    await SecureStore.deleteItemAsync("userAvatar");
    await SecureStore.deleteItemAsync("userWallet");
    navigation.navigate("Login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

function Profile() {
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newName, setNewName] = useState("");
  const navigation = useNavigation();

  // Hàm lấy dữ liệu người dùng
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const profile = await getUserProfile();
      setUserProfile(profile);
      setUserName(profile?.name || "Guest");
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect để gọi fetchUserData khi component mount
  useEffect(() => {
    fetchUserData(); // Gọi lấy dữ liệu người dùng khi component mount
  }, []); // [] để chỉ gọi một lần khi component mount

  const handleSaveName = async () => {
    if (newName.trim()) {
      try {
        console.log("Sending update request with new name:", newName);
        const updatedProfile = await updateUser(newName, null); // Gửi tên mới
  
        // Đảm bảo chỉ xử lý các trường có trong API phản hồi
        const userProfileData = {
          name: updatedProfile.name,
          email: updatedProfile.email || userProfile.email, // Giữ email cũ nếu không có trong phản hồi
          avatar: updatedProfile.avatar || userProfile.avatar, // Giữ avatar cũ nếu không có
          wallet: updatedProfile.wallet || userProfile.wallet, // Giữ wallet cũ nếu không có
        };
  
        // Cập nhật trong SecureStore
        await SecureStore.setItemAsync("userProfile", JSON.stringify(userProfileData));
  
        // Cập nhật state để hiển thị tên mới
        setUserName(updatedProfile.name);
        setUserProfile(prevState => ({
          ...prevState,
          name: updatedProfile.name,
        }));
  
        // Reload lại trang hồ sơ
        navigation.replace("ProfileScreen");
        console.log("Tên đã được cập nhật thành công!");
      } catch (error) {
        console.error("Lỗi khi cập nhật tên:", error);
      }
    }
  };
  
  const updateUserAvatar = async () => {
    if (selectedImage) {
      try {
        await updateUser(null, selectedImage); // Gửi ảnh
        alert("Cập nhật ảnh thành công!");
        setIsImageModalVisible(false);
        fetchUserData(); // Reload thông tin
      } catch (error) {
        console.error("Lỗi khi cập nhật ảnh:", error);
        alert("Cập nhật ảnh thất bại!");
      }
    } else {
      alert("Chưa chọn ảnh!");
    }
  };
  
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      // Bạn có thể gửi ảnh lên server tại đây
    }
  };

  if (isLoading) {
    // Hiển thị hiệu ứng loading
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white items-center justify-center px-6 py-10`}>
      <Text style={tw`text-4xl font-bold text-blue-700 mb-8`}>
        {userName || "Guest"}
      </Text>
      {userProfile ? (
        <>
           <TouchableOpacity
            onPress={() => setIsImageModalVisible(true)}
            style={tw`mb-6`}
          >
            <Image
              source={
                userProfile.avatar
                  ? { uri: userProfile.avatar }
                  : require("../../assets/images/rabbit.png")
              }
              style={tw`w-40 h-40 rounded-full shadow-xl`}
            />
          </TouchableOpacity>

          <Text style={tw`text-lg font-bold text-indigo-700`}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(userProfile.wallet)}
          </Text>
          <View style={tw`w-full mb-4`}>
            <Text style={tw`text-lg text-gray-600 mb-2`}>Tên</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <View
                style={tw`bg-gray-100 p-2.7 rounded-lg border border-gray-100 shadow-sm`}
              >
                <Text style={tw`text-lg text-gray-700`}>
                  {userProfile.name}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={tw`w-full mb-6`}>
            <Text style={tw`text-lg text-gray-600 mb-2`}>Email</Text>
            <View
              style={tw`bg-gray-100 p-2.7 rounded-lg border border-gray-100 shadow-sm`}
            >
              <TextInput
                style={tw`text-lg text-gray-700`}
                value={userProfile.email}
                editable={false}
              />
            </View>
          </View>
        </>
      ) : (
        <Text style={tw`text-lg text-gray-500`}>Failed to load user data.</Text>
      )}
      <TouchableOpacity
        style={tw`px-6 py-3 bg-indigo-500 rounded-lg shadow-lg mb-6`}
        onPress={() => navigation.navigate("ChangePassword")}
      >
        <Text style={tw`text-white text-lg font-semibold`}>
          Thay đổi mật khẩu
        </Text>
      </TouchableOpacity>

      
      <TouchableOpacity
            onPress={() => logout(navigation)}
            style={tw`mt-4 px-6 py-3 bg-red-600 rounded-lg shadow-md flex-row justify-center items-center`}
          >
            <Text style={tw`text-white text-lg font-semibold`}>Đăng Xuất</Text>
          </TouchableOpacity>
      {/* Modal hình ảnh */}
      <Modal
            visible={isImageModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsImageModalVisible(false)}
          >
            <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
              <View style={tw`bg-white rounded-lg p-6 items-center`}>
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={tw`w-60 h-60 mb-4 rounded-lg`}
                  />
                ) : (
                  <Image
                    source={
                      userProfile.avatar
                        ? { uri: userProfile.avatar }
                        : require("../../assets/images/rabbit.png")
                    }
                    style={tw`w-60 h-60 mb-4 rounded-lg`}
                  />
                )}
                <Button title="Upload Ảnh" onPress={pickImage} />
                <Button
              title="Cập Nhật Ảnh"
              onPress={updateUserAvatar}
              color="green"
            />
                <Button
                  title="Đóng"
                  onPress={() => setIsImageModalVisible(false)}
                  color="red"
                />
              </View>
            </View>
          </Modal>
      {/* Modal thay đổi tên */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View
            style={tw`w-4/5 bg-white rounded-lg p-6 shadow-xl items-center`}
          >
            <Text style={tw`text-xl font-bold mb-4`}>Thay đổi tên</Text>
            <TextInput
              style={tw`w-full border border-gray-300 p-3 rounded-lg mb-4`}
              placeholder="Nhập tên mới"
              value={newName}
              onChangeText={setNewName}
            />
            <View style={tw`flex-row justify-between w-full`}>
              <Button title="Hủy" onPress={() => setIsModalVisible(false)} />
              <Button title="Lưu" onPress={handleSaveName} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Profile;
