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
import { updatePasword } from "../../services/Auth";
import { validateOldPassword } from "../../services/Auth";
import { useForm, Controller } from "react-hook-form";
import Feather from "react-native-vector-icons/Feather";

import tw from "twrnc";

function ChangePassword() {
  const [isLoading, setIsLoading] = useState(true);
  const [oldpasswordVisible, setOldPasswordVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState(null);
  const {
    control,
    register,
    setError,
    clearErrors,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true); // Bắt đầu hiệu ứng loading
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 1000); // Kết thúc loading sau 1 giây
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async (data) => {
    console.log("User ID:", userProfile?._id); 
    console.log("Old password:", data.oldPassword); 
    
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        message: "Mật khẩu và xác nhận mật khẩu không khớp.",
      });
      return;
    }
  
    try {
      const oldPasswordValid = await validateOldPassword(
        userProfile?._id,
        data.oldPassword
      );
      console.log("Old password validation result:", oldPasswordValid);
  
      if (!oldPasswordValid?.success) {
        setError("oldPassword", { message: "Mật khẩu cũ không chính xác." });
        return;
      }
  
      const updateData = { password: data.password };
      await updatePasword(userProfile._id, updateData);
      alert("Đổi mật khẩu thành công!");
      navigation.goBack();
    } catch (error) {
      console.error("Password update error:", error);
      setError("api", { message: "Đã xảy ra lỗi khi đổi mật khẩu." });
    }
  };
  
  
  

  const handleFocus = () => {
    clearErrors();
  };
  const handleForgot = () => {};
  if (isLoading) {
    // Hiển thị hiệu ứng loading
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 items-center bg-white px-6  pt-10`}>
      <View style={tw`w-full bg-gray-100 p-4 rounded-lg shadow-md`}>
        <Text style={tw`text-lg text-black-500`}></Text>
        <TextInput
          placeholder="Email"
          value={userProfile?.email || ""}
          keyboardType="email-address"
          style={tw`w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 mt-2`}
          editable={false}
        />

        <Controller
          control={control}
          rules={{
            required: "Mật khẩu cũ không được để trống.",
          }}
          render={({ field: { onChange, value } }) => (
            <View
              style={tw`w-full h-12 flex-row items-center border border-gray-300 rounded-lg px-4 mb-4 mt-2`}
            >
              <TextInput
                placeholder="Mật khẩu cũ"
                value={value}
                secureTextEntry={!oldpasswordVisible}
                style={tw`flex-1 text-base`}
                onFocus={handleFocus}
                onChangeText={(text) => {
                  clearErrors(["oldPassword", "api"]);
                  onChange(text);
                }}
              />
              <TouchableOpacity
                onPress={() => setOldPasswordVisible(!oldpasswordVisible)}
              >
                <Feather
                  name={oldpasswordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          )}
          name="oldPassword"
          defaultValue=""
        />
        {isSubmitted && errors.oldPassword && (
          <Text style={tw`text-red-500 text-xs`}>
            {errors.oldPassword.message}
          </Text>
        )}

        <Controller
          control={control}
          rules={{
            required: "Mật khẩu không được để trống",
            minLength: {
              value: 8,
              message: "Mật khẩu phải có ít nhất 8 ký tự.",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View
              style={tw`w-full h-12 flex-row items-center border border-gray-300 rounded-lg px-4 mb-4 mt-2`}
            >
              <TextInput
                placeholder="Mật khẩu mới"
                value={value}
                secureTextEntry={!passwordVisible}
                style={tw`flex-1 text-base`}
                onFocus={handleFocus}
                onChangeText={(text) => {
                  clearErrors(["password", "api"]);
                  onChange(text);
                }}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Feather
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          )}
          name="password"
          defaultValue=""
        />

        <Controller
          control={control}
          rules={{
            required: "Xác nhận mật khẩu không được để trống.",
            minLength: {
              value: 8,
              message: "Mật khẩu phải có ít nhất 8 ký tự.",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View
              style={tw`w-full h-12 flex-row items-center border border-gray-300 rounded-lg px-4 mb-4 mt-2`}
            >
              <TextInput
                placeholder="Xác nhận mật khẩu"
                value={value}
                secureTextEntry={!confirmPasswordVisible}
                style={tw`flex-1 text-base`}
                onFocus={handleFocus}
                onChangeText={(text) => {
                  clearErrors(["confirmPassword", "api"]);
                  onChange(text);
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                <Feather
                  name={confirmPasswordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          )}
          name="confirmPassword"
          defaultValue=""
        />

        {isSubmitted && errors.password && (
          <Text style={tw`text-red-500 text-xs`}>
            {errors.password.message}
          </Text>
        )}

        <TouchableOpacity
          style={tw`mt-4 w-full bg-blue-600 py-3 rounded-lg`}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={tw`text-white text-center font-semibold`}>
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4F46E5" />
        ) : (
          <TouchableOpacity
            style={tw`mt-4 w-full bg-blue-600 py-3 rounded-lg`}
            onPress={handleSubmit(handleSave)}
          >
            <Text style={tw`text-white text-center font-semibold`}>
              Đổi mật khẩu
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
export default ChangePassword;
