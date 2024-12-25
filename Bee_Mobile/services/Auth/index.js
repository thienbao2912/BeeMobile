import request from "../../config/API/index";
import * as SecureStore from 'expo-secure-store';
const API_URL = 'http://192.168.1.15:4000/api';
const saveToken = async (key, value) => {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

const getToken = async (key) => {
    try {
        const value = await SecureStore.getItemAsync(key);
        return value;
    } catch (error) { 
        console.error('Error getting token:', error);
        return null;
    }
};

const registerUser = async ({ email, password, name }) => {
    try {
        const res = await request({
            method: 'POST',
            path: '/api/auth/register',
            data: { email, password, name }
        });
        
        return { success: res.success, message: res.msg };
    } catch (error) {
        console.error('Registration error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const verifyOldPassword = async (userId, oldPassword) => {
    try {
        const res = await request({
            method: 'POST',
            path: '/api/auth/verify-password',
            data: { userId, oldPassword }
        });

        if (res.success) {
            return true;
        } else {
            throw new Error(res.msg);
        }
    } catch (error) {
        console.error('Error verifying old password:', error);
        return false;
    }
};

const validateOldPassword = async (userId, oldPassword) => {
    try {
      const result = await request({
        method: "POST",
        path: "/api/auth/verify-password",
        data: { userId, oldPassword }, // Payload gửi lên server
      });
      console.log("API Response:", result); // Log kết quả trả về từ API
      return result; // Trả về kết quả
    } catch (error) {
      console.error("Error in validateOldPassword:", error);
      return undefined; // Xử lý khi gặp lỗi
    }
    
  };
  
  
  
  
const loginUser = async ({ email, password }) => {
    try {
        const res = await request({
            method: 'POST',
            path: '/api/auth/login',
            data: { email, password }
        });

        if (res?.accessToken) {
           
            await saveToken('token', res.accessToken);
            await saveToken('userId', res._id);
            await saveToken('userName', res.name);
            await saveToken('userRole', res.role);
        } else {
            throw new Error('No access token in response');
        }

        return res;
    } catch (error) {
        console.error('Login error:', error.response || error.message);
        throw error;
    }
};

const sendResetPasswordEmail = async (email) => {
    const res = await request({
        method: "POST",
        path: "/api/auth/forgot-password", 
        data: { email }
    });
    return res;
};

const forgotPassword = async (email) => {
    try {
        const res = await request({
            method: "POST",
            path: "/api/auth/forgot-password",
            data: { email },
        });
        return { success: res.success, message: res.msg };
    } catch (error) {
        console.error('Đặt lại mật khẩu thất bại:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const resetPassword = async ({ password, token }) => {
    try {
        const res = await request({
            method: "POST",
            path: "/api/auth/reset-password",
            data: { password, token },
        });
        return res.data;
    } catch (error) {
        console.error("Reset Password Error:", error.response?.data || error.message);
        throw error.response?.data?.message || "Đã có lỗi xảy ra.";
    }
};

const getAllUsers = async () => {
    try {
        const res = await request({
            method: "GET",
            path: "/api/auth/list"
        });
        return res;
    } catch (error) {
        console.error('Get all users error:', error.response || error.message);
        throw error;
    }
};

const getUserProfile = async () => {
    try {
        const userId = await getToken('userId');
        const token = await SecureStore.getItemAsync('token');
        const response = await fetch(`${API_URL}/auth/get-profile/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`  
            }
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Get profile error:', error.message);
        throw error;
    }
};

// Hàm lấy thông tin một người dùng cụ thể
const getUser = async (id) => {
    try {
        const res = await request({
            method: "GET",
            path: `/api/auth/get-profile/${id}`
        });
        return res;
    } catch (error) {
        console.error('Get profile error:', error.response || error.message);
        throw error;
    }
};
const updateUser = async (name = null, avatar = null) => {
    const userId = await getToken("userId");
    const data = {};
  
    if (name) data.name = name;
    if (avatar) data.avatar = avatar;
  
    try {
      console.log("Sending update request with data:", data);
      const res = await request({
        method: "PUT",
        path: `/api/auth/update/${userId}`,
        data: data,
      });
      console.log("API Response:", res);
      return res; // Trả về phản hồi API
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };
  


//Hàm cập nhật mật khẩu
const updatePasword = async (userId, {  password,  }) => {
    const data = { password  };
    const res = await request({
        method: "PUT",
        path: `/api/auth/update/${userId}`,
        data: data
    });

    return res;
};
// Hàm xóa người dùng
const deleteUser = async (id) => {
    try {
        const res = await request({
            method: "DELETE",
            path: `/api/users/delete/${id}` 
        });
        return res;
    } catch (error) {
        console.error('Delete user error:', error.response || error.message);
        throw error;
    }
};

export {
    getUser,
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getAllUsers,
    getUserProfile,
    updateUser,
    deleteUser,
    verifyOldPassword,
    sendResetPasswordEmail,
    updatePasword,
    validateOldPassword
};
