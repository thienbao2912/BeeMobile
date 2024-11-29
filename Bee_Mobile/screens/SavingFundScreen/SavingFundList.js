import React, { useState } from "react";
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchAllSavingFund } from "../../services/SavingsFundService";
import tw from "twrnc";
import AcceptInvite from "./AcceptInvite";
export default function SavingFundList({ navigation }) {
    const [savingsFunds, setSavingsFunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInviteModalVisible, setInviteModalVisible] = useState(false);
    const loadSavingsFunds = async () => {
        try {
            setLoading(true);
            const data = await fetchAllSavingFund();
            setSavingsFunds(data);
        } catch (error) {
            console.error("Error loading savings funds", error);
        } finally {
            setLoading(false);
        }
    };
    useFocusEffect(
        React.useCallback(() => {
            loadSavingsFunds();
        }, [])
    );
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const onAcceptInviteSuccess = () => {
        loadSavingsFunds();
    };
    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("SavingFundDetail", { fundId: item._id })}
            style={tw`bg-white shadow-md rounded-lg mb-4 flex-row items-center p-4`}
        >
            {item.categoryId.image && (
                <Image
                    source={{ uri: item.categoryId.image }}
                    style={tw`h-15 w-15 rounded-lg mr-4`}
                />
            )}
            <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>{item.name}</Text>
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                    Mục tiêu:{" "}
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(item.targetAmount)}
                </Text>
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                    Đã tiết kiệm:{" "}
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(item.currentAmount)}
                </Text>
                <Text style={tw`text-sm text-gray-500`}>
                    Thời gian: {formatDate(item.startDate)} - {formatDate(item.endDate)}
                </Text>
            </View>
        </TouchableOpacity>
    );
    return (
        <View style={tw`flex-1 bg-gray-100`}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={tw`mt-4`} />
            ) : (
                <FlatList
                    data={savingsFunds}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id.toString()}
                    contentContainerStyle={tw`p-4`}
                />
            )}
            {/* Nút dấu cộng cố định ở góc trên bên phải */}
            <TouchableOpacity
                onPress={() => navigation.navigate("SavingFundAdd")} // Điều hướng đến màn hình thêm mới
                style={[
                    tw`bg-indigo-500 rounded-full shadow-md flex items-center justify-center`,
                    {
                        position: "absolute",
                        top: 20, // Khoảng cách từ cạnh trên màn hìnhright: 20, // Khoảng cách từ cạnh phải màn hình
                        height: 50,
                        width: 50,
                    },
                ]}
            >
                <Text style={tw`text-white text-2xl font-semibold`}>+</Text>
            </TouchableOpacity>
            {/* Nút "Tham gia quỹ" */}
            <View style={tw`p-2`}>
                <TouchableOpacity
                    onPress={() => setInviteModalVisible(true)}
                    style={tw`bg-indigo-500 rounded-lg p-2 shadow-md`}
                >
                    <Text style={tw`text-white text-center text-lg font-semibold`}>Tham gia quỹ</Text>
                </TouchableOpacity>
            </View>
            {isInviteModalVisible && (
                <AcceptInvite
                    isVisible={isInviteModalVisible}
                    onClose={() => setInviteModalVisible(false)}
                    onInviteAccepted={() => {
                        setInviteModalVisible(false);
                        onAcceptInviteSuccess();
                    }}
                />
            )}
        </View>
    );
}