import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { APIResponseEnum, CustomNavigationProp } from '../types/common';
import { CustomInput } from '../components/CustomInput';
import useResetPasswordOtp from '../api/auth/useResetPasswordOtp';
import { Snackbar, Icon } from 'react-native-paper';
import { isValidEmail } from '../utils/helper';
import { colors, spacing, borderRadius, shadows } from '../theme';

const ForgotPasswordScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();

    const [email, setEmail] = useState<string>('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const { mutateAsync: sendOtp, isPending: loading } = useResetPasswordOtp();

    const handleResetPassword = async () => {
        const result = await sendOtp({ email });
        let message = '';
        let userId = '';
        switch (result.status) {
            case APIResponseEnum.FAILED:
                message = 'Sending OTP failed!';
                break;
            case APIResponseEnum.INVALID:
                message = 'Email not found!';
                break;
            default:
                message = 'OTP sent successfully';
                userId = result.user_id;
                break;
        }

        setSnackbarMessage(message);
        setSnackbarVisible(true);
        if (result.status === APIResponseEnum.SUCCESS) {
            navigation.navigate('Otp', { email: email, userId: userId });
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
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Icon source="arrow-left" size={24} color={colors.neutral.text.secondary} />
                    </TouchableOpacity>
                    <Image
                        source={require('../../assets/images/Metics-blue.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Icon and Title */}
                <View style={styles.titleSection}>
                    <View style={styles.iconContainer}>
                        <Icon source="lock-reset" size={32} color={colors.primary[600]} />
                    </View>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                        Enter your email address and we'll send you a verification code to reset your password.
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.formCard}>
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

                    <Button
                        mode="contained"
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        onPress={handleResetPassword}
                        disabled={!isValidEmail(email) || loading}
                        loading={loading}
                    >
                        Send Verification Code
                    </Button>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Remember your password?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Sign In</Text>
                    </TouchableOpacity>
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

export default ForgotPasswordScreen;

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
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
        paddingBottom: spacing['2xl'],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing['2xl'],
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    logo: {
        height: 32,
        width: 100,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: spacing['2xl'],
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary[50], // Light blue bg
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.neutral.text.primary,
        marginBottom: spacing.sm,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: colors.neutral.text.secondary,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: spacing.lg,
    },
    formCard: {
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.md,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
        ...shadows.sm,
    },
    inputGroup: {
        marginBottom: spacing.xl,
    },
    button: {
        backgroundColor: colors.primary[600],
        borderRadius: borderRadius.base,
        height: 44,
        justifyContent: 'center',
    },
    buttonLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.neutral.text.inverse,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing['2xl'],
    },
    footerText: {
        fontSize: 14,
        color: colors.neutral.text.secondary,
        marginRight: spacing.xs,
    },
    loginLink: {
        fontSize: 14,
        color: colors.primary[600],
        fontWeight: '600',
    },
    snackbar: {
        backgroundColor: colors.neutral.text.primary,
    },
});
