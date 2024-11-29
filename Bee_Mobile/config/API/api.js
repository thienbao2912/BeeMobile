import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const BASE_URL = "http://10.0.2.2:4000";

const getToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('token');
        return token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }  
};

const request = async ({
    method = "GET",
    path = "",
    data = {},
    headers = {},
    params = {}
}) => {
    try {
        const token = await getToken();  
        console.log("Sending token: ", token);

        const response = await axios({
            method: method,
            baseURL: BASE_URL,
            url: path,
            data: data,
            params: params,
            headers: {
                'x-auth-token': token ? token : '',
                ...headers,
            },
        });

        return response.data;
    } catch (err) {
        console.error('API Request Error:', err);
        alert(err?.response?.data?.message || 'An error occurred');
        return null;
    }
};

export default request;
