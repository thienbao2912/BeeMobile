import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../config/API/config';

// const API_URL = 'http://10.0.2.2:4000/api';

export const fetchCategoryImage = async (categoryId) => {
    try {
        const response = await fetch(`${API_URL}/v2/categories/${categoryId}/image`);
        const data = await response.json();
        return data.imageUrl;
    } catch (error) {
        console.error("Error fetching category image:", error);
        return null;
    }
};
