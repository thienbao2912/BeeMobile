import React, { useState } from "react";
import { View, TextInput, Alert, Modal, Text, TouchableOpacity } from "react-native";
import { acceptInvite } from "../../services/SavingsFundService"; // Đảm bảo đường dẫn đúng
import tw from "twrnc";
export default function AcceptInvite({ isVisible, onClose, onInviteAccepted }) {
const [code, setCode] = useState('');
const [loading, setLoading] = useState(false);
const handleAccept = async () => {
if (!code) {
Alert.alert('Error', 'Please enter the invite code.');
return;
}
setLoading(true);
try {
const result = await acceptInvite(code); // Gọi service chấp nhận lời mời
Alert.alert('Success', result.message || 'You have successfully joined the savings fund!');
onInviteAccepted(); // Đóng modal sau khi thành công và gọi callback để làm mới danh sách
} catch (error) {
Alert.alert('Error', error.message || 'There was an issue accepting the invite.');
} finally {
setLoading(false);
}
};
return (
<Modal
visible={isVisible}
onRequestClose={onClose}
transparent={true}
animationType="slide"
>
<View style={tw`flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]`}>
<View style={tw`w-80 p-6 bg-white rounded-2xl shadow-lg`}>
<Text style={tw`text-lg font-bold text-center text-gray-800 mb-4`}>
Tham gia quỹ tiết kiệm
</Text>
<TextInput
value={code}
onChangeText={setCode}
placeholder="Nhập mã tham gia"
placeholderTextColor="#A0AEC0"
style={tw`border border-gray-300 p-4 rounded-lg text-gray-800 mb-6`}
/>
<TouchableOpacity
onPress={handleAccept}
disabled={loading}
style={tw`bg-indigo-600 p-3 rounded-full mb-4 ${loading ? 'opacity-50' : ''}`}
>
<Text style={tw`text-white text-center text-base font-semibold`}>
{loading ? "Đang thực hiện..." : "Xác nhận"}
</Text>
</TouchableOpacity>
<TouchableOpacity
onPress={onClose}
style={tw`bg-gray-400 p-3 rounded-full`}
>
<Text style={tw`text-white text-center text-base font-semibold`}>
Hủy
</Text>
</TouchableOpacity>
</View>
</View>
</Modal>
);
}