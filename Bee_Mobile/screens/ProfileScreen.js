import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { getUser, updateUser } from "../services/Auth";
// import * as ImagePicker from "expo-image-picker"; // Để chọn ảnh từ thư viện

const logout = async (navigation) => {
  try {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("userId");
    await SecureStore.deleteItemAsync("userName");
    await SecureStore.deleteItemAsync("userRole");
    await SecureStore.deleteItemAsync("userWallet");

    navigation.navigate("Login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Trạng thái sửa thông tin
  const [editedUser, setEditedUser] = useState({}); // Thông tin đã chỉnh sửa
  const [password, setPassword] = useState(""); // Mật khẩu mới

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = await SecureStore.getItemAsync("userId");

        if (userId) {
          const userData = await getUser(userId);
          setUser(userData);
          setEditedUser(userData); // Đặt thông tin đã chỉnh sửa ban đầu
        }
      } catch (error) {
        console.error("Fetch user profile error:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    try {
      // Cập nhật thông tin người dùng và mật khẩu nếu có
      const updatedUser = {
        ...editedUser,
        password: password || user.password, // Chỉ cập nhật mật khẩu nếu người dùng thay đổi
      };
      await updateUser(user.id, updatedUser);
      setUser(updatedUser); // Cập nhật thông tin hiển thị
      setIsEditing(false); // Tắt chế độ sửa
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  const pickImage = async () => {
    // Yêu cầu quyền truy cập thư viện ảnh
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (result.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    // Chọn ảnh từ thư viện
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setEditedUser({ ...editedUser, avatar: pickerResult.uri });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      {user ? (
        <View style={styles.profileContainer}>
          {/* Hiển thị Avatar hoặc ảnh mặc định */}
          <TouchableOpacity onPress={isEditing ? pickImage : null}>
            <Image
              source={
                editedUser.avatar
                  ? { uri: editedUser.avatar }
                  : require("../assets/images/chicken.png")
              }
              style={styles.avatar}
            />
            {isEditing && (
              <Text style={styles.changeAvatarText}>Change Avatar</Text>
            )}
          </TouchableOpacity>

          {/* Hiển thị thông tin người dùng có thể chỉnh sửa */}
          <View style={styles.userInfoContainer}>
            <TextInput
              style={styles.userInfoInput}
              value={editedUser.name}
              editable={isEditing}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, name: text })
              }
            />
            {isEditing && (
              <TextInput
                style={styles.userInfoInput}
                placeholder="New Password"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
              />
            )}
          </View>

          {/* Hiển thị email và ví (không chỉnh sửa) */}
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfoLabel}>Email:</Text>
            <Text style={styles.userInfoText}>{user.email}</Text>

            <Text style={styles.userInfoLabel}>Wallet:</Text>
            <Text style={styles.userInfoText}>{user.wallet}</Text>
          </View>

          {isEditing ? (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <Text>Loading user data...</Text>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => logout(navigation)}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  profileContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 30,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: "#3498db",
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  changeAvatarText: {
    color: "#3498db",
    fontSize: 14,
    marginTop: 10,
  },
  userInfoContainer: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  userInfoInput: {
    fontSize: 18,
    color: "#333",
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#3498db",
    width: "100%",
    textAlign: "center",
    padding: 5,
  },
  userInfoLabel: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  userInfoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  editText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
    shadowColor: "#2ecc71",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    width: "80%",
    backgroundColor: "#FF6347",
    paddingVertical: 14,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6347",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Profile;