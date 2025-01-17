import React from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";

const PremiumScreen = () => {
  return (
    <View style={tw`flex-1 items-center bg-white`}>
      {/* Header Logo and Title */}
      <View style={tw`items-center mt-10`}>
        {/* Logo */}
        <Image
          source={require("../../assets/images/piggy-bank.png")} // Đường dẫn đến logo của bạn
          style={tw`w-20 h-20 mb-3`} // Kích thước logo và khoảng cách
          resizeMode="contain"
        />
        {/* Title */}
        <Text style={tw`text-2xl font-bold text-black`}>BeeMoney Premium</Text>
      </View>

      {/* Two Columns for Purchase Options */}
      <View style={tw`flex-row justify-center mt-10`}>
        {/* Option 1 */}
        <View style={tw`bg-blue-500 rounded-lg p-5 m-2 w-40 flex justify-between`}>
          <View>
            <Text style={tw`text-lg font-bold text-white text-center`}>Gói 1 tháng</Text>
            <Text style={tw`text-sm text-white text-center mt-2`}>29.000đ/tháng</Text>
            <Text style={[tw`text-xs text-white mt-4`, { textAlign: "justify" }]}>
              - Quản lý chi tiêu hiệu quả{"\n"}
              - Không quảng cáo{"\n"}
              - Hỗ trợ trực tuyến 24/7
            </Text>
          </View>
          <TouchableOpacity
            style={tw`bg-white rounded-lg mt-4 py-2`}
            onPress={() => alert("Bạn đã chọn gói 1 tháng!")}
          >
            <Text style={tw`text-blue-500 font-bold text-center`}>Mua ngay</Text>
          </TouchableOpacity>
        </View>

        {/* Option 2 */}
        <View style={tw`bg-green-500 rounded-lg p-5 m-2 w-40 flex justify-between`}>
          <View>
            <Text style={tw`text-lg font-bold text-white text-center`}>Gói 6 tháng</Text>
            <Text style={tw`text-sm text-white text-center mt-2`}>139.000đ/6 tháng</Text>
            <Text style={[tw`text-xs text-white mt-4`, { textAlign: "justify" }]}>
              - Quản lý chi tiêu hiệu quả{"\n"}
              - Không quảng cáo{"\n"}
              - Hỗ trợ trực tuyến 24/7{"\n"}
              - Ưu đãi độc quyền
            </Text>
          </View>
          <TouchableOpacity
            style={tw`bg-white rounded-lg mt-4 py-2`}
            onPress={() => alert("Bạn đã chọn gói 6 tháng!")}
          >
            <Text style={tw`text-green-500 font-bold text-center`}>Mua ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PremiumScreen;
