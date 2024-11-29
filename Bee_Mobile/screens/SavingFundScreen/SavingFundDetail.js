import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, Modal, TextInput, Button, TouchableOpacity, Image, ScrollView } from "react-native";
import { fetchSavingFundById, addTransaction, sendInvitation } from "../../services/SavingsFundService"; // Import thêm sendInvitation
import tw from "twrnc";
import FundMembers from "./FundMembers";
import FundTransactions from "./FundTransactions";
export default function SavingFundDetail({ route }) {
    const { fundId } = route.params;
    const [fundDetail, setFundDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [friendEmail, setFriendEmail] = useState("");
    const loadFundDetail = async () => {
        try {
            setLoading(true);
            const data = await fetchSavingFundById(fundId);
            console.log(data);
            setFundDetail(data?.data || {});
        } catch (error) {
            console.error("Error loading fund detail", error);
            Alert.alert("Error", "There was an issue loading fund details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    const handleAddTransaction = async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            return Alert.alert("Error", "Please enter a valid amount.");
        }
        try {
            const transactionData = {
                amount: parseFloat(amount),
                note,
            };
            await addTransaction(fundId, transactionData);
            Alert.alert("Success", "Transaction added successfully!");
            setShowModal(false);
            setAmount("");
            setNote("");
            loadFundDetail();
        } catch (error) {
            console.error("Error adding transaction", error);
            Alert.alert("Error", error.message || "Failed to add transaction. Please try again.");
        }
    };
    const handleSendInvite = async () => {
        if (!friendEmail || !/\S+@\S+\.\S+/.test(friendEmail)) {
            return Alert.alert("Error", "Please enter a valid email address.");
        }
        try {
            await sendInvitation(fundId, friendEmail);
            Alert.alert("Success", "Invitation sent successfully!");
            setShowInviteModal(false);
            setFriendEmail("");
        } catch (error) {
            console.error("Error sending invitation", error);
            Alert.alert("Error", "Failed to send invitation. Please try again.");
        }
    };
    useEffect(() => {
        loadFundDetail();
    }, [fundId]);
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={tw`mt-4`} />;
    }
    if (!fundDetail) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-lg text-red-500`}>Fund not found</Text>
            </View>
        );
    }
    return (
        <ScrollView>
            <View style={tw`flex-1 p-4`}><View style={tw`bg-white p-6 shadow-lg rounded-lg`}>
                {/* Hàng đầu: Hình ảnh và tên quỹ */}
                <View style={tw`flex-row items-center mb-6`}>
                    <View style={tw`mr-4`}>
                        {fundDetail.categoryId.image && (
                            <Image
                                source={{ uri: fundDetail.categoryId.image }}
                                style={tw`h-20 w-20 rounded-lg`}
                            />
                        )}
                        <Text style={tw`text-sm text-center text-gray-700 mt-2`}>
                            {fundDetail.categoryId.name || 'No Category'}
                        </Text>
                    </View>
                    <Text style={tw`text-2xl font-bold text-blue-700 flex-1`}>
                        {fundDetail.name}
                    </Text>
                </View>
                <View style={tw`pt-4`}>
                    <View style={tw`flex-row items-center mb-2`}>
                        <Text style={tw`text-lg text-indigo-700 font-medium flex-1`}>
                            Mục tiêu:
                        </Text>
                        <Text style={tw`font-bold text-indigo-700`}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fundDetail.targetAmount)}
                        </Text>
                    </View>
                    <View style={tw`flex-row items-center mb-2`}>
                        <Text style={tw`text-lg text-green-600 font-medium flex-1`}>
                            Đã tiết kiệm:
                        </Text>
                        <Text style={tw`font-bold text-green-600`}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fundDetail.currentAmount)}
                        </Text>
                    </View>
                    <View style={tw`flex-row items-center mb-2`}>
                        <Text style={tw`text-sm text-gray-500 flex-1`}>
                            Thời gian:
                        </Text>
                        <Text style={tw`text-sm text-gray-500`}>
                            {formatDate(fundDetail.startDate)} - {formatDate(fundDetail.endDate)}
                        </Text>
                    </View>
                </View>
            </View>
                <View style={tw`flex-row mt-4`}>
                    <TouchableOpacity
                        style={tw`bg-indigo-500 p-2 rounded flex-1 mr-2`}
                        onPress={() => setShowModal(true)}
                    >
                        <Text style={tw`text-white text-center font-bold`}>Nạp Tiền</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={tw`bg-green-400 p-2 rounded flex-1`}
                        onPress={() => setShowInviteModal(true)}
                    >
                        <Text style={tw`text-white text-center font-bold`}>Mời Bạn Tham Gia</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    transparent={true}
                    visible={showModal}
                    animationType="slide"
                    onRequestClose={() => setShowModal(false)}
                >
                    <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                        <View style={tw`bg-white p-6 rounded w-4/5`}>
                            <Text style={tw`text-lg font-bold mb-4`}>Nạp Tiền</Text>
                            <TextInput
                                style={tw`border p-2 mb-4 rounded`}
                                placeholder="Số tiền"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                            <TextInput
                                style={tw`border p-2 mb-4 rounded`}
                                placeholder="Ghi chú"
                                value={note}
                                onChangeText={setNote}
                            />
                            <View style={tw`flex-row justify-between`}>
                                <Button title="Hủy" color="red" onPress={() => setShowModal(false)} />
                                <Button title="Nạp tiền" onPress={handleAddTransaction} />
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    transparent={true}
                    visible={showInviteModal}
                    animationType="slide"
                    onRequestClose={() => setShowInviteModal(false)}
                >
                    <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                        <View style={tw`bg-white p-6 rounded w-4/5`}><Text style={tw`text-lg font-bold mb-4`}>Mời Bạn Tham Gia</Text>
                            <TextInput
                                style={tw`border p-2 mb-4 rounded`}
                                placeholder="Nhập Email của bạn"
                                value={friendEmail}
                                onChangeText={setFriendEmail}
                            />
                            <View style={tw`flex-row justify-between`}>
                                <Button title="Hủy" color="red" onPress={() => setShowInviteModal(false)} />
                                <Button title="Gửi Lời Mời" onPress={handleSendInvite} />
                            </View>
                        </View>
                    </View>
                </Modal>
                <FundMembers fundId={fundId} />
                <FundTransactions fundId={fundId} />
            </View>
        </ScrollView>
    );
}