import { useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, TouchableOpacity, View, StatusBar } from 'react-native';
import { Button, Icon, Searchbar, Text, ActivityIndicator } from 'react-native-paper';
import { CustomNavigationProp } from '../../types/common';
import { useCallback, useEffect, useState } from 'react';
import { DataCard } from '../../components/DataCard';
import { PurchaseOrderType } from '../../types/purchaseOrder';
import useDebounce from '../../hooks/useDebounce';
import usePurchaseOrders from '../../api/purchase order/usePurchaseOrders';
import { BottomNavbar } from '../../components/BottomNavbar';
import { colors, typography, spacing, borderRadius } from '../../theme';

const EmptyState = () => (
    <View style={styles.emptyState}>
        <Icon source="package-variant-closed" size={48} color={colors.neutral.text.tertiary} />
        <Text style={styles.emptyTitle}>No Purchase Orders</Text>
        <Text style={styles.emptySubtitle}>Your orders will appear here</Text>
    </View>
);

const BuyerPurchaseOrderScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { data: purchaseOrders, isPending: loading, refetch } = usePurchaseOrders();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [displayOrders, setDisplayOrders] = useState<PurchaseOrderType[]>([]);

    const debouncedSearchQuery = useDebounce(searchQuery, 800);

    useEffect(() => {
        if (purchaseOrders) {
            setDisplayOrders(purchaseOrders);
        }
    }, [purchaseOrders]);

    const handleSearch = useCallback(() => {
        const query = debouncedSearchQuery.trim();
        if (query.length > 0) {
            const tempOrders = purchaseOrders?.filter((order) =>
                order.bid_header_details.auction_header.requisition_number.includes(query)
            );
            if (tempOrders) {
                setDisplayOrders(tempOrders);
            }
        } else if (purchaseOrders) {
            setDisplayOrders(purchaseOrders);
        }
    }, [debouncedSearchQuery, purchaseOrders]);

    useEffect(() => {
        handleSearch();
    }, [handleSearch]);

    const formatStatus = (status: string) => {
        const statusMap: Record<string, string> = {
            'awarded': 'AWARDED',
            'draft': 'DRAFT',
            'withdrawn': 'WITHDRAWN',
            'disqualified': 'DISQUALIFIED',
            'cancelled': 'CANCELLED',
        };
        return statusMap[status] || 'REJECTED';
    };

    return (
        <View style={styles.wrapper}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

            <View style={styles.contentContainer}>
                <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.replace('BuyerDashboard')}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Icon size={24} source="arrow-left" color={colors.neutral.text.secondary} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerLabel}>Manage</Text>
                        <Text style={styles.title}>Purchase Orders</Text>
                    </View>
                </View>

                {/* Filter & Search */}
                <View style={styles.filterBar}>
                    <Searchbar
                        mode="bar"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchbar}
                        iconColor={colors.neutral.text.tertiary}
                        inputStyle={styles.searchInput}
                        placeholderTextColor={colors.neutral.text.tertiary}
                        cursorColor={colors.primary[500]}
                        onClearIconPress={() => setSearchQuery('')}
                        elevation={0}
                    />
                    <Button
                        mode="outlined"
                        onPress={() => console.log('Export CSV')}
                        style={styles.exportBtn}
                        //labelStyle={styles.exportLabel}
                        //icon="download-outline"
                        textColor={colors.neutral.text.secondary}
                        contentStyle={styles.exportContent}
                    >
                        <Icon source="download" size={20} color={colors.neutral.text.secondary} />
                    </Button>
                </View>

                {/* KPI Card (Optional - keeping simplified for list view consistency) */}
                {/*
                <View style={styles.kpiCard}>
                    <View style={styles.kpiContent}>
                        <Text style={styles.kpiLabel}>Total Orders</Text>
                        <Text style={styles.kpiValue}>{purchaseOrders ? purchaseOrders.length : 0}</Text>
                    </View>
                    <View style={styles.kpiIcon}>
                        <Icon source="package-variant-closed" size={24} color={colors.primary[500]} />
                    </View>
                </View>
                */}

                <View style={styles.listContainer}>
                    <FlatList
                        data={displayOrders}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => navigation.push('BuyerPurchaseOrderDetails', { orderId: item.id })}
                                activeOpacity={0.7}
                            >
                                <DataCard
                                    title={item.bid_header_details?.auction_header?.requisition_number ?? '—'}
                                    titleLabel="Requisition Number"
                                    status={formatStatus(item.bid_header_details?.bid_status ?? '')}
                                    footerLeftText={item.buyer_organisation_details?.name ?? '—'}
                                    footerRightText={item.total_price ?? '—'}
                                />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item: PurchaseOrderType) => item.id}
                        refreshing={loading}
                        onRefresh={() => refetch()}
                        ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                </View>
                <BottomNavbar />
            </View>
        </View>
    );
};

export default BuyerPurchaseOrderScreen;

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
    kpiCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.neutral.surface.default,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        marginHorizontal: spacing.xl,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
    },
    kpiContent: {
        flex: 1,
    },
    kpiLabel: {
        ...typography.styles.label,
        marginBottom: spacing.xs,
        color: colors.neutral.text.secondary,
    },
    kpiValue: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.primary[600],
        letterSpacing: -0.5,
    },
    kpiIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary[50], // Lightest blue
        justifyContent: 'center',
        alignItems: 'center',
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
    exportBtn: {
        borderRadius: borderRadius.base,
        borderColor: colors.neutral.border.default,
        backgroundColor: colors.neutral.surface.default,
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    exportContent: {
        height: 48,
    },
    exportLabel: {
        ...typography.styles.label,
        color: colors.neutral.text.secondary,
    },
    searchbar: {
        flex: 1,
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
    listContainer: {
        flex: 1,
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
