import React from 'react';
import { StyleSheet, View, TouchableOpacity, Linking, Modal } from 'react-native';
import { Text, Icon, Button, Snackbar } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

interface ContactUsModalProps {
    visible: boolean;
    onDismiss: () => void;
}

export const ContactUsModal = ({ visible, onDismiss }: ContactUsModalProps) => {
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const SUPPORT_EMAIL = "support@metics.net";

    const handleEmailPress = () => {
        Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch((err) =>
            console.error('An error occurred', err)
        );
    };

    const handleCopyEmail = () => {
        Clipboard.setString(SUPPORT_EMAIL);
        setSnackbarVisible(true);
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onDismiss}
                />

                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Contact Us</Text>
                        <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                            <Icon source="close" size={20} color={colors.neutral.text.secondary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.description}>
                        For all support inquiries, including billing issues, technical problems, and general assistance, please email
                    </Text>

                    <TouchableOpacity
                        style={styles.emailContainer}
                        onPress={handleEmailPress}
                        activeOpacity={0.7}
                    >
                        <Icon source="email-outline" size={24} color={colors.primary[500]} />
                        <Text style={styles.emailText}>{SUPPORT_EMAIL}</Text>
                        <TouchableOpacity onPress={handleCopyEmail} style={styles.copyButton}>
                            <Icon source="content-copy" size={16} color={colors.neutral.text.tertiary} />
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Button
                            mode="contained"
                            onPress={onDismiss}
                            style={styles.doneButton}
                            labelStyle={styles.buttonLabel}
                        >
                            Close
                        </Button>
                    </View>
                </View>

                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={2000}
                    style={styles.snackbar}
                >
                    Email copied to clipboard
                </Snackbar>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        ...shadows.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.styles.h3,
        color: colors.neutral.text.primary,
    },
    closeButton: {
        padding: spacing.xs,
        backgroundColor: colors.neutral.surface.sunken,
        borderRadius: borderRadius.full,
    },
    description: {
        ...typography.styles.body,
        color: colors.neutral.text.secondary,
        marginBottom: spacing.xl,
        lineHeight: 24,
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutral.surface.sunken,
        padding: spacing.md,
        borderRadius: borderRadius.base,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
        marginBottom: spacing.xl,
    },
    emailText: {
        ...typography.styles.h4,
        flex: 1,
        color: colors.neutral.text.primary,
        marginLeft: spacing.md,
    },
    copyButton: {
        padding: spacing.xs,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    doneButton: {
        borderRadius: borderRadius.base,
        minWidth: 100,
    },
    buttonLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    snackbar: {
        bottom: spacing.xl,
    }
});
