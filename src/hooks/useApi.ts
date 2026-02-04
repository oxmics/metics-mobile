import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useMemo } from 'react';
import { CustomNavigationProp } from '../types/common';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';

export function useApi() {
    const navigation = useNavigation<CustomNavigationProp>();
    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: BASE_URL,
        });

        instance.interceptors.request.use(async (config) => {
            console.log('API Request Interceptor: Starting');
            try {
                const token = await EncryptedStorage.getItem('jwt-token');
                console.log('API Request Interceptor: Token retrieved', token ? 'Yes' : 'No');
                config.headers.Authorization = `Token ${token}`;

                console.log('API Request:', config.method?.toUpperCase(), config.url, JSON.stringify(config.data, null, 2));
            } catch (e) {
                console.log('API Request Log Error:', e);
            }
            console.log('API Request Interceptor: Returning config');
            return config;
        });

        instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    navigation.navigate('Login');
                }

                return Promise.reject(error);
            }
        );
        return instance;
    }, [navigation]);

    return api;
}
