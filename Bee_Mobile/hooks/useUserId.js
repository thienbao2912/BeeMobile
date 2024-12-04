import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserId = () => {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                setUserId(storedUserId);
            } catch (error) {
                console.error('Lỗi khi lấy userId:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserId();
    }, []);

    return { userId, loading };
};
