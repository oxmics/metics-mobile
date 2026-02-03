import { useNavigation } from '@react-navigation/native';
import { Icon, Text, ActivityIndicator, FAB, Searchbar } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, StatusBar } from 'react-native';
import useSupplierProducts from '../../api/products/useSupplierProducts';
import { Product } from '../../types/product';
import { DataCard } from '../../components/DataCard';
import { CustomNavigationProp } from '../../types/common';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import useDebounce from '../../hooks/useDebounce';

const EmptyState = () => (
    <View style={styles.emptyState}>
        <Icon source="package-variant-closed" size={48} color={colors.neutral.text.tertiary} />
        <Text style={styles.emptyTitle}>No Products Found</Text>
        <Text style={styles.emptySubtitle}>You haven't listed any products yet.</Text>
    </View>
);

const SupplierProductsScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { data: productData, isPending: loading, refetch } = useSupplierProducts();
    const [products, setProducts] = useState<Product[]>([]);
    const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const debouncedSearchQuery = useDebounce(searchQuery, 800);

    useEffect(() => {
        if (productData) {
            const allProducts = productData.inventory || [];
            setProducts(allProducts);
            setDisplayProducts(allProducts);
        }
    }, [productData]);

    // Search logic
    const handleSearch = useCallback(() => {
        const query = debouncedSearchQuery.trim().toLowerCase();
        if (query.length > 0) {
            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query) ||
                p.base_item_id?.toLowerCase().includes(query) ||
                p.product_sub_category?.toLowerCase().includes(query)
            );
            setDisplayProducts(filtered);
        } else {
            setDisplayProducts(products);
        }
    }, [debouncedSearchQuery, products]);

    useEffect(() => {
        handleSearch();
    }, [handleSearch]);

    const renderItem = ({ item }: { item: Product }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.push('SupplierProductDetails', { id: item.id })}
        >
            <DataCard
                title={item.name}
                titleLabel={item.product_sub_category}
                status={item.is_available ? 'IN STOCK' : 'OUT OF STOCK'}
                footerLeftText={`ID: ${item.base_item_id || '—'}`}
                footerRightText={`${item.currency || 'USD'} ${item.market_price}`}
            />
        </TouchableOpacity>
    );

    return (
        <ErrorBoundary name="SupplierProductsScreen">
            <View style={styles.wrapper}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

                <View style={styles.contentContainer}>
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.headerLabel}>Manage</Text>
                                <Text style={styles.title}>My Products</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('SupplierProductEnquiries')}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[colors.primary[800], colors.primary[700]]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.enquiryButton}
                                >
                                    <Icon source="message-text-outline" size={20} color={colors.neutral.white} />
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText}>{productData?.enquiry_count || 0}</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Filter & Search */}
                        <View style={styles.filterBar}>
                            <Searchbar
                                mode="bar"
                                placeholder="Search products..."
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
                        </View>

                        <FlatList
                            data={displayProducts}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            refreshing={loading}
                            onRefresh={refetch}
                            ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>

                    {/* Floating Action Button */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SupplierProductCreate')}
                        activeOpacity={0.8}
                        style={styles.fabContainer}
                    >
                        <LinearGradient
                            colors={[colors.primary[800], colors.primary[700]]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.fab}
                        >
                            <Icon source="plus" size={20} color={colors.neutral.white} />
                            <Text style={styles.fabText}>Add New</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </ErrorBoundary>
    );
};

export default SupplierProductsScreen;

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
    headerLabel: {
        ...typography.styles.caption,
        marginBottom: 2,
    },
    title: {
        ...typography.styles.h2,
        color: colors.neutral.text.primary,
    },
    enquiryButton: {
        padding: spacing.sm,
        borderRadius: borderRadius.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        ...shadows.sm,
    },
    badgeContainer: {
        backgroundColor: colors.semantic.error.default,
        borderRadius: borderRadius.xs,
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: colors.neutral.white,
        fontSize: 10,
        fontWeight: 'bold',
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
    searchInput: {
        ...typography.styles.body,
        minHeight: 0,
    },
    fabContainer: {
        position: 'absolute',
        right: spacing.lg,
        bottom: spacing.lg,
        ...shadows.lg,
    },
    fab: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.sm,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.xs,
    },
    fabText: {
        color: colors.neutral.white,
        fontSize: typography.size.body,
        fontWeight: '600',
    },
});
