import React, { useState } from "react";
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchAllSavingFund } from "../../services/SavingsFundService";
import tw from "twrnc";
import AcceptInvite from "./AcceptInvite";
import ContentLoader, { Rect } from "react-content-loader/native";

export default function SavingFundList({ navigation }) {
  const [savingsFunds, setSavingsFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalVisible, setInviteModalVisible] = useState(false);

  const loadSavingsFunds = async () => {
    try {
      setLoading(true);
      const data = await fetchAllSavingFund();
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setSavingsFunds(data);
    } catch (error) {
      console.error("Error loading savings funds", error);
    } finally {
      setLoading(false);
    }
  };
  const SkeletonLoader = ({ count = 5 }) => (
    <View style={tw`p-4`}>
      {[...Array(count)].map((_, index) => (
        <View key={index} style={tw`mb-4`}>
          <ContentLoader
            speed={1.5}
            width={"100%"}
            height={100}
            backgroundColor="#e0e0e0"
            foregroundColor="#f5f5f5"
          >
            <Rect x="0" y="10" rx="8" ry="8" width="60" height="60" />
            <Rect x="80" y="10" rx="4" ry="4" width="200" height="17" />
            <Rect x="80" y="35" rx="4" ry="4" width="150" height="17" />
            <Rect x="80" y="55" rx="4" ry="4" width="180" height="17" />
            <Rect x="80" y="75" rx="4" ry="4" width="140" height="17" />
          </ContentLoader>
        </View>
      ))}
    </View>
  );
  
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
   {item.categoryId?.image ? (
  <Image
    source={{ uri: item.categoryId.image }}
    style={tw`h-15 w-15 rounded-lg mr-4`}
  />
) : (
  <View style={tw`h-15 w-15 rounded-lg bg-gray-200 mr-4`} />
)}

      <View style={tw`flex-1`}>
        <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>{item.name || 'Không có'}</Text>
        <Text style={tw`text-sm text-gray-600 mb-1`}>
          Mục tiêu:{" "}
          {new Intl.NumberFormat("vi-VN", {style: "currency",
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
  <SkeletonLoader count={5} />
) : savingsFunds.length === 0 ? (
  <View style={tw`flex-1 bg-gray-100 items-center justify-center`}>
  <Image
    source={require('../../assets/images/cloud.png')}
    style={tw`h-20 w-20 rounded-full mb-4`} 
  />
  <Text style={tw`text-gray-700 text-xl font-semibold text-center`}>
    Chưa có quỹ chung nào
  </Text>
</View>


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
            top: 20, // Khoảng cách từ cạnh trên màn hình
            right: 20, // Khoảng cách từ cạnh phải màn hình
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