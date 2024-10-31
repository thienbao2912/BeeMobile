import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Cấu hình URL API backend của bạn
const API_URL = 'http://172.16.18.18:4000';  // Thay địa chỉ IP của backend nếu cần

// Hàm lưu token vào SecureStore
const saveToken = async (token) => {
    try {
        await SecureStore.setItemAsync('token', token);
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

// Hàm lấy token từ SecureStore
const getToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('token');
        return token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

// Hàm request Axios có thêm token vào headers
const request = async (options) => {
    const token = await getToken();  // Lấy token từ SecureStore
    const url = `${API_URL}${options.path}`;  // Gắn URL API

    const config = {
        method: options.method || 'GET',
        url,
        headers: {
            'x-auth-token': token,  // Thêm token vào headers để xác thực
            'Content-Type': 'application/json',
            ...options.headers,
        },
        data: options.data || {},  // Dữ liệu (body) cho POST/PUT request
        params: options.params || {},  // Thêm query params nếu có
    };

    try {
        const response = await axios(config);  // Thực hiện request
        return response.data;  // Trả về data từ API
    } catch (error) {
        // Kiểm tra nếu gặp lỗi 401 thì xóa token (có thể do token không hợp lệ)
        if (error.response && error.response.status === 401) {
            await SecureStore.deleteItemAsync('token');  // Xóa token nếu không hợp lệ
        }
        console.error('API error:', error.response ? error.response.data : error.message);
        throw error;  // Ném lỗi để component xử lý
    }
};

export default request;  // Export để sử dụng ở các component khác
