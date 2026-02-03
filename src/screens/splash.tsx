import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import BootSplash from 'react-native-bootsplash';
import { CustomNavigationProp } from '../types/common';
import { colors } from '../theme';

const SplashScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();

    useEffect(() => {
        const init = async () => {
            try {
                // Check auth token and role
                const token = await EncryptedStorage.getItem('jwt-token');
                const role = await EncryptedStorage.getItem('user_role');

                console.log('SplashScreen: Auth check', { hasToken: !!token, role });

                if (token) {
                    if (role === 'buyer') {
                        navigation.replace('BuyerTabs');
                    } else {
                        // Default to supplier if no role or supplier role
                        navigation.replace('SupplierTabs');
                    }
                } else {
                    navigation.replace('Login');
                }
            } catch (error) {
                console.error('SplashScreen: Init error', error);
                navigation.replace('Login');
            } finally {
                // Hide the native boot splash only after we've initiated navigation
                await BootSplash.hide({ fade: true });
            }
        };

        init();
    }, [navigation]);

    // Render a plain background matching the splash screen color while logic runs
    // This prevents a flash of white/different content before navigation
    return <View style={styles.container} />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral.surface.default,
    },
});

export default SplashScreen;
