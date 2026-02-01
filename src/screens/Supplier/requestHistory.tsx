import { useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, TouchableOpacity, View, StatusBar } from 'react-native';
import { CustomNavigationProp } from '../../types/common';
import { Icon, Searchbar, Text, ActivityIndicator } from 'react-native-paper';
import { useEffect, useState, useCallback } from 'react';
import useAuctionHeaders from '../../api/auctions/useAuctionHeaders';
import { AuctionType } from '../../types/auction';
import useDebounce from '../../hooks/useDebounce';
import { DataCard } from '../../components/DataCard';
import { formatDate } from '../../utils/helper';
import { Tabs, TabScreen, TabsProvider } from 'react-native-paper-tabs';
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

    const { data: auctions, isPending: loading, refetch } = useAuctionHeaders();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [displayClosedAuctions, setDisplayClosedAuctions] = useState<AuctionType[]>([]);
    const [displayOpenAuctions, setDisplayOpenAuctions] = useState<AuctionType[]>([]);

    const debouncedSearchQuery = useDebounce(searchQuery, 800);

    const handleDisplayAuctions = useCallback(() => {
        if (auctions) {
            setDisplayOpenAuctions(auctions.open_auctions || []);
            setDisplayClosedAuctions(auctions.closed_auctions || []);
        }
    }, [auctions]);

    useEffect(() => {
        handleDisplayAuctions();
    }, [handleDisplayAuctions]);

    const handleSearch = useCallback(() => {
        if (!auctions) {return;}

        const query = debouncedSearchQuery.trim().toLowerCase();
        if (query.length > 0) {
            const filterFn = (order: AuctionType) =>
                (order?.requisition_number?.toLowerCase() || '').includes(query) ||
                (order?.organization_name?.toLowerCase() || '').includes(query);

            let tempOpenAuctions = auctions.open_auctions?.filter(filterFn) || [];
            let tempClosedAuctions = auctions.closed_auctions?.filter(filterFn) || [];

            setDisplayOpenAuctions(tempOpenAuctions);
            setDisplayClosedAuctions(tempClosedAuctions);
        } else {
            handleDisplayAuctions();
        }
    }, [auctions, debouncedSearchQuery, handleDisplayAuctions]);

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
                            onPress={() => navigation.replace('SupplierDashboard')}
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
                    </View>

                    <TabsProvider defaultIndex={0}>
                        <Tabs
                            mode="fixed"
                            tabLabelStyle={styles.tabLabel}
                            style={styles.tabs}
                            disableSwipe
                        >
                            <TabScreen label="All">
                                <View style={styles.tabContent}>
                                    <FlatList
                                        data={[...displayOpenAuctions, ...displayClosedAuctions]}
                                        renderItem={renderItem}
                                        keyExtractor={(item: AuctionType) => item?.id?.toString() || Math.random().toString()}
                                        refreshing={loading}
                                        onRefresh={() => refetch()}
                                        ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                                        contentContainerStyle={styles.listContent}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            </TabScreen>
                            <TabScreen label="Open">
                                <View style={styles.tabContent}>
                                    <FlatList
                                        data={displayOpenAuctions}
                                        renderItem={renderItem}
                                        keyExtractor={(item: AuctionType) => item?.id?.toString() || Math.random().toString()}
                                        refreshing={loading}
                                        onRefresh={() => refetch()}
                                        ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                                        contentContainerStyle={styles.listContent}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            </TabScreen>
                            <TabScreen label="Closed">
                                <View style={styles.tabContent}>
                                    <FlatList
                                        data={displayClosedAuctions}
                                        renderItem={renderItem}
                                        keyExtractor={(item: AuctionType) => item?.id?.toString() || Math.random().toString()}
                                        refreshing={loading}
                                        onRefresh={() => refetch()}
                                        ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                                        contentContainerStyle={styles.listContent}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            </TabScreen>
                        </Tabs>
                    </TabsProvider>
                </View>
                <BottomNavbar isSupplier />
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
        paddingTop: spacing['2xl'],
        paddingBottom: spacing.lg,
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
        backgroundColor: colors.neutral.surface.sunken,
        borderRadius: borderRadius.base,
        height: 48,
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
