import { useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, TouchableOpacity, View, StatusBar } from 'react-native';
import { Button, Icon, Searchbar, Text, ActivityIndicator } from 'react-native-paper';
import { CustomNavigationProp } from '../../types/common';
import { useCallback, useEffect, useState } from 'react';
import { DataCard } from '../../components/DataCard';
import { PurchaseOrderStatusType } from '../../types/purchaseOrder';
import usePurchaseOrderStatus from '../../api/purchase order/usePurchaseOrderStatus';
import useDebounce from '../../hooks/useDebounce';
import { BottomNavbar } from '../../components/BottomNavbar';
import { colors, typography, spacing, borderRadius } from '../../theme';

const EmptyState = () => (
    <View style={styles.emptyState}>
        <Icon source="package-variant-closed" size={48} color={colors.neutral.text.tertiary} />
        <Text style={styles.emptyTitle}>No Purchase Orders</Text>
        <Text style={styles.emptySubtitle}>Your orders will appear here</Text>
    </View>
);

const SupplierPurchaseOrderScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { data: purchaseOrders, isPending: loading, refetch } = usePurchaseOrderStatus();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [displayOrders, setDisplayOrders] = useState<PurchaseOrderStatusType[]>([]);

    const debouncedSearchQuery = useDebounce(searchQuery, 800);

    useEffect(() => {
        if (purchaseOrders) {
            setDisplayOrders(purchaseOrders);
        }
    }, [purchaseOrders]);

    const handleSearch = useCallback(() => {
        const query = debouncedSearchQuery.trim();
        if (query.length > 0) {
            const tempOrders = purchaseOrders?.filter((order) => order.document_num.includes(query));
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

    const getStatusText = (status: number) => {
        if (status === 0) {return 'PENDING';}
        if (status === -1) {return 'REJECTED';}
        return 'APPROVED';
    };

    return (
        <View style={styles.wrapper}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

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
                        textColor={colors.neutral.text.secondary}
                        contentStyle={styles.exportContent}
                    >
                        <Icon source="download" size={20} color={colors.neutral.text.secondary} />
                    </Button>
                </View>

                {/* List Content */}
                <View style={styles.listContainer}>
                    <FlatList
                        data={displayOrders}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => navigation.push('SupplierPurchaseOrderDetails', { orderId: item.id })}
                                activeOpacity={0.7}
                            >
                                <DataCard
                                    title={item.document_num ?? '—'}
                                    titleLabel="Document Number"
                                    status={getStatusText(item.int_status)}
                                    footerLeftText={item.buyer_organisation_details?.name ?? '—'}
                                    footerRightText={item.total_price ?? '—'}
                                />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item: PurchaseOrderStatusType) => item.id}
                        refreshing={loading}
                        onRefresh={() => refetch()}
                        ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
            <BottomNavbar isSupplier />
        </View>
    );
};

export default SupplierPurchaseOrderScreen;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.neutral.surface.sunken,
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
        paddingBottom: 100,
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
