import React, { useState } from 'react';
import { Text, View, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { forgotPassword } from "../../services/Auth"; // Hàm gửi yêu cầu quên mật khẩu đến backend
import tailwind from 'twrnc';

function ForgetPassword({ navigation }) {
    const [email, setEmail] = useState('');  // State để lưu email người dùng nhập vào
    const piggyBank = require('../../assets/images/piggy-bank.png');

    const handleForgotPassword = async () => {
        try {
            if (!email) {
                Alert.alert("Lỗi", "Vui lòng nhập email!");
                return;
            }
    
            const response = await forgotPassword(email);
    
            if (response.success) {
                Alert.alert("Thành công", "Email đặt lại mật khẩu đã được gửi!");
                navigation.navigate('Login');
            } else {
                Alert.alert("Lỗi", response.error || "Đã xảy ra lỗi, vui lòng thử lại.");
            }
        } catch (error) {
            Alert.alert("Lỗi", "Không tồn tại email hoặc email không hợp lệ.");
        }
    };

    return (
        <View style={tailwind`flex-1 bg-purple-200 items-center justify-center`}>
            <Image 
                source={piggyBank} 
                style={tailwind`w-40 h-40 mb-4`} 
            />
            <Text style={tailwind`text-2xl font-bold text-purple-800 mb-4`}>
                BEEMONEY
            </Text>
            <Text style={tailwind`text-2xl font-bold text-dark-780 mb-4`}>Quên mật khẩu</Text>
            <TextInput
                placeholder='Email...'
                style={tailwind`w-80 h-12 px-4 bg-white border border-gray-300 rounded-lg mb-4`}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail} // Cập nhật state khi người dùng nhập email
            />
            <View style={tailwind`flex-row justify-between w-80 mb-4`}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={tailwind`text-purple-700`}>Bạn đã có tài khoản?</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity 
                style={tailwind`w-80 h-12 bg-purple-700 rounded-lg items-center justify-center`}
                onPress={handleForgotPassword}  // Gọi hàm khi nhấn nút "Gửi"
            >
                <Text style={tailwind`text-white text-lg`}>Gửi</Text>
            </TouchableOpacity>
        </View>
    );
}

export default ForgetPassword;
