import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import ChangePassword from "../screens/ProfileScreen/changePasswordScreen";
import PreniumScreen from "../screens/ProfileScreen/PreniumScreen";

const ProfileStack = createStackNavigator();

// Custom Header Component
const CustomHeader = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.profileText}>Hồ sơ</Text>
      <TouchableOpacity onPress={() => navigation.navigate("PreniumScreen")}>
        <Text style={styles.premiumText}>Premium</Text>
      </TouchableOpacity>
    </View>
  );
};

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerTitle: () => <CustomHeader navigation={navigation} />,
        })}
      />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ title: "Thay đổi mật khẩu" }}
      />
      <ProfileStack.Screen
        name="PreniumScreen"
        component={PreniumScreen}
        options={{
          title: "Prenium",
          headerTitleAlign: "right",
        }}
      />
    </ProfileStack.Navigator>
  );
}

export default ProfileStackScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%", // Chiều rộng header
    paddingHorizontal: 16,
  },
  profileText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000", // Màu đen cho chữ Hồ sơ
  },
  premiumText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E90FF", // Màu xanh làm nổi bật chữ Premium
  },
});
