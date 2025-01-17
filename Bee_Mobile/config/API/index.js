import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Cấu hình URL API backend của bạn
const API_URL = 'http://10.0.2.2:4000'; 
//192.168.1.7 ip at school
//172.16.27.190 at home
const saveToken = async (token) => {
    try {
        await SecureStore.setItemAsync('token', token);
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

const getToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('token');
        return token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

const request = async (options) => {
    const token = await getToken();
    const url = `${API_URL}${options.path}`;

    const config = {
        method: options.method || 'GET',
        url,
        headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
            ...options.headers,
        },
        data: options.data || {},
        params: options.params || {},
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            await SecureStore.deleteItemAsync('token');
        }
        console.error('API error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export default request;
