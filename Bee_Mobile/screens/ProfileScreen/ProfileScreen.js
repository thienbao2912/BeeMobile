import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { getUserProfile } from "../../services/Auth";
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
  const [isLoading, setIsLoading] = useState(true); // Thêm biến isLoading
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true); // Bắt đầu hiệu ứng loading
        const profile = await getUserProfile();
        setUserProfile(profile);
        setUserName(profile?.name || "Guest");
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 1000); // Kết thúc loading sau 1 giây
      }
    };
    fetchUserData();
  }, []);

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
      <Text style={tw`text-4xl font-bold text-blue-700 mb-8`}>{userProfile.name}</Text>
      {userProfile ? (
        <>
          <Image
            source={
              userProfile.avatar
                ? { uri: userProfile.avatar }
                : require("../../assets/images/rabbit.png")
            }
            style={tw`w-40 h-40 rounded-full shadow-xl mb-6`}
          />

          <Text style={tw`text-lg font-bold text-indigo-700`}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(userProfile.wallet)}
          </Text>
          <View style={tw`w-full mb-4`}>
            <Text style={tw`text-lg text-gray-600 mb-2`}>Tên</Text>
            <View
              style={tw`bg-gray-100 p-2.7 rounded-lg border border-gray-100 shadow-sm`}
            >
              <TextInput
                style={tw`text-lg text-gray-700`}
                value={userProfile.name}
                editable={false}
              />
            </View>
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
        onPress={() => logout(navigation)}
      >
        <Text style={tw`text-white text-lg font-semibold`}>Đăng xuất</Text>
        
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`px-6 py-3 bg-indigo-500 rounded-lg shadow-lg mb-6`}
        onPress={() => navigation.navigate("ChangePassword")}
      >
        <Text style={tw`text-white text-lg font-semibold`}>Thay đổi mật khẩu</Text>
        
      </TouchableOpacity>
    </View>
  );
}

export default Profile;
