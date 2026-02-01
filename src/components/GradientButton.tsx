import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ActivityIndicator } from 'react-native-paper';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface GradientButtonProps {
    label: string,
    onPress: () => void
    colors?: string[],
    disabled?: boolean,
    loading?: boolean,
    variant?: 'primary' | 'secondary' | 'outline'
}

const GradientButton = ({
    label,
    onPress,
    colors: buttonColors,
    disabled,
    loading,
    variant = 'primary',
}: GradientButtonProps) => {

    const defaultColors = [colors.primary[800], colors.primary[700]];
    const disabledColors = [colors.neutral.text.disabled, colors.neutral.text.disabled];
    const gradientColors = disabled ? disabledColors : (buttonColors || defaultColors);

    if (variant === 'outline') {
        return (
            <TouchableOpacity
                disabled={disabled}
                style={[styles.outlineButton, disabled && styles.outlineDisabled]}
                onPress={onPress}
                activeOpacity={0.7}
            >
                {loading ? (
                    <ActivityIndicator size="small" color={colors.primary[800]} />
                ) : (
                    <Text style={[styles.outlineButtonText, disabled && styles.outlineTextDisabled]}>
                        {label}
                    </Text>
                )}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            disabled={disabled}
            style={styles.buttonContainer}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, disabled && styles.buttonDisabled]}
            >
                {loading ? (
                    <ActivityIndicator size="small" color={colors.neutral.white} />
                ) : (
                    <Text style={styles.buttonText}>{label}</Text>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default GradientButton;

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        marginTop: spacing.lg,
        ...shadows.sm,
        borderRadius: borderRadius.base,
    },
    button: {
        paddingVertical: spacing.md,
        borderRadius: borderRadius.base,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 52,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: colors.neutral.white,
        fontSize: typography.size.body,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    outlineButton: {
        width: '100%',
        marginTop: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.base,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 52,
        borderWidth: 1.5,
        borderColor: colors.primary[800],
        backgroundColor: 'transparent',
    },
    outlineDisabled: {
        borderColor: colors.neutral.text.disabled,
    },
    outlineButtonText: {
        color: colors.primary[800],
        fontSize: typography.size.body,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    outlineTextDisabled: {
        color: colors.neutral.text.disabled,
    },
});
