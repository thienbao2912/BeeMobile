// utils/helpers.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserId = async () => {
    try {
        return await AsyncStorage.getItem('userId');
    } catch (error) {
        console.error('Lỗi khi lấy userId:', error);
        return null;
    }
};
