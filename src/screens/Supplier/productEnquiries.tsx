import { useNavigation } from '@react-navigation/native';
import { Icon, Text, ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import { useEffect, useState, useCallback, useRef } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, StatusBar, Animated } from 'react-native';
import useProductEnquiries from '../../api/products/useProductEnquiries';
import { ProductEnquiry } from '../../types/product';
import { DataCard } from '../../components/DataCard';
import { CustomNavigationProp } from '../../types/common';
import { colors, typography, spacing } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const EmptyState = () => (
    <View style={styles.emptyState}>
        <Icon source="clipboard-text-outline" size={48} color={colors.neutral.text.tertiary} />
        <Text style={styles.emptyTitle}>No Enquiries Found</Text>
        <Text style={styles.emptySubtitle}>Product enquiries will appear here.</Text>
    </View>
);

const SupplierProductEnquiriesScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { data: enquiries, isPending: loading, refetch } = useProductEnquiries();
    const [activeTab, setActiveTab] = useState('all');
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const [newEnquiries, setNewEnquiries] = useState<ProductEnquiry[]>([]);
    const [acknowledgedEnquiries, setAcknowledgedEnquiries] = useState<ProductEnquiry[]>([]);
    const [rejectedEnquiries, setRejectedEnquiries] = useState<ProductEnquiry[]>([]);

    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [activeTab, fadeAnim]);

    useEffect(() => {
        if (enquiries) {
            setNewEnquiries(enquiries.filter(e => e.int_status === 0));
            setAcknowledgedEnquiries(enquiries.filter(e => e.int_status === 1));
            setRejectedEnquiries(enquiries.filter(e => e.int_status === -1));
        }
    }, [enquiries]);

    const renderItem = ({ item }: { item: ProductEnquiry }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.push('SupplierProductEnquiryDetails', { id: item.id })}
        >
            <DataCard
                title={item.organisation_name}
                titleLabel="Requester"
                status={item.int_status === 1 ? 'ACKNOWLEDGED' : item.int_status === -1 ? 'REJECTED' : 'PENDING'}
                footerLeftText={`${item.items?.length || 0} items`}
                footerRightText={item.email}
            />
        </TouchableOpacity>
    );

    return (
        <ErrorBoundary name="SupplierProductEnquiriesScreen">
            <View style={styles.wrapper}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />

                <View style={styles.contentContainer}>
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.backButton}
                                activeOpacity={0.7}
                            >
                                <Icon size={24} source="arrow-left" color={colors.neutral.text.secondary} />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.headerLabel}>Products</Text>
                                <Text style={styles.title}>Enquiries</Text>
                            </View>
                        </View>

                        {/* Filter Tabs */}
                        <View style={styles.filterSection}>
                            <SegmentedButtons
                                value={activeTab}
                                onValueChange={setActiveTab}
                                buttons={[
                                    { value: 'all', label: 'All' },
                                    { value: 'new', label: 'New' },
                                    { value: 'acknowledged', label: 'Acknowledged' },
                                    { value: 'rejected', label: 'Rejected' },
                                ]}
                            />
                        </View>

                        <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
                            {activeTab === 'all' && (
                                <FlatList
                                    data={enquiries}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.id}
                                    refreshing={loading}
                                    onRefresh={refetch}
                                    ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                                    contentContainerStyle={styles.listContent}
                                    showsVerticalScrollIndicator={false}
                                />
                            )}
                            {activeTab === 'new' && (
                                <FlatList
                                    data={newEnquiries}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.id}
                                    refreshing={loading}
                                    onRefresh={refetch}
                                    ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                                    contentContainerStyle={styles.listContent}
                                    showsVerticalScrollIndicator={false}
                                />
                            )}
                            {activeTab === 'acknowledged' && (
                                <FlatList
                                    data={acknowledgedEnquiries}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.id}
                                    refreshing={loading}
                                    onRefresh={refetch}
                                    ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                                    contentContainerStyle={styles.listContent}
                                    showsVerticalScrollIndicator={false}
                                />
                            )}
                            {activeTab === 'rejected' && (
                                <FlatList
                                    data={rejectedEnquiries}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.id}
                                    refreshing={loading}
                                    onRefresh={refetch}
                                    ListEmptyComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary[500]} /> : <EmptyState />}
                                    contentContainerStyle={styles.listContent}
                                    showsVerticalScrollIndicator={false}
                                />
                            )}
                        </Animated.View>
                    </View>
                </View>
            </View>
        </ErrorBoundary>
    );
};

export default SupplierProductEnquiriesScreen;

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
    filterSection: {
        margin: spacing.md,
    },
    tabContent: {
        flex: 1,
        backgroundColor: colors.neutral.surface.sunken,
    },
});
