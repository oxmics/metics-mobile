import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SupplierActivityLogsType } from '../types/dashboard';
import { daysAgo } from '../utils/helper';
import { colors, typography, spacing, borderRadius } from '../theme';

interface props {
    logs: SupplierActivityLogsType[] | undefined | null,
    viewAll: () => void
}

export const RecentUpdatesCard = ({ logs, viewAll }: props) => {
    // Safely handle logs being undefined or not an array
    const safeLogs = Array.isArray(logs) ? logs : [];

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>ACTIVITY STREAM</Text>
            </View>
            {safeLogs.length > 0 ? (
                <>
                    {safeLogs.slice(0, 5).map((log, index) => (
                        <View
                            key={index}
                            style={[
                                styles.row,
                                index === Math.min(safeLogs.length - 1, 4) && styles.lastRow,
                            ]}
                        >
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>{log?.activity_type?.charAt(0) || '?'}</Text>
                            </View>
                            <View style={styles.content}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.heading}>{log?.activity_type || 'Activity'}</Text>
                                    <Text style={styles.date}>{log?.updated_at ? daysAgo(log.updated_at) : ''}</Text>
                                </View>
                                <Text style={styles.description} numberOfLines={2}>
                                    {log?.description || ''}
                                </Text>
                            </View>
                        </View>
                    ))}
                    <TouchableOpacity onPress={viewAll} style={styles.footerLink}>
                        <Text style={styles.footerLinkText}>View all activity</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No recent activity</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    sectionHeader: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
        backgroundColor: colors.neutral.surface.sunken,
    },
    sectionTitle: {
        ...typography.styles.labelSmall,
        color: colors.neutral.text.tertiary,
    },
    row: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
        alignItems: 'flex-start',
    },
    lastRow: {
        borderBottomWidth: 0,
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
    content: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    heading: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.neutral.text.primary,
    },
    description: {
        ...typography.styles.body,
        fontSize: 13,
        color: colors.neutral.text.secondary,
    },
    date: {
        fontSize: 11,
        color: colors.neutral.text.tertiary,
    },
    emptyState: {
        padding: spacing['2xl'],
        alignItems: 'center',
    },
    emptyText: {
        ...typography.styles.body,
        color: colors.neutral.text.tertiary,
    },
    footerLink: {
        padding: spacing.md,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.neutral.border.default,
        backgroundColor: colors.neutral.surface.hover,
        borderBottomLeftRadius: borderRadius.sm,
        borderBottomRightRadius: borderRadius.sm,
    },
    footerLinkText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primary[600],
    },
});
