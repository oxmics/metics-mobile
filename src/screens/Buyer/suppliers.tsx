import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, FlatList, TouchableOpacity, StatusBar, Linking } from 'react-native';
import { Text, ActivityIndicator, Icon, Searchbar, Chip } from 'react-native-paper';
import { useState } from 'react';
import useSuppliers from '../../api/suppliers/useSuppliers';
import { Supplier } from '../../types/supplier';
import { CustomNavigationProp } from '../../types/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const BuyerSuppliersScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { data: suppliers, isLoading, error, refetch } = useSuppliers();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSuppliers = suppliers?.filter(supplier =>
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCall = (phone: string) => {
        if (phone) {
            Linking.openURL(`tel:${phone}`);
        }
    };

    const handleEmail = (email: string) => {
        if (email) {
            Linking.openURL(`mailto:${email}`);
        }
    };

    const renderSupplier = ({ item }: { item: Supplier }) => (
        <TouchableOpacity
            style={styles.supplierCard}
            onPress={() => navigation.navigate('BuyerSupplierDetails', { supplierId: item.id })}
            activeOpacity={0.7}
        >
            <View style={styles.supplierHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.supplierName} numberOfLines={1}>{item.name}</Text>
                    {item.city && item.country && (
                        <View style={styles.locationRow}>
                            <Icon source="map-marker-outline" size={14} color={colors.neutral.text.tertiary} />
                            <Text style={styles.locationText}>{item.city}, {item.country}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Categories - Hidden for now */}
            {/* {item.selling_categories && item.selling_categories.length > 0 && (
                <View style={styles.categoriesRow}>
                    {item.selling_categories.slice(0, 3).map((category, index) => (
                        <Chip key={index} style={styles.categoryChip} textStyle={styles.categoryText}>
                            {category}
                        </Chip>
                    ))}
                    {item.selling_categories.length > 3 && (
                        <Text style={styles.moreText}>+{item.selling_categories.length - 3}</Text>
                    )}
                </View>
            )} */}

            <View style={styles.actionsRow}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        handleCall(item.contact);
                    }}
                >
                    <Icon source="phone-outline" size={18} color={colors.primary[600]} />
                    <Text style={styles.actionText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        handleEmail(item.email);
                    }}
                >
                    <Icon source="email-outline" size={18} color={colors.primary[600]} />
                    <Text style={styles.actionText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('BuyerSupplierDetails', { supplierId: item.id })}
                >
                    <Icon source="information-outline" size={18} color={colors.primary[600]} />
                    <Text style={styles.actionText}>Details</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const EmptyState = () => (
        <View style={styles.emptyState}>
            <Icon source="store-outline" size={64} color={colors.neutral.text.tertiary} />
            <Text style={styles.emptyTitle}>No Suppliers Found</Text>
            <Text style={styles.emptySubtitle}>
                {searchQuery ? 'Try adjusting your search' : 'No suppliers available'}
            </Text>
        </View>
    );

    const displaySuppliers = error ? [] : filteredSuppliers;

    return (
        <ErrorBoundary>
            <View style={styles.wrapper}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Icon source="arrow-left" size={24} color={colors.neutral.text.primary} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.headerLabel}>Directory</Text>
                            <Text style={styles.title}>Suppliers</Text>
                        </View>
                        {suppliers && suppliers.length > 0 && (
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{suppliers.length}</Text>
                            </View>
                        )}
                    </View>

                    {/* Search */}
                    <View style={styles.searchContainer}>
                        <Searchbar
                            mode="bar"
                            placeholder="Search suppliers..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={styles.searchbar}
                            iconColor={colors.neutral.text.tertiary}
                            inputStyle={styles.searchInput}
                            placeholderTextColor={colors.neutral.text.tertiary}
                            cursorColor={colors.primary[500]}
                            elevation={0}
                        />
                    </View>

                    {/* Supplier List */}
                    <FlatList
                        data={displaySuppliers}
                        renderItem={renderSupplier}
                        keyExtractor={(item) => item.id}
                        refreshing={isLoading}
                        onRefresh={refetch}
                        ListEmptyComponent={isLoading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </ErrorBoundary>
    );
};

export default BuyerSuppliersScreen;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.neutral.surface.default,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        paddingTop: spacing.xl,
        gap: spacing.md,
        backgroundColor: colors.neutral.surface.default,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerLabel: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
        textTransform: 'uppercase',
    },
    title: {
        ...typography.styles.h2,
        color: colors.neutral.text.primary,
    },
    countBadge: {
        backgroundColor: colors.primary[100],
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        minWidth: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: {
        color: colors.primary[700],
        fontSize: 12,
        fontWeight: 'bold',
    },
    searchContainer: {
        padding: spacing.lg,
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
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.xl,
    },
    supplierCard: {
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.base,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.neutral.border.default,
        ...shadows.sm,
    },
    supplierHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: colors.neutral.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    supplierName: {
        ...typography.styles.h4,
        color: colors.neutral.text.primary,
        marginBottom: spacing.xs,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    locationText: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
    },
    categoriesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginBottom: spacing.md,
    },
    categoryChip: {
        height: 24,
        backgroundColor: colors.primary[50],
    },
    categoryText: {
        fontSize: 11,
        color: colors.primary[700],
    },
    moreText: {
        ...typography.styles.caption,
        color: colors.neutral.text.tertiary,
        alignSelf: 'center',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.border.default,
        paddingTop: spacing.md,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.neutral.surface.sunken,
    },
    actionText: {
        ...typography.styles.caption,
        color: colors.primary[600],
        fontWeight: '600',
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
