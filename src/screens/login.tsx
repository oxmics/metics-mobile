import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import ToggleButton from '../components/ToggleButton';
import React, { useState } from 'react';
import GradientButton from '../components/GradientButton';
import { Snackbar, TextInput } from 'react-native-paper';
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
    navigation.setOptions({ headerShown: false });

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [active, setActive] = useState<string>('supplier');
    const [hidePass, setHidePass] = useState(true);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const { mutateAsync: login, isPending: loading } = useLogin();

    const handleLogin = async () => {
        console.log('LoginScreen: Attempting login for', email);
        const loginResult = await login({ email, password });
        let message = '';
        console.log('LoginScreen: Result:', loginResult);

        switch (loginResult) {
            case LoginResponseEnum.SUCCESS:
                message = 'Login successful!';
                break;
            case LoginResponseEnum.INVALID:
                message = 'Invalid email or password!';
                break;
            case LoginResponseEnum.FAILED:
                message = 'Login failed';
                break;
            default:
                message = 'Unexpected error occurred!';
                break;
        }
        setSnackbarMessage(message);
        setSnackbarVisible(true);
        if (loginResult === LoginResponseEnum.SUCCESS) {
            console.log('LoginScreen: Navigating to', active === 'buyer' ? 'BuyerDashboard' : 'SupplierDashboard');
            if (active === 'buyer') {
                navigation.replace('BuyerDashboard');
            } else {
                navigation.replace('SupplierDashboard');
            }
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
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Submit Button */}
                    <GradientButton
                        label="Log in"
                        onPress={handleLogin}
                        colors={[colors.primary[600], colors.primary[700]]} // Using brand primary
                        disabled={(!isValidEmail(email) || password.length < 1 || loading)}
                        loading={loading}
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Metics © 2026
                    </Text>
                </View>

                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={Snackbar.DURATION_SHORT}
                    style={styles.snackbar}
                >
                    {snackbarMessage}
                </Snackbar>
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
    snackbar: {
        backgroundColor: colors.neutral.text.primary,
    },
});
