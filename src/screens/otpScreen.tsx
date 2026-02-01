import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { APIResponseEnum, CustomNavigationProp } from '../types/common';
import { CustomInput } from '../components/CustomInput';
import useVerifyOtp from '../api/auth/useVerifyOtp';
import useResetPasswordOtp from '../api/auth/useResetPasswordOtp';
import { Snackbar, Icon } from 'react-native-paper';
import { colors, spacing, borderRadius, shadows } from '../theme';

type RootStackParamList = {
    OtpScreen: {
        email: string;
        userId: string;
    };
};

const OtpScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'OtpScreen'>>();
    const { email, userId } = route.params;

    const navigation = useNavigation<CustomNavigationProp>();

    const [otp, setOtp] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [hidePass, setHidePass] = useState(true);
    const [hideConfirmPass, setHideConfirmPass] = useState(true);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [countdown, setCountdown] = useState<number>(0);
    const [isResendDisabled, setIsResendDisabled] = useState(false);

    const { mutateAsync: verifyOtp, isPending: verifyOtpLoading } = useVerifyOtp();
    const { mutateAsync: sendOtp, isPending: sendOtpLoading } = useResetPasswordOtp();

    const handleResendOtp = async () => {
        const result = await sendOtp({ email });
        let message = '';

        switch (result.status) {
            case APIResponseEnum.FAILED:
                message = 'Failed to send OTP';
                break;
            case APIResponseEnum.INVALID:
                message = 'Email not found';
                break;
            default:
                message = 'OTP sent successfully';
                break;
        }

        setSnackbarMessage(message);
        setSnackbarVisible(true);
        setIsResendDisabled(true);
        setCountdown(60);
    };

    const handleVerifyOtp = async () => {
        const result = await verifyOtp({ otp: otp, userId: userId, new_password: confirmPassword });
        let message = '';

        switch (result.status) {
            case APIResponseEnum.SUCCESS:
                message = 'Password reset successful!';
                break;
            case APIResponseEnum.INVALID:
                message = 'Invalid OTP';
                break;
            case APIResponseEnum.FAILED:
                message = 'An error occurred. Please try again.';
                break;
        }
        setSnackbarMessage(message);
        setSnackbarVisible(true);
        if (result.status === APIResponseEnum.SUCCESS) {
            navigation.navigate('Login');
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsResendDisabled(false);
        }

        return () => clearInterval(timer);
    }, [countdown]);

    const passwordsMatch = password === confirmPassword && password.length > 0;
    const isValid = otp.length > 0 && passwordsMatch;

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

                {/* Title Section */}
                <View style={styles.titleSection}>
                    <View style={styles.iconContainer}>
                        <Icon source="shield-check-outline" size={32} color={colors.primary[600]} />
                    </View>
                    <Text style={styles.title}>Verify Your Identity</Text>
                    <Text style={styles.subtitle}>
                        Enter the verification code sent to {email}
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.formCard}>
                    {/* OTP Input */}
                    <View style={styles.inputGroup}>
                        <CustomInput
                            label="Verification Code"
                            value={otp}
                            onChange={setOtp}
                            placeholder="Enter 6-digit code"
                            keyboardType="number-pad"
                        />
                        <TouchableOpacity
                            disabled={isResendDisabled || sendOtpLoading}
                            onPress={handleResendOtp}
                            style={styles.resendContainer}
                        >
                            <Text style={[styles.resendText, isResendDisabled && styles.resendDisabled]}>
                                {isResendDisabled ? `Resend code in ${countdown}s` : 'Resend code'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Create new password</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                        <CustomInput
                            label="New Password"
                            value={password}
                            onChange={setPassword}
                            placeholder="Enter new password"
                            secureTextEntry={hidePass}
                            suffix={
                                <TextInput.Icon
                                    icon={hidePass ? 'eye-off' : 'eye'}
                                    // onPress={() => setHidePass(!hidePass)}
                                    onPress={() => setHidePass(!hidePass)}
                                    color={colors.neutral.text.tertiary}
                                />
                            }
                        />
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.inputGroup}>
                        <CustomInput
                            label="Confirm Password"
                            style={confirmPassword.length > 0 && !passwordsMatch ? { borderColor: colors.semantic.error.default } : {}}
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            placeholder="Confirm new password"
                            secureTextEntry={hideConfirmPass}
                            suffix={
                                <TextInput.Icon
                                    icon={hideConfirmPass ? 'eye-off' : 'eye'}
                                    // onPress={() => setHidePass(!hidePass)}
                                    onPress={() => setHideConfirmPass(!hideConfirmPass)}
                                    color={colors.neutral.text.tertiary}
                                />
                            }
                            error={confirmPassword.length > 0 && !passwordsMatch}
                        />
                        {confirmPassword.length > 0 && !passwordsMatch && (
                            <Text style={styles.errorText}>Passwords do not match</Text>
                        )}
                    </View>

                    <Button
                        mode="contained"
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        onPress={handleVerifyOtp}
                        disabled={!isValid || verifyOtpLoading}
                        loading={verifyOtpLoading}
                    >
                        Reset Password
                    </Button>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Remember your password?</Text>
                    <TouchableOpacity onPress={() => navigation.replace('Login')}>
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

export default OtpScreen;

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
        marginBottom: spacing.xl,
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
        marginBottom: spacing.xl,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary[50],
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
        marginBottom: spacing.lg,
    },
    errorText: {
        fontSize: 12,
        color: colors.semantic.error.default,
        marginTop: 4,
        marginLeft: 4,
    },
    resendContainer: {
        alignSelf: 'flex-end',
        marginTop: spacing.sm,
        marginRight: 4,
    },
    resendText: {
        fontSize: 13,
        color: colors.primary[600],
        fontWeight: '500',
    },
    resendDisabled: {
        color: colors.neutral.text.tertiary,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
        marginTop: spacing.sm,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.neutral.border.default,
    },
    dividerText: {
        fontSize: 12,
        color: colors.neutral.text.tertiary,
        marginHorizontal: spacing.md,
        fontWeight: '600',
    },
    button: {
        backgroundColor: colors.primary[600],
        borderRadius: borderRadius.base,
        height: 44,
        justifyContent: 'center',
        marginTop: spacing.md,
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
