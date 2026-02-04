import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SupplierActivityLogsType } from '../types/dashboard';
import { daysAgo } from '../utils/helper';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { CustomNavigationProp } from '../types/common';

interface props {
    logs: SupplierActivityLogsType[] | undefined | null,
    viewAll: () => void,
    isBuyer?: boolean
}

// Helper function to determine navigation based on activity type
const getNavigationForActivity = (activityType: string, description: string, isBuyer: boolean = false) => {
    const type = activityType.toLowerCase();

    // Check for RFQ/Auction related activities
    if (type.includes('rfq') || type.includes('auction') || type.includes('request')) {
        return isBuyer ? 'BuyerRfqHistory' : 'SupplierRequestHistory';
    }

    // Check for Order/PO related activities
    if (type.includes('order') || type.includes('purchase')) {
        return isBuyer ? 'BuyerPurchaseOrder' : 'SupplierPurchaseOrder';
    }

    // Check for Bid related activities
    if (type.includes('bid')) {
        return isBuyer ? 'BuyerRfqHistory' : 'SupplierRequestHistory';
    }

    // Check for Product/Enquiry related activities
    if (type.includes('product') || type.includes('enquir')) {
        return 'SupplierProductEnquiries'; // Only suppliers have this
    }

    return null;
};

export const RecentUpdatesCard = ({ logs, viewAll, isBuyer = false }: props) => {
    let navigation: CustomNavigationProp | null = null;

    try {
        navigation = useNavigation<CustomNavigationProp>();
    } catch (e) {
        // Component might be rendered outside NavigationContainer
        console.log('Navigation not available in RecentUpdatesCard');
    }

    const safeLogs = Array.isArray(logs) ? logs : [];

    const handleActivityPress = (log: SupplierActivityLogsType) => {
        if (!navigation) return; // Skip if navigation is not available

        const targetScreen = getNavigationForActivity(log.activity_type, log.description, isBuyer);
        if (targetScreen) {
            navigation.navigate(targetScreen as any);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>ACTIVITY STREAM</Text>
            </View>
            {safeLogs.length > 0 ? (
                <>
                    {safeLogs.slice(0, 5).map((log, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.row,
                                index === Math.min(safeLogs.length - 1, 4) && styles.lastRow,
                            ]}
                            onPress={() => handleActivityPress(log)}
                            activeOpacity={0.7}
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
                        </TouchableOpacity>
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
