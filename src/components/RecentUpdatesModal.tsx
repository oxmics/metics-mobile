import { Button, Modal, Text, Icon } from 'react-native-paper';
import { SupplierActivityLogsType } from '../types/dashboard';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { daysAgo } from '../utils/helper';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface props {
    show: boolean,
    hideModal: () => void,
    logs: SupplierActivityLogsType[] | undefined | null
}

export const RecentUpdatesModal = ({ hideModal, logs, show }: props) => {
    const safeLogs = Array.isArray(logs) ? logs : [];

    return (
        <Modal
            visible={show}
            onDismiss={hideModal}
            dismissable
            contentContainerStyle={styles.helper}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Activity Stream</Text>
                    <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
                        <Icon source="close" size={20} color={colors.neutral.text.secondary} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.body}
                    showsVerticalScrollIndicator={false}
                >
                    {safeLogs.length > 0 ? (
                        safeLogs.map((log, index) => (
                            <View key={index} style={styles.logItem}>
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarText}>{log?.activity_type?.charAt(0) || '?'}</Text>
                                </View>
                                <View style={styles.logContent}>
                                    <View style={styles.contentHeader}>
                                        <Text style={styles.logType}>{log?.activity_type || 'Activity'}</Text>
                                        <Text style={styles.logTime}>{log?.updated_at ? daysAgo(log.updated_at) : ''}</Text>
                                    </View>
                                    <Text style={styles.logDescription}>{log?.description || ''}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No activity logs found</Text>
                        </View>
                    )}
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        onPress={hideModal}
                        mode="contained"
                        style={styles.closeBtn}
                        labelStyle={styles.closeLabel}
                    >
                        Close
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    helper: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    container: {
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.md,
        maxHeight: '80%',
        ...shadows.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
        backgroundColor: colors.neutral.surface.sunken,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.neutral.text.secondary,
        textTransform: 'uppercase',
    },
    closeButton: {
        padding: spacing.xs,
    },
    body: {
        padding: spacing.lg,
    },
    logItem: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutral.surface.sunken,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    avatarText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.neutral.text.secondary,
    },
    logContent: {
        flex: 1,
        paddingTop: 4,
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    logType: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.neutral.text.primary,
    },
    logDescription: {
        fontSize: 14,
        color: colors.neutral.text.secondary,
        lineHeight: 20,
    },
    logTime: {
        fontSize: 11,
        color: colors.neutral.text.tertiary,
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
        backgroundColor: colors.neutral.surface.default,
        borderColor: colors.neutral.border.default,
        borderWidth: 1,
        borderRadius: borderRadius.base,
    },
    closeLabel: {
        fontSize: 14,
        color: colors.neutral.text.primary,
        fontWeight: '600',
    },
});
