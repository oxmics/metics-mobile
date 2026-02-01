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
            const token = await EncryptedStorage.getItem('jwt-token');
            config.headers.Authorization = `Token ${token}`;

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
