import { useNavigation } from '@react-navigation/native';
import { Icon, Searchbar, Text, ActivityIndicator, SegmentedButtons, Menu, Button } from 'react-native-paper';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, StatusBar, Animated } from 'react-native';
import { AuctionType } from '../../types/auction';
import { CustomNavigationProp } from '../../types/common';
import useDebounce from '../../hooks/useDebounce';
import { DataCard } from '../../components/DataCard';
import { formatDate } from '../../utils/helper';

import usePurchaseOrders from '../../api/purchase order/usePurchaseOrders';
import useMyAuctions from '../../api/auctions/useMyAuctions';
import { BottomNavbar } from '../../components/BottomNavbar';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const EmptyState = () => (
    <View style={styles.emptyState}>
        <Icon source="file-document-outline" size={48} color={colors.neutral.text.tertiary} />
        <Text style={styles.emptyTitle}>No RFQs Found</Text>
        <Text style={styles.emptySubtitle}>Your requests will appear here</Text>
    </View>
);

const BuyerRfqHistoryScreen = () => {

    const navigation = useNavigation<CustomNavigationProp>();
    const [activeTab, setActiveTab] = useState('all');
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [activeTab, fadeAnim]);

    const [auctions, setAuctions] = useState<AuctionType[]>([]);
    const [count, setCount] = useState<number>(0);
    const [pageCount, setPageCount] = useState<number>(1);

    const [sortBy, setSortBy] = useState<string>('created_at'); // Earliest First
    const [showSortMenu, setShowSortMenu] = useState(false);

    const { data, isPending: loading, refetch } = useMyAuctions({ page: pageCount, ordering: sortBy });
    const { data: purchaseOrders } = usePurchaseOrders();

    const completedAuctionIds = useMemo(() => {
        if (!purchaseOrders) return new Set<string>();
        // Check both root auction_header and nested bid_header_details
        return new Set(purchaseOrders.map(po => {
            return po.auction_header?.id || po.bid_header_details?.auction_header?.id;
        }).filter(Boolean));
    }, [purchaseOrders]);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [displayInProgress, setDisplayInProgress] = useState<AuctionType[]>([]);
    const [displayDraft, setDisplayDraft] = useState<AuctionType[]>([]);
    const [displayCompleted, setDisplayCompleted] = useState<AuctionType[]>([]);

    useEffect(() => {
        try {
            if (data?.results) {
                console.log('[BuyerRfqHistory] Loaded auctions:', data.results.length);
                setAuctions(data.results);
                setCount(data.count ?? 0);
            } else {
                console.log('[BuyerRfqHistory] No results in data');
            }
        } catch (err) {
            console.error('Error processing auction data:', err);
            setAuctions([]);
            setCount(0);
        }
    }, [data]);

    const debouncedSearchQuery = useDebounce(searchQuery, 800);

    const handleDisplayAuctions = useCallback(() => {
        try {
            if (auctions && Array.isArray(auctions)) {
                let inProgress: AuctionType[] = [];
                let drafts: AuctionType[] = [];
                let completed: AuctionType[] = [];

                auctions.forEach((auction) => {
                    // If a PO exists, treat as COMPLETED regardless of strict status
                    if (completedAuctionIds.has(auction.id)) {
                        completed.push(auction);
                        return;
                    }

                    const status = auction?.status?.toLowerCase();
                    if (status === 'in-progress') {
                        inProgress.push(auction);
                    } else if (status === 'draft') {
                        drafts.push(auction);
                    } else {
                        completed.push(auction);
                    }
                });
                setDisplayInProgress(inProgress);
                setDisplayDraft(drafts);
                setDisplayCompleted(completed);
            }
        } catch (err) {
            console.error('Error displaying auctions:', err);
            setDisplayInProgress([]);
            setDisplayDraft([]);
            setDisplayCompleted([]);
        }
    }, [auctions, completedAuctionIds]);

    useEffect(() => {
        handleDisplayAuctions();
    }, [handleDisplayAuctions]);



    const handleSearch = useCallback(() => {
        try {
            if (!auctions) { return; }

            const query = debouncedSearchQuery.trim().toLowerCase();
            if (query.length > 0) {
                const filterFn = (auction: AuctionType) =>
                    (auction?.requisition_number?.toLowerCase() || '').includes(query) ||
                    (auction?.organization_name?.toLowerCase() || '').includes(query);

                // Check PO existence first
                const isCompleted = (auction: AuctionType) =>
                    completedAuctionIds.has(auction.id) ||
                    auction?.status?.toLowerCase() === 'completed';

                let tempInProgress = auctions.filter((auction) =>
                    !isCompleted(auction) &&
                    auction?.status === 'In-Progress' &&
                    filterFn(auction)
                );
                let tempDraft = auctions.filter((auction) =>
                    !isCompleted(auction) &&
                    auction?.status?.toLowerCase() === 'draft' &&
                    filterFn(auction)
                );
                let tempCompleted = auctions.filter((auction) =>
                    isCompleted(auction) &&
                    filterFn(auction)
                );

                setDisplayInProgress(tempInProgress);
                setDisplayDraft(tempDraft);
                setDisplayCompleted(tempCompleted);
            } else {
                handleDisplayAuctions();
            }
        } catch (err) {
            console.error('Error searching auctions:', err);
            handleDisplayAuctions();
        }
    }, [auctions, debouncedSearchQuery, handleDisplayAuctions, completedAuctionIds]);

    useEffect(() => {
        handleSearch();
    }, [handleSearch]);

    const renderItem = ({ item }: { item: AuctionType }) => {
        const hasPO = completedAuctionIds.has(item.id);
        const displayStatus = hasPO ? 'COMPLETED' :
            item?.status === 'In-Progress' ? 'IN-PROGRESS' :
                item?.status?.toLowerCase() === 'draft' ? 'DRAFT' :
                    item?.status ? 'COMPLETED' : 'UNKNOWN';

        return (
            <TouchableOpacity
                onPress={() => item?.id && navigation.push('BuyerRfqDetails', { reqId: item.id })}
                activeOpacity={0.7}
            >
                <DataCard
                    title={item?.requisition_number || '—'}
                    titleLabel="Reference Number"
                    status={displayStatus}
                    footerLeftText={item?.organization_name || '—'}
                    footerRightText={item?.need_by_date ? formatDate(item.need_by_date) : '—'}
                />
            </TouchableOpacity>
        );
    };

    return (
        <ErrorBoundary name="BuyerRfqHistoryScreen">
            <View style={styles.wrapper}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

                <View style={styles.contentContainer}>
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('BuyerDashboard')}
                                style={styles.backButton}
                                activeOpacity={0.7}
                            >
                                <Icon size={24} source="arrow-left" color={colors.neutral.text.secondary} />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.headerLabel}>Manage</Text>
                                <Text style={styles.title}>RFQ History</Text>
                            </View>
                        </View>

                        {/* Search Bar & Sort */}
                        <View style={styles.filterBar}>
                            <Searchbar
                                mode="bar"
                                placeholder="Search RFQs..."
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
                            <Menu
                                visible={showSortMenu}
                                onDismiss={() => setShowSortMenu(false)}
                                anchor={
                                    <TouchableOpacity
                                        style={styles.sortButton}
                                        onPress={() => setShowSortMenu(true)}
                                    >
                                        <Icon source="sort" size={24} color={colors.neutral.text.secondary} />
                                    </TouchableOpacity>
                                }
                            >
                                <Menu.Item
                                    onPress={() => { setSortBy('created_at'); setShowSortMenu(false); }}
                                    title="Earliest First"
                                    leadingIcon={sortBy === 'created_at' ? 'check' : undefined}
                                />
                                <Menu.Item
                                    onPress={() => { setSortBy('-created_at'); setShowSortMenu(false); }}
                                    title="Latest First"
                                    leadingIcon={sortBy === '-created_at' ? 'check' : undefined}
                                />
                                <Menu.Item
                                    onPress={() => { setSortBy('-bid_count'); setShowSortMenu(false); }}
                                    title="Most Bids"
                                    leadingIcon={sortBy === '-bid_count' ? 'check' : undefined}
                                />
                                <Menu.Item
                                    onPress={() => { setSortBy('bid_count'); setShowSortMenu(false); }}
                                    title="Fewest Bids"
                                    leadingIcon={sortBy === 'bid_count' ? 'check' : undefined}
                                />
                            </Menu>
                        </View>

                        <View style={{ margin: spacing.md }}>
                            <SegmentedButtons
                                value={activeTab}
                                onValueChange={setActiveTab}
                                density="small"
                                buttons={[
                                    { value: 'all', label: 'All' },
                                    { value: 'active', label: 'Active' },
                                    { value: 'draft', label: 'Draft' },
                                    { value: 'closed', label: 'Closed' },
                                ]}
                            />
                        </View>

                        <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>

                            {activeTab === 'all' && (
                                <View style={styles.tabContent}>
                                    {(displayCompleted.length + displayDraft.length + displayInProgress.length) > 0 && (
                                        <View style={styles.paginationBar}>
                                            <View style={styles.pagination}>
                                                <TouchableOpacity
                                                    disabled={pageCount === 1}
                                                    onPress={() => setPageCount(pageCount - 1)}
                                                    style={[styles.paginationButton, pageCount === 1 && styles.paginationDisabled]}
                                                >
                                                    <Icon source="chevron-left" size={20} color={pageCount === 1 ? colors.neutral.text.tertiary : colors.neutral.text.primary} />
                                                </TouchableOpacity>
                                                <Text style={styles.paginationText}>Page {pageCount || 1}</Text>
                                                <TouchableOpacity
                                                    disabled={(pageCount * 10) >= count}
                                                    onPress={() => setPageCount(pageCount + 1)}
                                                    style={[styles.paginationButton, (pageCount * 10) >= count && styles.paginationDisabled]}
                                                >
                                                    <Icon source="chevron-right" size={20} color={(pageCount * 10) >= count ? colors.neutral.text.tertiary : colors.neutral.text.primary} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                    <FlatList
                                        data={[...displayInProgress, ...displayDraft, ...displayCompleted]}
                                        renderItem={renderItem}
                                        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                                        refreshing={loading}
                                        onRefresh={refetch}
                                        ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                                        contentContainerStyle={styles.listContent}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            )}

                            {activeTab === 'active' && (
                                <View style={styles.tabContent}>
                                    <FlatList
                                        data={displayInProgress}
                                        renderItem={renderItem}
                                        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                                        refreshing={loading}
                                        onRefresh={refetch}
                                        ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                                        contentContainerStyle={styles.listContent}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            )}

                            {activeTab === 'draft' && (
                                <View style={styles.tabContent}>
                                    <FlatList
                                        data={displayDraft}
                                        renderItem={renderItem}
                                        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                                        refreshing={loading}
                                        onRefresh={refetch}
                                        ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                                        contentContainerStyle={styles.listContent}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            )}

                            {activeTab === 'closed' && (
                                <View style={styles.tabContent}>
                                    <FlatList
                                        data={displayCompleted}
                                        renderItem={renderItem}
                                        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                                        refreshing={loading}
                                        onRefresh={refetch}
                                        ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                                        contentContainerStyle={styles.listContent}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            )}
                        </Animated.View>
                    </View>
                </View>
            </View>
        </ErrorBoundary>
    );
};

export default BuyerRfqHistoryScreen;

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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
        backgroundColor: colors.neutral.surface.default,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
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
        flex: 1, // Take available space
        backgroundColor: colors.neutral.surface.sunken,
        borderRadius: borderRadius.base,
        height: 48,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    sortButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.neutral.surface.sunken,
        borderRadius: borderRadius.base,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    searchInput: {
        ...typography.styles.body,
        minHeight: 0,
    },
    tabs: {
        backgroundColor: colors.neutral.surface.default,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
        elevation: 0,
    },
    tabLabel: {
        ...typography.styles.label,
        textTransform: 'none',
        fontWeight: '600',
    },
    tabContent: {
        flex: 1,
        backgroundColor: colors.neutral.surface.sunken,
    },
    paginationBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paginationButton: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.base,
        backgroundColor: colors.neutral.surface.default,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    paginationDisabled: {
        opacity: 0.5,
        backgroundColor: colors.neutral.surface.sunken,
    },
    paginationText: {
        ...typography.styles.caption,
        marginHorizontal: spacing.md,
        fontWeight: '600',
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
