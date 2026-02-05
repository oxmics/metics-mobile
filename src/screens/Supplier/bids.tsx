import { useNavigation } from '@react-navigation/native';
import { Icon, Searchbar, Text, ActivityIndicator } from 'react-native-paper';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, StatusBar } from 'react-native';
import usePurchaseOrders from '../../api/purchase order/usePurchaseOrders';
import useMyBids from '../../api/bids/useMyBids';
import { BidType } from '../../types/bids';
import useDebounce from '../../hooks/useDebounce';
import { DataCard } from '../../components/DataCard';
import { formatDate } from '../../utils/helper';
import { CustomNavigationProp } from '../../types/common';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const EmptyState = () => (
    <View style={styles.emptyState}>
        <Icon source="file-document-outline" size={48} color={colors.neutral.text.tertiary} />
        <Text style={styles.emptyTitle}>No Bids Found</Text>
        <Text style={styles.emptySubtitle}>Bids you submit will appear here</Text>
    </View>
);

const SupplierBidsScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();

    // Pagination placeholder
    const [page, setPage] = useState(1);

    const { data: bidsData, isPending: loading, refetch } = useMyBids({ page });
    const { data: purchaseOrders } = usePurchaseOrders();

    const acceptedBidIds = useMemo(() => {
        if (!purchaseOrders) return new Set<string>();
        return new Set(purchaseOrders.map((po: any) => po.bid_header_details?.id).filter(Boolean));
    }, [purchaseOrders]);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [displayBids, setDisplayBids] = useState<BidType[]>([]);

    const debouncedSearchQuery = useDebounce(searchQuery, 800);

    useEffect(() => {
        if (bidsData?.results) {
            setDisplayBids(bidsData.results);
        }
    }, [bidsData]);

    const handleSearch = useCallback(() => {
        if (!bidsData?.results) return;

        const query = debouncedSearchQuery.trim().toLowerCase();
        if (query.length > 0) {
            const filtered = bidsData.results.filter((bid: BidType) =>
                (bid.auction_header?.requisition_number?.toLowerCase() || '').includes(query) ||
                (bid.auction_header?.title?.toLowerCase() || '').includes(query)
            );
            setDisplayBids(filtered);
        } else {
            setDisplayBids(bidsData.results);
        }
    }, [bidsData, debouncedSearchQuery]);

    useEffect(() => {
        handleSearch();
    }, [debouncedSearchQuery, handleSearch]);

    const acceptedBids = useMemo(() => {
        return displayBids.filter(bid => acceptedBidIds.has(bid.id));
    }, [displayBids, acceptedBidIds]);

    const renderItem = ({ item }: { item: BidType }) => {
        return (
            <TouchableOpacity
                onPress={() => item?.auction_header?.id && navigation.navigate('SupplierRequestDetails', { reqId: item.auction_header.id })}
                activeOpacity={0.7}
            >
                <DataCard
                    title={item.auction_header?.requisition_number || '—'}
                    titleLabel="Ref #"
                    status="ACCEPTED"
                    footerLeftText={formatDate(item.created_at)}
                    footerRightText={item.type_of_response || 'Bid'}
                />
            </TouchableOpacity>
        );
    };

    return (
        <ErrorBoundary name="SupplierBidsScreen">
            <View style={styles.wrapper}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

                <View style={styles.contentContainer}>
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            {/* No back button needed if it's a main tab */}
                            <View>
                                <Text style={styles.headerLabel}>Manage</Text>
                                <Text style={styles.title}>My Bids</Text>
                            </View>
                        </View>

                        {/* Search Bar */}
                        <View style={styles.filterBar}>
                            <Searchbar
                                mode="bar"
                                placeholder="Search bids..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                style={styles.searchbar}
                                iconColor={colors.neutral.text.secondary}
                                inputStyle={styles.searchInput}
                                placeholderTextColor={colors.neutral.text.tertiary}
                                cursorColor={colors.primary[500]}
                                onClearIconPress={() => setSearchQuery('')}
                                elevation={0}
                            />
                        </View>

                        <View style={styles.tabContent}>
                            <FlatList
                                data={acceptedBids}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                                refreshing={loading}
                                onRefresh={refetch}
                                ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                                contentContainerStyle={styles.listContent}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </ErrorBoundary>
    );
};

export default SupplierBidsScreen;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.neutral.surface.sunken,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    container: {
        flex: 1,
        backgroundColor: colors.neutral.surface.sunken,
    },
    header: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
        backgroundColor: colors.neutral.surface.default,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    headerLabel: {
        ...typography.styles.caption,
        marginBottom: 2,
    },
    title: {
        ...typography.styles.h2,
        color: colors.neutral.text.primary,
    },
    filterBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        gap: spacing.md,
        backgroundColor: colors.neutral.surface.default,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    searchbar: {
        backgroundColor: colors.neutral.surface.sunken,
        borderRadius: borderRadius.base,
        height: 48,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
        flex: 1,
    },
    searchInput: {
        ...typography.styles.body,
        minHeight: 0,
    },
    tabContent: {
        flex: 1,
        backgroundColor: colors.neutral.surface.sunken,
    },
    listContent: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: spacing['3xl'],
    },
    emptyTitle: {
        ...typography.styles.h4,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
        color: colors.neutral.text.secondary,
    },
    emptySubtitle: {
        ...typography.styles.bodySmall,
        color: colors.neutral.text.tertiary,
    },
    loader: {
        marginTop: spacing['3xl'],
    },
});
