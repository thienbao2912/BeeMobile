import request from "../../config/API/index";
import * as SecureStore from 'expo-secure-store';

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
        const res = await request({
            method: "GET",
            path: `/api/auth/get-profile/${userId}`
        });
        return res;
    } catch (error) {
        console.error('Get profile error:', error.response || error.message);
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

// Hàm cập nhật người dùng
const updateUser = async (userId, { email, password, name, avatar, role }) => {
    const data = { email, password, name, avatar, role };
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
    sendResetPasswordEmail
};
