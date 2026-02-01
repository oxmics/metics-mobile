import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Modal, Text } from 'react-native-paper';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface props {
    show: boolean,
    closeModal: () => void,
    contentData: any
}

export const BidModal = ({ closeModal, contentData, show }: props) => {
    // Safely handle contentData
    const entries = contentData && typeof contentData === 'object' ? Object.entries(contentData) : [];

    return (
        <Modal
            visible={show}
            onDismiss={closeModal}
            contentContainerStyle={styles.modalContainer}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Additional Details</Text>
            </View>

            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    {entries.length > 0 ? (
                        entries.map(([key, value], index) => (
                            <View key={index} style={styles.row}>
                                <Text style={styles.label}>{key}</Text>
                                <Text style={styles.value}>{value !== null && value !== undefined ? String(value) : '—'}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No additional details available</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    style={styles.closeBtn}
                    labelStyle={styles.btnLabel}
                    onPress={closeModal}
                >
                    Close
                </Button>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: colors.neutral.surface.default,
        margin: spacing.xl,
        borderRadius: borderRadius.lg,
        ...shadows.lg,
        maxHeight: '80%',
    },
    header: {
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    title: {
        ...typography.styles.h3,
        color: colors.neutral.text.primary,
    },
    scrollContainer: {
        flexGrow: 0,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    card: {
        width: '100%',
    },
    row: {
        flexDirection: 'column',
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        color: colors.neutral.text.tertiary,
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 14,
        color: colors.neutral.text.primary,
        lineHeight: 20,
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        ...typography.styles.body,
        color: colors.neutral.text.tertiary,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.border.default,
        alignItems: 'flex-end',
    },
    closeBtn: {
        backgroundColor: colors.primary[600],
        borderRadius: borderRadius.base,
    },
    btnLabel: {
        color: colors.neutral.text.inverse,
        fontSize: 14,
        fontWeight: '600',
    },
});
