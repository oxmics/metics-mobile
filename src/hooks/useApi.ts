import axios from "axios";
import { useMemo } from "react";
import EncryptedStorage from "react-native-encrypted-storage/lib/typescript/EncryptedStorage";

export function useApi() {

    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: process.env.BASE_URL,
        });
    
        instance.interceptors.request.use(async (config) => {
            const token = await EncryptedStorage.getItem('jwt-token');
            config.headers['Authorization'] = `Bearer ${token}`;
    
            return config;
        });
    
        instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // navigate to login page
                }
                return Promise.reject(error);
            }
        );
        return instance;
    }, []);

    return api;
}