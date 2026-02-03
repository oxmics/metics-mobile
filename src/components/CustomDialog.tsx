import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { colors, spacing, typography, borderRadius } from '../theme';

interface CustomDialogProps {
    visible: boolean;
    title: string;
    message: string;
    onDismiss: () => void;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    confirmColor?: string;
    isDestructive?: boolean;
    loading?: boolean;
}

export const CustomDialog = ({
    visible,
    title,
    message,
    onDismiss,
    confirmText = 'OK',
    cancelText,
    onConfirm,
    confirmColor,
    isDestructive = false,
    loading = false,
}: CustomDialogProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onDismiss}
            >
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.dialog}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>

                        <View style={styles.actions}>
                            {cancelText && (
                                <Button
                                    mode="outlined"
                                    onPress={onDismiss}
                                    style={styles.button}
                                    textColor={colors.neutral.text.secondary}
                                    disabled={loading}
                                >
                                    {cancelText}
                                </Button>
                            )}
                            <Button
                                mode="contained"
                                onPress={onConfirm || onDismiss}
                                style={styles.button}
                                buttonColor={
                                    confirmColor ||
                                    (isDestructive ? colors.semantic.error.default : colors.primary[500])
                                }
                                loading={loading}
                                disabled={loading}
                            >
                                {confirmText}
                            </Button>
                        </View>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    dialog: {
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        ...typography.styles.h3,
        marginBottom: spacing.sm,
        color: colors.neutral.text.primary,
    },
    message: {
        ...typography.styles.body,
        color: colors.neutral.text.secondary,
        marginBottom: spacing.xl,
        lineHeight: 22,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    button: {
        flex: 1,
    },
});
