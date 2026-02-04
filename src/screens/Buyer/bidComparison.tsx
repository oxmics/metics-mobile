import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Icon, ActivityIndicator } from 'react-native-paper';
import { useState, useMemo } from 'react';
import { useBidComparison, useAwardBid } from '../../api/bids/useBids';
import { RootStackParamList } from '../../types/common';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { CustomDialog } from '../../components/CustomDialog';
import GradientButton from '../../components/GradientButton';

type ScreenRouteProp = RouteProp<RootStackParamList, 'BuyerBidComparison'>;

const BuyerBidComparisonScreen = () => {
    const route = useRoute<ScreenRouteProp>();
    const navigation = useNavigation();
    const { auctionId, auctionTitle } = route.params;

    const { data: comparisonData, isLoading } = useBidComparison(auctionId);
    const awardBid = useAwardBid();

    const [showAwardDialog, setShowAwardDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [selectedBidId, setSelectedBidId] = useState<string | null>(null);

    // Calculate lowest price per line for highlighting
    const lowestPrices = useMemo(() => {
        if (!comparisonData?.auction_lines || !comparisonData?.bids) return {};
        const lowMap: Record<string, number> = {}; // lineId -> lowestPrice

        comparisonData.auction_lines.forEach(line => {
            let min = Infinity;
            comparisonData.bids.forEach(bid => {
                const linePrice = bid.line_prices.find(lp => lp.line_id === line.id)?.unit_price;
                if (linePrice !== undefined && linePrice < min) {
                    min = linePrice;
                }
            });
            lowMap[line.id] = min;
        });
        return lowMap;
    }, [comparisonData]);

    const handleAwardCheck = (bidId: string) => {
        setSelectedBidId(bidId);
        setShowAwardDialog(true);
    };

    const confirmAward = () => {
        if (selectedBidId) {
            setShowAwardDialog(false);
            awardBid.mutate(selectedBidId, {
                onSuccess: () => setShowSuccessDialog(true),
            });
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    if (!comparisonData || !comparisonData.bids || comparisonData.bids.length === 0) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No Comparison Data</Text>
            </View>
        );
    }

    return (
        <ErrorBoundary>
            <View style={styles.wrapper}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon source="arrow-left" size={24} color={colors.neutral.text.primary} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerLabel}>Price Check</Text>
                        <Text style={styles.title} numberOfLines={1}>{auctionTitle}</Text>
                    </View>
                </View>

                {/* Content - Horizontal Scroll for Columns */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    <View>
                        {/* Header Row: Suppliers */}
                        <View style={styles.row}>
                            <View style={[styles.cell, styles.stickyColumn, styles.headerCell]}>
                                <Text style={styles.columnHeader}>Item / Supplier</Text>
                            </View>
                            {comparisonData.bids.map((bid) => (
                                <View key={bid.bid_id} style={[styles.cell, styles.headerCell, styles.supplierHeader]}>
                                    <Text style={styles.supplierName} numberOfLines={1}>{bid.supplier_name}</Text>
                                    <View style={styles.totalBadge}>
                                        <Text style={styles.totalText}>
                                            {bid.currency} {bid.total_price.toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Data Rows: Auction Lines */}
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {comparisonData.auction_lines.map((line) => (
                                <View key={line.id} style={styles.row}>
                                    {/* Item Column */}
                                    <View style={[styles.cell, styles.stickyColumn]}>
                                        <Text style={styles.itemName}>{line.description}</Text>
                                        <Text style={styles.itemMeta}>Qty: {line.quantity} {line.unit}</Text>
                                    </View>

                                    {/* Supplier Prices */}
                                    {comparisonData.bids.map((bid) => {
                                        const price = bid.line_prices.find(lp => lp.line_id === line.id)?.unit_price;
                                        const isLowest = price === lowestPrices[line.id];

                                        return (
                                            <View key={`${bid.bid_id}-${line.id}`} style={[styles.cell, styles.priceCell, isLowest && styles.bestPriceCell]}>
                                                <Text style={[styles.priceText, isLowest && styles.bestPriceText]}>
                                                    {price ? `${price.toLocaleString()}` : '-'}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            ))}

                            {/* Award Row */}
                            <View style={styles.row}>
                                <View style={[styles.cell, styles.stickyColumn, { borderBottomWidth: 0 }]}>
                                    <Text style={[styles.columnHeader, { opacity: 0 }]}>Action</Text>
                                </View>
                                {comparisonData.bids.map((bid) => (
                                    <View key={`award-${bid.bid_id}`} style={[styles.cell, { borderBottomWidth: 0, paddingVertical: spacing.md }]}>
                                        <GradientButton
                                            label="Award"
                                            onPress={() => handleAwardCheck(bid.bid_id)}
                                            style={{ height: 36, width: 100 }}
                                            labelStyle={{ fontSize: 12 }}
                                        />
                                    </View>
                                ))}
                            </View>
                            <View style={{ height: 40 }} />
                        </ScrollView>
                    </View>
                </ScrollView>

                {/* Dialogs */}
                <CustomDialog
                    visible={showAwardDialog}
                    title="Confirm Award"
                    message="Award this bid and create a Purchase Order?"
                    onDismiss={() => setShowAwardDialog(false)}
                    confirmText="Award"
                    onConfirm={confirmAward}
                />
                <CustomDialog
                    visible={showSuccessDialog}
                    title="Success"
                    message="Order Created!"
                    onDismiss={() => {
                        setShowSuccessDialog(false);
                        navigation.goBack();
                    }}
                    confirmText="OK"
                />
            </View>
        </ErrorBoundary>
    );
};

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: colors.neutral.surface.default },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyTitle: { ...typography.styles.h4, color: colors.neutral.text.secondary },
    header: { padding: spacing.lg, backgroundColor: colors.neutral.surface.default, borderBottomWidth: 1, borderColor: colors.neutral.border.default, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    backButton: { padding: spacing.xs },
    headerLabel: { ...typography.styles.caption, color: colors.neutral.text.tertiary, textTransform: 'uppercase' },
    title: { ...typography.styles.h2, color: colors.neutral.text.primary },

    horizontalScroll: { flex: 1 },
    row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.neutral.border.default },
    cell: { width: 140, padding: spacing.md, justifyContent: 'center' }, // Fixed width for columns
    stickyColumn: { width: 160, backgroundColor: colors.neutral.surface.sunken, borderRightWidth: 1, borderColor: colors.neutral.border.default }, // Item column wider

    headerCell: { backgroundColor: colors.neutral.surface.sunken, height: 80, justifyContent: 'center' },
    columnHeader: { ...typography.styles.label, color: colors.neutral.text.secondary },
    supplierHeader: { alignItems: 'center' },
    supplierName: { ...typography.styles.label, marginBottom: 4 },
    totalBadge: { backgroundColor: colors.primary[100], borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
    totalText: { ...typography.styles.caption, color: colors.primary[700], fontWeight: 'bold' },

    itemName: { ...typography.styles.bodySmall, fontWeight: '600', color: colors.neutral.text.primary, marginBottom: 2 },
    itemMeta: { ...typography.styles.caption, color: colors.neutral.text.tertiary },

    priceCell: { alignItems: 'center' },
    bestPriceCell: { backgroundColor: colors.semantic.success.surface },
    priceText: { ...typography.styles.body, color: colors.neutral.text.primary },
    bestPriceText: { color: colors.semantic.success.dark, fontWeight: 'bold' },
});

export default BuyerBidComparisonScreen;
