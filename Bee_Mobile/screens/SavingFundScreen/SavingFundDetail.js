import React, { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator, Alert, Modal, TextInput, Button, TouchableOpacity, Image, ScrollView, Animated } from "react-native";
import { fetchSavingFundById, addTransaction, sendInvitation } from "../../services/SavingsFundService"; // Import thêm sendInvitation
import tw from "twrnc";
import FundMembers from "./FundMembers";
import FundTransactions from "./FundTransactions";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { deleteSavingsFund } from "../../services/SavingsFundService";
export default function SavingFundDetail({ route, navigation }) {
  const { fundId } = route.params;
  const [fundDetail, setFundDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (fundId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn chắc chắn muốn xóa?",
      [
        {
          text: "Hủy",
          onPress: () => setDeleting(null),
          style: "cancel",
        },
        {
          text: "Xác nhận", onPress: async () => {
            try {
              setDeleting(fundId);
              await deleteSavingsFund(fundId);
              navigation.navigate('SavingFundList', { refresh: true });
            } catch (error) {
              Alert.alert(
                "Không có quyền",
                "Bạn không có quyền xóa quỹ tiết kiệm này.",
                [{ text: "Đóng" }]
            );
            } finally {
              setDeleting(null);
            }
          }
        },
      ],
      { cancelable: false }
    );
  };
   const handleEdit = () => {
      navigation.navigate('SavingFundEdit', { fundId: fundDetail._id });
  };

  const loadFundDetail = async () => {
    try {
      setLoading(true);
      const data = await fetchSavingFundById(fundId);
      console.log(data);
      setFundDetail(data?.data || {});
    } catch (error) {
      console.error("Error loading fund detail", error);
      // Alert.alert("Error", "There was an issue loading fund details. Please try again later.");
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
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    try {
      const transactionData = {
amount: numericAmount,
        note,
      };
      setSending(true);
      await addTransaction(fundId, transactionData);
      Alert.alert("Nạp tiền thành công");
      setShowModal(false);
      setAmount("");
      setNote("");
      loadFundDetail();
    } catch (error) {
      console.error("Error adding transaction", error);
    } finally {
      setSending(false);
    }
  };
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: fundDetail?.status || 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [fundDetail?.status]);


  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const progressColor = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [
      `hsl(${Math.min(fundDetail?.status || 0, 100) * 1.5}, 100%, ${Math.max(50 - (fundDetail?.status || 0) * 0.1, 20)}%)`,
      `hsl(${Math.min(fundDetail?.status || 0, 100) * 1.5}, 100%, ${Math.max(50 - (fundDetail?.status || 0) * 0.1, 20)}%)`,
    ], 
  });

  const handleSendInvite = async () => {
    if (!friendEmail) {
      return Alert.alert("Nhập email để mời bạn!");
    }
    if (!/\S+@\S+\.\S+/.test(friendEmail)) {
      return Alert.alert("Nhập đúng định dạng email!");
    }
    setSending(true);
    try {
      await sendInvitation(fundId, friendEmail);
      Alert.alert("Gửi email thành công");
      setShowInviteModal(false);
      setFriendEmail("");
    } catch (error) {
      console.error("Error sending invitation", error);
    } finally {
      setSending(false);
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
        <Text style={tw`text-lg text-red-500`}>Quỹ tiết kiệm không tồn tại</Text>
      </View>
    );
  }
  return (
    <ScrollView>
      <View style={tw`flex-1 p-4`}>
        <View style={tw`bg-white p-6 shadow-lg rounded-lg`}>
          <View style={tw`flex-row items-center mb-4`}>
            <View style={tw`mr-4`}>
              {fundDetail?.categoryId?.image ? (
                <Image
                  source={{ uri: fundDetail.categoryId.image }}
                  style={tw`h-20 w-20 rounded-lg`}
                />
              ) : (
                <View style={tw`h-20 w-20 bg-gray-200 rounded-lg`} />
              )}
              <Text style={tw`text-sm text-center text-gray-700 mt-2`}>
                {fundDetail?.categoryId?.name || "No Category"}
              </Text>
            </View>
            <Text style={tw`text-2xl font-bold text-gray-500 flex-1`}>
              {fundDetail?.name || "No Name"}
            </Text>
          </View>
          <Text style={tw`text-sm text-gray-400 font-medium flex-1`}>
{fundDetail?.status != null ? `${fundDetail.status}%` : "No Status"}
          </Text>
          <View style={tw`w-full h-2 bg-gray-100 mt-2`}>
          <Text style={tw`text-sm text-gray-400 font-medium flex-1`}>
            {fundDetail?.status != null ? `${fundDetail.status}%` : "No Status"}
          </Text>
            <Animated.View
              style={{
                width: progressWidth,
                height: '100%',
                backgroundColor: progressColor,
              }}
            />
          </View>
          <View style={tw`pt-4`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Text style={tw`text-sm text-gray-500 font-medium flex-1`}>
                Mục tiêu:
              </Text>
              <Text style={tw`font-bold text-indigo-700`}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(fundDetail?.targetAmount || 0)}
              </Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Text style={tw`text-sm text-gray-500 font-medium flex-1`}>
                Đã tiết kiệm:
              </Text>
              <Text style={tw`font-bold text-green-600`}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(fundDetail?.currentAmount || 0)}
              </Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <Text style={tw`text-sm text-gray-500 font-medium flex-1`}>
                Thời gian:
              </Text>
              <Text style={tw`text-sm text-gray-500`}>
                {formatDate(fundDetail?.startDate) || "Không có"} -{" "}
                {formatDate(fundDetail?.endDate) || "Không có"}
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
          onRequestClose={() => setShowModal(false)}
        >
          <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
            <View style={tw`bg-white p-6 rounded-2xl w-4/5 shadow-lg`}>
              <Text style={tw`text-xl font-bold text-gray-700 mb-6 text-center`}>
                Nạp Tiền
              </Text>
              <TextInput
