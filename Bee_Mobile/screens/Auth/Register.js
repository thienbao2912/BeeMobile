import React, { useState } from "react";
import { Text, View, TextInput, Image, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import tailwind from "twrnc";
import { useForm, Controller } from "react-hook-form";
import { registerUser } from "../../services/Auth";

function Register({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const piggyBank = require("../../assets/images/piggy-bank.png");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    setError,
    clearErrors,
    reset,
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        message: "Mật khẩu và xác nhận mật khẩu không khớp.",
      });
      return;
    }

    try {
      const response = await registerUser({
        email: data.email,
        password: data.password,
        name: data.username,
      });
      if (response.success) {
        reset();
        navigation.navigate("Login");
      } else {
        setError("api", { message: response.message || "Đăng ký thất bại." });
      }
    } catch (err) {
      setError("api", { message: "Đã xảy ra lỗi, vui lòng thử lại." });
    }
  };

  const handleFocus = () => {
    clearErrors();
  };

  return (
    <View style={tailwind`flex-1 bg-purple-200 items-center justify-center`}>
      <Image source={piggyBank} style={tailwind`w-40 h-40 mb-4`} />
      <Text style={tailwind`text-2xl font-bold text-purple-800 mb-4`}>
        BEEMONEY
      </Text>
      <Text style={tailwind`text-2xl font-bold text-dark-780 mb-4`}>
        Đăng ký
      </Text>

      <View style={tailwind`w-80 mb-2`}>
        <Controller
          control={control}
          rules={{
            required: "Tên đăng nhập không được để trống.",
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Tên đăng nhập..."
              style={tailwind`w-full h-12 px-4 bg-white border border-gray-300 rounded-lg`}
              value={value}
              onFocus={handleFocus}
              onChangeText={(text) => {
                clearErrors(["username", "api"]);
                onChange(text);
              }}
            />
          )}
          name="username"
          defaultValue=""
        />
        {isSubmitted && errors.username && (
          <Text style={tailwind`text-red-500 text-xs`}>
            {errors.username.message}
          </Text>
        )}
      </View>

      <View style={tailwind`w-80 mb-2`}>
        <Controller
          control={control}
          rules={{
            required: "Email không được để trống.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email không hợp lệ.",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Email..."
              style={tailwind`w-full h-12 px-4 bg-white border border-gray-300 rounded-lg`}
              value={value}
              onFocus={handleFocus}
              onChangeText={(text) => {
                clearErrors(["email", "api"]);
                onChange(text);
              }}
            />
          )}
          name="email"
          defaultValue=""
        />
        {isSubmitted && errors.email && (
          <Text style={tailwind`text-red-500 text-xs`}>
            {errors.email.message}
          </Text>
        )}
      </View>

      <View style={tailwind`w-80 mb-2`}>
        <Controller
          control={control}
          rules={{
            required: "Mật khẩu không được để trống.",
            minLength: {
              value: 8,
              message: "Mật khẩu phải có ít nhất 8 ký tự.",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View
              style={tailwind`w-full h-12 px-4 bg-white border border-gray-300 rounded-lg flex-row items-center`}
            >
              <TextInput
                placeholder="Mật khẩu..."
                secureTextEntry={!passwordVisible}
                style={tailwind`flex-1`}
                value={value}
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
        {isSubmitted && errors.password && (
          <Text style={tailwind`text-red-500 text-xs`}>
            {errors.password.message}
          </Text>
        )}
      </View>

      <View style={tailwind`w-80 mb-4`}>
        <Controller
          control={control}
          rules={{
            required: "Xác nhận mật khẩu không được để trống.",
          }}
          render={({ field: { onChange, value } }) => (
            <View
              style={tailwind`w-full h-12 px-4 bg-white border border-gray-300 rounded-lg flex-row items-center`}
            >
              <TextInput
                placeholder="Xác nhận mật khẩu..."
                secureTextEntry={!confirmPasswordVisible}
                style={tailwind`flex-1`}
                value={value}
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
        {isSubmitted && errors.confirmPassword && (
          <Text style={tailwind`text-red-500 text-xs`}>
            {errors.confirmPassword.message}
          </Text>
        )}
      </View>

      {isSubmitted && errors.api && (
        <Text style={tailwind`text-red-500 text-xs mb-2`}>
          {errors.api.message}
        </Text>
      )}

      <View style={tailwind`flex-row justify-between w-80 mb-4`}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={tailwind`text-purple-700`}>Bạn đã có tài khoản?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={tailwind`w-80 h-12 bg-purple-700 rounded-lg items-center justify-center`}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={tailwind`text-white text-lg`}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Register;
