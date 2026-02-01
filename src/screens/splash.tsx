import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Animated, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import BootSplash from 'react-native-bootsplash';
import { CustomNavigationProp } from '../types/common';
import { colors, typography, spacing } from '../theme';

const SplashScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();

    const [bypassLogin, setBypassLogin] = useState<boolean>(false);
    const [animationEnded, setAnimationEnded] = useState<boolean>(false);

    const logoScale = useRef(new Animated.Value(0.2)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const containerOpacity = useRef(new Animated.Value(1)).current;

    const getToken = useCallback(async () => {
        try {
            const token = await EncryptedStorage.getItem('jwt-token');
            console.log('SplashScreen: Token fetched', !!token);
            if (token) {
                setBypassLogin(true);
            }
        } catch (e) {
            console.error('SplashScreen: Token fetch error', e);
        }
    }, []);

    const startAnimation = useCallback(() => {
        console.log('SplashScreen: Starting Animation');
        // Fade in logo
        Animated.sequence([
            Animated.parallel([
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 400, // Faster
                    useNativeDriver: true,
                }),
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 20,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]),
            // Fade in tagline
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 300, // Faster
                useNativeDriver: true,
            }),
            // Wait
            Animated.delay(800), // Shorter wait
            // Fade out everything
            Animated.timing(containerOpacity, {
                toValue: 0,
                duration: 400, // Faster
                useNativeDriver: true,
            }),
        ]).start(() => {
            console.log('SplashScreen: Animation Ended');
            setAnimationEnded(true);
        });
    }, [containerOpacity, logoOpacity, logoScale, textOpacity]);

    useEffect(() => {
        console.log('SplashScreen: Initialized');
        BootSplash.hide({ fade: true });
        getToken();
        startAnimation();
    }, [getToken, startAnimation]);

    useEffect(() => {
        if (animationEnded) {
            console.log('SplashScreen: Navigation trigger', { bypassLogin });
            if (bypassLogin) {
                navigation.replace('SupplierDashboard');
            } else {
                navigation.replace('Login');
            }
        }
    }, [animationEnded, bypassLogin, navigation]);

    return (
        <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

            <View style={styles.content}>
                <Animated.Image
                    source={require('../../assets/images/Metics-blue.png')}
                    style={[
                        styles.logo,
                        {
                            opacity: logoOpacity,
                            transform: [{ scale: logoScale }],
                        },
                    ]}
                    resizeMode="contain"
                />

                <Animated.View style={[styles.taglineContainer, { opacity: textOpacity }]}>
                    <Text style={styles.tagline}>Procurement Excellence</Text>
                </Animated.View>
            </View>

            <Animated.View style={[styles.footer, { opacity: textOpacity }]}>
                <View style={styles.footerLine} />
                <Text style={styles.footerText}>Powered by Metics</Text>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral.surface.default,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 180,
        height: 70,
    },
    taglineContainer: {
        marginTop: spacing.xl,
    },
    tagline: {
        ...typography.styles.h4,
        color: colors.neutral.text.secondary,
        letterSpacing: 1.5,
        fontWeight: '500',
    },
    footer: {
        paddingBottom: spacing['3xl'],
        alignItems: 'center',
    },
    footerLine: {
        width: 32,
        height: 3,
        backgroundColor: colors.primary[500],
        marginBottom: spacing.md,
        borderRadius: 2,
    },
    footerText: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
    },
});

export default SplashScreen;