style={tw`border border-gray-300 p-3 rounded-lg text-lg text-gray-800 mb-4`}
                placeholder="Số tiền"
                keyboardType="numeric"
                value={amount}
                onChangeText={(input) => {
                  const numericValue = input.replace(/\D/g, "");
                  const formattedValue = numericValue.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  );
                  setAmount(formattedValue);
                }}
                autoFocus
              />
              <TextInput
                style={tw`border border-gray-300 p-3 rounded-lg text-lg text-gray-800 mb-6`}
                placeholder="Ghi chú"
                value={note}
                onChangeText={setNote}
              />
              <View style={tw`flex-row justify-between items-center mt-4`}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={tw`flex-1 rounded-full mr-2`}
                >
                  <Text style={tw`text-indigo-700 text-center text-lg font-semibold`}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddTransaction}
                  disabled={sending}
                  style={tw`flex-1 bg-indigo-600 py-2 rounded-full ml-2 ${sending ? "opacity-50" : ""
                    }`}
                >
                  <Text style={tw`text-white text-center text-lg font-semibold`}>
                    {sending ? "Đang nạp..." : "Nạp tiền"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          transparent={true}
          visible={showInviteModal}
          // animationType="slide"
          onRequestClose={() => setShowInviteModal(false)}
        >
          <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
            <View style={tw`bg-white p-6 rounded-2xl w-4/5 shadow-lg`}>
              <Text style={tw`text-xl font-bold text-gray-700 mb-6 text-center`}>
                Mời Bạn Tham Gia
              </Text>
              <TextInput
                style={tw`border border-gray-300 p-3 rounded-lg text-lg text-gray-800 mb-4`}
                placeholder="Nhập email mời bạn"
                value={friendEmail}
                onChangeText={setFriendEmail}
              />
              <View style={tw`flex-row justify-between items-center mt-4`}>
                <TouchableOpacity
                  style={tw`flex-1 rounded-full mr-2`}
                  onPress={() => setShowInviteModal(false)}
                >
                  <Text style={tw`text-indigo-700 text-center text-lg font-semibold`}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSendInvite}
                  disabled={sending}
style={tw`flex-1 bg-indigo-600 py-2 rounded-full ml-2 ${sending ? "opacity-50" : ""
                    }`}
                >
                  <Text style={tw`text-white text-center text-lg font-semibold`}>
                    {sending ? "Đang gửi..." : "Gửi lời mời"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View style={tw`absolute top-3 right-3 flex-row`}>
          <TouchableOpacity style={tw`p-2 bg-white rounded-full shadow-md`}
            onPress={handleEdit}
            >
              <Ionicons name="pencil" size={20} color="#A57EF4" />
            </TouchableOpacity>
          <TouchableOpacity style={tw`p-2 bg-white rounded-full shadow-md ml-3`}
            onPress={() => handleDelete(fundDetail._id)}
          >
            <Ionicons name="trash-outline" size={25} color="#fc8181" />
          </TouchableOpacity>
        </View>
        <FundMembers fundId={fundId} />
        <FundTransactions fundId={fundId} />
      </View>
    </ScrollView>
  );
}