import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import ToggleButton from '../components/ToggleButton';
import React, { useState } from 'react';
import GradientButton from '../components/GradientButton';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation } from '@react-navigation/native';
import { CustomNavigationProp } from '../types/common';
import { CustomInput } from '../components/CustomInput';
import useLogin from '../api/auth/useLogin';
import { LoginResponseEnum } from '../types/auth';
import { isValidEmail } from '../utils/helper';
import { colors, spacing, shadows, borderRadius } from '../theme';

const LoginScreen = () => {
    console.log('LoginScreen: Rendering');
    const navigation = useNavigation<CustomNavigationProp>();
    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [active, setActive] = useState<string>('buyer');
    const [hidePass, setHidePass] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const { mutateAsync: login, isPending: loading } = useLogin();

    const handleLogin = async () => {
        setErrorMessage('');
        setIsLoggingIn(true);

        console.log('LoginScreen: Attempting login for', email);

        try {
            const loginResult = await login({ email, password });
            console.log('LoginScreen: Result:', loginResult);

            if (loginResult === LoginResponseEnum.SUCCESS) {
                // Store the selected role for persistent login
                await EncryptedStorage.setItem('user_role', active);

                console.log('LoginScreen: Navigating to', active === 'buyer' ? 'BuyerTabs' : 'SupplierTabs');

                // Small delay for smooth transition
                setTimeout(() => {
                    if (active === 'buyer') {
                        navigation.replace('BuyerTabs');
                    } else {
                        navigation.replace('SupplierTabs');
                    }
                }, 200);
            } else if (loginResult === LoginResponseEnum.INVALID) {
                setErrorMessage('Invalid email or password. Please try again.');
                setIsLoggingIn(false);
            } else {
                setErrorMessage('Unable to connect. Please check your internet connection.');
                setIsLoggingIn(false);
            }
        } catch (error) {
            console.error('LoginScreen: Unexpected error', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
            setIsLoggingIn(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header with Logo */}
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/images/Metics-blue.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}>Welcome back</Text>
                    <Text style={styles.subtitleText}>Sign in to continue to your dashboard</Text>
                </View>

                {/* Login Form Card */}
                <View style={styles.formCard}>
                    {/* Role Toggle */}
                    <View style={styles.roleSection}>
                        <Text style={styles.labelText}>Login as</Text>
                        <ToggleButton active={active} setActive={setActive} />
                    </View>

                    {/* Error Message */}
                    {errorMessage ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    ) : null}

                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                        <CustomInput
                            label="Email Address"
                            value={email}
                            onChange={setEmail}
                            placeholder="Enter your email"
                            autoCaptalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                        <CustomInput
                            label="Password"
                            value={password}
                            onChange={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry={hidePass ? true : false}
                            suffix={
                                <TextInput.Icon
                                    icon={hidePass ? 'eye-off' : 'eye'}
                                    onPress={() => setHidePass(!hidePass)}
                                    color={colors.neutral.text.tertiary}
                                />
                            }
                        />
                    </View>

                    {/* Forgot Password Link */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ForgotPassword')}
                        style={styles.forgotPasswordContainer}
                        disabled={isLoggingIn}
                    >
                        <Text style={[styles.forgotPasswordText, isLoggingIn && styles.disabledText]}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Submit Button */}
                    <GradientButton
                        label="Log in"
                        onPress={handleLogin}
                        colors={[colors.primary[600], colors.primary[700]]}
                        disabled={(!isValidEmail(email) || password.length < 1 || loading || isLoggingIn)}
                        loading={loading || isLoggingIn}
                    />
                </View>

                {/* Loading Overlay */}
                {isLoggingIn && (
                    <View style={styles.loadingOverlay}>
                        <View style={styles.loadingCard}>
                            <ActivityIndicator size="large" color={colors.primary[500]} />
                            <Text style={styles.loadingText}>Signing you in...</Text>
                        </View>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Metics © 2026
                    </Text>
                </View>


            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
        backgroundColor: colors.neutral.surface.sunken,
    },
    container: {
        flex: 1,
        backgroundColor: colors.neutral.surface.sunken,
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing['3xl'],
        paddingBottom: spacing['2xl'],
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logo: {
        height: 32, // Smaller, cleaner logo
        width: 100,
    },
    welcomeSection: {
        alignItems: 'center',
        marginBottom: spacing['2xl'],
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.neutral.text.primary,
        marginBottom: spacing.xs,
    },
    subtitleText: {
        fontSize: 14,
        color: colors.neutral.text.secondary,
    },
    formCard: {
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.sm,
        padding: spacing.xl,
        ...shadows.sm, // Elevate the form slightly
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    roleSection: {
        marginBottom: spacing.lg,
    },
    labelText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.neutral.text.secondary,
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: spacing.xl,
    },
    forgotPasswordText: {
        fontSize: 13,
        color: colors.primary[500],
        fontWeight: '500',
    },
    footer: {
        marginTop: spacing['2xl'],
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: colors.neutral.text.tertiary,
    },
    errorContainer: {
        backgroundColor: colors.semantic.error.light,
        borderRadius: borderRadius.sm,
        padding: spacing.md,
        marginBottom: spacing.lg,
        borderLeftWidth: 3,
        borderLeftColor: colors.semantic.error.default,
    },
    errorText: {
        fontSize: 13,
        color: colors.semantic.error.dark,
        fontWeight: '500',
    },
    disabledText: {
        opacity: 0.5,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingCard: {
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.lg,
        padding: spacing['2xl'],
        alignItems: 'center',
        ...shadows.lg,
    },
    loadingText: {
        marginTop: spacing.md,
        fontSize: 14,
        color: colors.neutral.text.secondary,
        fontWeight: '500',
    },
});
