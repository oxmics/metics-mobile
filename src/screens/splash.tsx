import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import BootSplash from 'react-native-bootsplash';
import { Text } from 'react-native-paper';
import { CustomNavigationProp } from '../types/common';
import { colors, typography, spacing } from '../theme';

const SplashScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.8));
    const [spinAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        // Start entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous loading spinner animation
        Animated.loop(
            Animated.timing(spinAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            })
        ).start();

        const init = async () => {
            try {
                // Minimum display time to prevent flash
                const minDisplayTime = new Promise(resolve => setTimeout(resolve, 1200));

                // Check auth token and role
                const token = await EncryptedStorage.getItem('jwt-token');
                const role = await EncryptedStorage.getItem('user_role');

                console.log('SplashScreen: Auth check', { hasToken: !!token, role });

                // Wait for minimum display time
                await minDisplayTime;

                // Fade out animation
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0.9,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ]).start(async () => {
                    // Hide native boot splash
                    await BootSplash.hide({ fade: true });

                    // Navigate after fade
                    if (token) {
                        if (role === 'buyer') {
                            navigation.replace('BuyerTabs');
                        } else {
                            navigation.replace('SupplierTabs');
                        }
                    } else {
                        navigation.replace('Login');
                    }
                });
            } catch (error) {
                console.error('SplashScreen: Init error', error);
                await BootSplash.hide({ fade: true });
                navigation.replace('Login');
            }
        };

        init();
    }, [navigation, fadeAnim, scaleAnim, spinAnim]);

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/images/Metics-blue.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Loading Indicator */}
                <View style={styles.loadingContainer}>
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <View style={styles.spinnerRing} />
                    </Animated.View>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral.white,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    logoContainer: {
        marginBottom: spacing['3xl'],
    },
    logo: {
        width: 200,
        height: 80,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: spacing['2xl'],
    },
    spinnerRing: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: colors.primary[500],
        borderTopColor: 'transparent',
        marginBottom: spacing.md,
    },
    loadingText: {
        ...typography.styles.body,
        color: colors.neutral.text.secondary,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
});

export default SplashScreen;
