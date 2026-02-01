import { ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { Button, Icon, TextInput, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CustomNavigationProp } from '../types/common';
import { CustomInput } from '../components/CustomInput';
import useChangePassword from '../api/auth/useChangePassword';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

const EnterNewPasswordScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();

    const { mutateAsync: changePassword, isPending } = useChangePassword();

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [hidePass, setHidePass] = useState(true);
    const [hideNewPass, setHideNewPass] = useState(true);
    const [hideConfirmPass, setHideConfirmPass] = useState(true);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const passwordsMatch = confirmPassword === confirmNewPassword && confirmPassword.length > 0;
    const isValid = password.length > 0 && passwordsMatch;

    const handleChangePassword = () => {
        changePassword({ new_password: confirmNewPassword, old_password: password })
            .then(() => {
                setSnackbarMessage('Password changed successfully!');
                setSnackbarVisible(true);
                setTimeout(() => {
                    navigation.navigate('Login');
                }, 1500);
            })
            .catch(() => {
                setSnackbarMessage('Failed to change password. Please try again.');
                setSnackbarVisible(true);
            });
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
                        <Icon size={24} source="arrow-left" color={colors.neutral.text.secondary} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerLabel}>Account</Text>
                        <Text style={styles.title}>Settings</Text>
                    </View>
                </View>

                {/* Title Section */}
                <View style={styles.titleSection}>
                    <View style={styles.iconContainer}>
                        <Icon source="lock-outline" size={32} color={colors.primary[600]} />
                    </View>
                    <Text style={styles.sectionTitle}>Change Password</Text>
                    <Text style={styles.subtitle}>
                        Enter your current password and create a new one
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.formCard}>
                    {/* Current Password */}
                    <View style={styles.inputGroup}>
                        <CustomInput
                            label="Current Password"
                            value={password}
                            onChange={setPassword}
                            placeholder="Enter current password"
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

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>New password</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* New Password */}
                    <View style={styles.inputGroup}>
                        <CustomInput
                            label="New Password"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            placeholder="Enter new password"
                            secureTextEntry={hideNewPass}
                            suffix={
                                <TextInput.Icon
                                    icon={hideNewPass ? 'eye-off' : 'eye'}
                                    //onPress={() => setHideNewPass(!hideNewPass)}
                                    onPress={() => setHideNewPass(!hideNewPass)}
                                    color={colors.neutral.text.tertiary}
                                />
                            }
                        />
                    </View>

                    {/* Confirm New Password */}
                    <View style={styles.inputGroup}>
                        <CustomInput
                            label="Confirm New Password"
                            style={confirmNewPassword.length > 0 && !passwordsMatch ? { borderColor: colors.semantic.error.default } : {}}
                            value={confirmNewPassword}
                            onChange={setConfirmNewPassword}
                            placeholder="Confirm new password"
                            secureTextEntry={hideConfirmPass}
                            suffix={
                                <TextInput.Icon
                                    icon={hideConfirmPass ? 'eye-off' : 'eye'}
                                    //onPress={() => setHideConfirmPass(!hideConfirmPass)}
                                    onPress={() => setHideConfirmPass(!hideConfirmPass)}
                                    color={colors.neutral.text.tertiary}
                                />
                            }
                            error={confirmNewPassword.length > 0 && !passwordsMatch}
                        />
                        {confirmNewPassword.length > 0 && !passwordsMatch && (
                            <Text style={styles.errorText}>Passwords do not match</Text>
                        )}
                    </View>

                    <Button
                        mode="contained"
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        onPress={handleChangePassword}
                        disabled={!isValid || isPending}
                        loading={isPending}
                    >
                        Update Password
                    </Button>
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

export default EnterNewPasswordScreen;

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
        paddingTop: spacing['2xl'],
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
    headerLabel: {
        ...typography.styles.caption,
        marginBottom: 2,
    },
    title: {
        ...typography.styles.h2,
        color: colors.neutral.text.primary,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary[50], // Light blue
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.neutral.text.primary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 14,
        color: colors.neutral.text.secondary,
        textAlign: 'center',
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
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.lg,
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
    snackbar: {
        backgroundColor: colors.neutral.text.primary,
    },
});
