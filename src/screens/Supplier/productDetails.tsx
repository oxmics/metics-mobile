import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, StatusBar, Image, FlatList, TouchableOpacity } from 'react-native';
import { Text, Icon, ActivityIndicator, Chip } from 'react-native-paper';
import useSupplierProductDetails from '../../api/products/useSupplierProductDetails';
import { RootStackParamList } from '../../types/common';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';

type ScreenRouteProp = RouteProp<RootStackParamList, 'SupplierProductDetails'>;

const SupplierProductDetailsScreen = () => {
    const route = useRoute<ScreenRouteProp>();
    const navigation = useNavigation();
    const { id } = route.params;

    const { data: product, isPending: loading, isError } = useSupplierProductDetails(id);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator color={colors.primary[500]} />
            </View>
        );
    }

    if (isError || !product) {
        return (
            <View style={styles.centerContainer}>
                <Text>Failed to load product details</Text>
            </View>
        );
    }

    return (
        <ErrorBoundary name="SupplierProductDetailsScreen">
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: spacing.md }}>
                        <Icon
                            source="arrow-left"
                            size={24}
                            color={colors.neutral.text.secondary}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Product Details</Text>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => navigation.navigate('SupplierProductEdit', { id })}>
                        <Icon source="pencil" size={24} color={colors.primary[500]} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {/* Images */}
                    {product.images && product.images.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                            {product.images.filter(img => img?.image).map((img, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: img.image }}
                                    style={styles.productImage}
                                    resizeMode="cover"
                                />
                            ))}
                        </ScrollView>
                    ) : (
                        <View style={styles.noImageContainer}>
                            <Icon source="image-off-outline" size={48} color={colors.neutral.text.tertiary} />
                        </View>
                    )}

                    <View style={styles.body}>
                        <View style={styles.row}>
                            <Chip mode="outlined" style={styles.chip}>{product.product_sub_category}</Chip>
                            <Text style={styles.price}>{product.currency || 'USD'} {product.market_price}</Text>
                        </View>

                        <Text style={styles.title}>{product.name}</Text>
                        <Text style={styles.description}>{product.description}</Text>

                        <View style={styles.divider} />

                        <Text style={styles.sectionTitle}>Details</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Base Item ID</Text>
                            <Text style={styles.detailValue}>{product.base_item_id}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Unit of Issue</Text>
                            <Text style={styles.detailValue}>{product.unit_of_issue}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Status</Text>
                            <Text style={[styles.detailValue, { color: product.is_available ? colors.semantic.success.default : colors.semantic.error.default }]}>
                                {product.is_available ? 'Available' : 'Unavailable'}
                            </Text>
                        </View>

                        {/* Additional Attributes */}
                        {product.additional_attributes && product.additional_attributes.length > 0 && (
                            <>
                                <View style={styles.divider} />
                                <Text style={styles.sectionTitle}>Attributes</Text>
                                {product.additional_attributes.map((attr, index) => (
                                    <View key={index} style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>{attr.name}</Text>
                                        <Text style={styles.detailValue}>{attr.value}</Text>
                                    </View>
                                ))}
                            </>
                        )}
                    </View>
                </ScrollView>
            </View>
        </ErrorBoundary>
    );
};

export default SupplierProductDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral.surface.default,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    headerTitle: {
        ...typography.styles.h4,
    },
    content: {
        paddingBottom: spacing['3xl'],
    },
    imageScroll: {
        marginTop: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    productImage: {
        width: 250,
        height: 180,
        marginRight: spacing.md,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.neutral.surface.sunken,
    },
    noImageContainer: {
        height: 180,
        margin: spacing.lg,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.neutral.surface.sunken,
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        padding: spacing.lg,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    chip: {
        backgroundColor: colors.neutral.surface.sunken,
    },
    price: {
        ...typography.styles.h3,
        color: colors.primary[500],
    },
    title: {
        ...typography.styles.h3,
        marginBottom: spacing.sm,
    },
    description: {
        ...typography.styles.body,
        color: colors.neutral.text.secondary,
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: colors.neutral.border.default,
        marginVertical: spacing.lg,
    },
    sectionTitle: {
        ...typography.styles.h4,
        marginBottom: spacing.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    detailLabel: {
        ...typography.styles.body,
        color: colors.neutral.text.secondary,
    },
    detailValue: {
        ...typography.styles.body,
        fontWeight: '500',
    },
});
