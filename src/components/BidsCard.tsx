import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, Icon } from 'react-native-paper';
import { BidType } from '../types/bids';
import { formatDate } from '../utils/helper';
import { useNavigation } from '@react-navigation/native';
import { CustomNavigationProp } from '../types/common';
import { colors, typography, spacing, borderRadius } from '../theme';

interface props {
    contentData: BidType[] | undefined | null,
    buttonFn: () => void
}

export const BidsCard = ({ contentData, buttonFn }: props) => {
    const navigation = useNavigation<CustomNavigationProp>();

    // Safely handle contentData
    const safeBids = Array.isArray(contentData) ? contentData : [];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>All Bids</Text>
                <Button
                    mode="contained"
                    style={styles.compareBtn}
                    labelStyle={styles.compareLabel}
                    onPress={() => buttonFn()}
                    icon="compare-horizontal"
                    compact
                >
                    Compare
                </Button>
            </View>

            {safeBids.length > 0 ? (
                safeBids.map((bid, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onPress={() => {
                            const auctionId = bid?.auction_header?.id;
                            const bidId = bid?.id;
                            if (auctionId && bidId) {
                                navigation.navigate('BuyerBidsDetails', { bidId: bidId, reqId: auctionId });
                            }
                        }}
                    >
                        <View style={styles.card}>
                            <View style={styles.bidInfo}>
                                <View style={styles.supplierRow}>
                                    <Icon source="domain" size={16} color={colors.primary[800]} />
                                    <Text style={styles.supplierName}>{bid?.organisation?.name ?? 'Unknown supplier'}</Text>
                                </View>
                                <Text style={styles.expiryDate}>
                                    Expires: {bid?.bid_expiration_date ? formatDate(bid.bid_expiration_date) : '—'}
                                </Text>
                            </View>
                            <Icon source="chevron-right" size={20} color={colors.neutral.text.tertiary} />
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No bids found</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    title: {
        ...typography.styles.h4,
        color: colors.primary[600],
    },
    compareBtn: {
        backgroundColor: colors.primary[500],
        borderRadius: borderRadius.base,
    },
    compareLabel: {
        ...typography.styles.labelSmall,
        color: colors.neutral.surface.default,
        fontSize: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        backgroundColor: colors.neutral.surface.sunken,
        borderRadius: borderRadius.sm,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    bidInfo: {
        flex: 1,
    },
    supplierRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: 2,
    },
    supplierName: {
        ...typography.styles.body,
        fontWeight: '600',
        color: colors.neutral.text.primary,
    },
    expiryDate: {
        ...typography.styles.caption,
        color: colors.neutral.text.secondary,
        marginLeft: 20, // Align with text start of supplier row
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        ...typography.styles.body,
        color: colors.neutral.text.tertiary,
    },
});
