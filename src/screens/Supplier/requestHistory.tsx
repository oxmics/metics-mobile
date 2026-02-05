import { useNavigation } from '@react-navigation/native';
import { Icon, Searchbar, Text, ActivityIndicator, SegmentedButtons, Menu } from 'react-native-paper';
import { CustomNavigationProp } from '../../types/common';
import { useEffect, useState, useCallback, useRef } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, StatusBar, Animated } from 'react-native';
import useAuctionHeaders from '../../api/auctions/useAuctionHeaders';
import { AuctionType } from '../../types/auction';
import useDebounce from '../../hooks/useDebounce';
import { DataCard } from '../../components/DataCard';
import { formatDate } from '../../utils/helper';

import { BottomNavbar } from '../../components/BottomNavbar';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const EmptyState = () => (
    <View style={styles.emptyState}>
        <Icon source="file-document-outline" size={48} color={colors.neutral.text.tertiary} />
        <Text style={styles.emptyTitle}>No Requests Found</Text>
        <Text style={styles.emptySubtitle}>Active requests will appear here</Text>
    </View>
);

const SupplierRequestHistory = () => {

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

    const { data: auctions, isPending: loading, refetch } = useAuctionHeaders();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [displayClosedAuctions, setDisplayClosedAuctions] = useState<AuctionType[]>([]);
    const [displayOpenAuctions, setDisplayOpenAuctions] = useState<AuctionType[]>([]);

    const [sortBy, setSortBy] = useState<string>('-created_at'); // Latest First
    const [showSortMenu, setShowSortMenu] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 800);

    const handleDisplayAuctions = useCallback(() => {
        if (auctions) {
            let open = [...(auctions.open_auctions || [])];
            let closed = [...(auctions.closed_auctions || [])];

            // Sort function
            const sortFn = (a: AuctionType, b: AuctionType) => {
                if (sortBy === 'created_at') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                if (sortBy === '-created_at') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                if (sortBy === 'need_by_date') return new Date(a.need_by_date || 0).getTime() - new Date(b.need_by_date || 0).getTime();
                return 0;
            };

            setDisplayOpenAuctions(open.sort(sortFn));
            setDisplayClosedAuctions(closed.sort(sortFn));
        }
    }, [auctions, sortBy]);

    useEffect(() => {
        handleDisplayAuctions();
    }, [handleDisplayAuctions]);

    const handleSearch = useCallback(() => {
        if (!auctions) { return; }

        const query = debouncedSearchQuery.trim().toLowerCase();

        let tempOpenAuctions = [...(auctions.open_auctions || [])];
        let tempClosedAuctions = [...(auctions.closed_auctions || [])];

        // Apply Search
        if (query.length > 0) {
            const filterFn = (order: AuctionType) =>
                (order?.requisition_number?.toLowerCase() || '').includes(query) ||
                (order?.organization_name?.toLowerCase() || '').includes(query);

            tempOpenAuctions = tempOpenAuctions.filter(filterFn);
            tempClosedAuctions = tempClosedAuctions.filter(filterFn);
        }

        // Apply Sort
        const sortFn = (a: AuctionType, b: AuctionType) => {
            if (sortBy === 'created_at') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sortBy === '-created_at') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sortBy === 'need_by_date') return new Date(a.need_by_date || 0).getTime() - new Date(b.need_by_date || 0).getTime();
            return 0;
        };

        setDisplayOpenAuctions(tempOpenAuctions.sort(sortFn));
        setDisplayClosedAuctions(tempClosedAuctions.sort(sortFn));

    }, [auctions, debouncedSearchQuery, sortBy]);

    useEffect(() => {
        handleSearch();
    }, [debouncedSearchQuery, handleSearch]);

    const renderItem = ({ item }: { item: AuctionType }) => (
        <TouchableOpacity
            onPress={() => item?.id && navigation.push('SupplierRequestDetails', { reqId: item.id })}
            activeOpacity={0.7}
        >
            <DataCard
                title={item?.requisition_number || '—'}
                titleLabel="Reference Number"
                status={item?.is_open ? 'OPEN' : 'CLOSED'}
                footerLeftText={item?.organization_name || '—'}
                footerRightText={item?.need_by_date ? formatDate(item.need_by_date) : '—'}
            />
        </TouchableOpacity>
    );

    return (
        <ErrorBoundary name="SupplierRequestHistory">
            <View style={styles.wrapper}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

                <View style={styles.contentContainer}>
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('SupplierDashboard')}
                                style={styles.backButton}
                                activeOpacity={0.7}
                            >
                                <Icon size={24} source="arrow-left" color={colors.neutral.text.secondary} />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.headerLabel}>Manage</Text>
                                <Text style={styles.title}>Request History</Text>
                            </View>
                        </View>

                        {/* Search Bar */}
                        <View style={styles.filterBar}>
                            <Searchbar
                                mode="bar"
                                placeholder="Search requests..."
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
                                    onPress={() => { setSortBy('need_by_date'); setShowSortMenu(false); }}
                                    title="Need By Date"
                                    leadingIcon={sortBy === 'need_by_date' ? 'check' : undefined}
                                />
                            </Menu>
                        </View>

                        <View style={{ margin: spacing.md }}>
                            <SegmentedButtons
                                value={activeTab}
                                onValueChange={setActiveTab}
                                buttons={[
                                    { value: 'all', label: 'All' },
                                    { value: 'open', label: 'Open' },
                                    { value: 'closed', label: 'Closed' },
                                ]}
                            />
                        </View>

                        <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
                            {activeTab === 'all' && (
                                <FlatList
                                    data={[...displayOpenAuctions, ...displayClosedAuctions]}
                                    renderItem={renderItem}
                                    keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                                    refreshing={loading}
                                    onRefresh={refetch}
                                    ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                                    contentContainerStyle={styles.listContent}
                                    showsVerticalScrollIndicator={false}
                                />
                            )}
                            {activeTab === 'open' && (
                                <View style={styles.tabContent}>
                                    <FlatList
                                        data={displayOpenAuctions}
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
                                        data={displayClosedAuctions}
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

export default SupplierRequestHistory;

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
        flex: 1,
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
