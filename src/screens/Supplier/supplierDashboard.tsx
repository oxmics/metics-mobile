import { Modal, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View, StatusBar } from 'react-native';
import { Icon, Portal, Text, Button } from 'react-native-paper';
import useSupplierDashboard from '../../api/dashboard/useSupplierDashboard';
import useSupplierActivityLogs from '../../api/dashboard/useSupplierActivityLogs';
import { useState, useCallback } from 'react';
import { OverviewCard } from '../../components/OverviewCard';
import { OrdersQuickActionCard, RFQQuickActionCard } from '../../components/QuickActionCard';
import { RecentUpdatesCard } from '../../components/RecentUpdatesCard';
import { RecentUpdatesModal } from '../../components/RecentUpdatesModal';
import { useNavigation } from '@react-navigation/native';
import { CustomNavigationProp } from '../../types/common';
import CustomDrawer from '../../components/SupplierDrawer';
import { BottomNavbar } from '../../components/BottomNavbar';
import { colors, spacing, borderRadius, shadows, typography } from '../../theme';
import { Skeleton } from '../../components/Skeleton';

const SupplierDashboardScreen = () => {
    console.log('SupplierDashboardScreen: Rendering');
    const navigation = useNavigation<CustomNavigationProp>();

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    const { data: dashboardContent, isPending: loading, refetch, isError: dashboardError } = useSupplierDashboard();
    const { data: logs, isPending: loadingLogs, refetch: refetchLogs, isError: logsError } = useSupplierActivityLogs();

    const toggleDrawer = () => setDrawerVisible(!drawerVisible);
    const handleHideModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([refetch(), refetchLogs()]);
        setRefreshing(false);
    }, [refetch, refetchLogs]);

    const handleSwitchToBuyer = () => {
        navigation.replace('BuyerDashboard');
    };

    const isLoading = loading || loadingLogs;
    const hasError = dashboardError || logsError;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.sunken} />

            <Modal
                transparent={true}
                visible={drawerVisible}
                animationType="fade"
                onRequestClose={toggleDrawer}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.drawerContainer}>
                        <CustomDrawer closeDrawer={toggleDrawer} />
                    </View>
                    <TouchableOpacity
                        style={styles.overlay}
                        onPress={toggleDrawer}
                        activeOpacity={1}
                    />
                </View>
            </Modal>

            <View style={styles.contentContainer}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary[500]}
                            colors={[colors.primary[500]]}
                        />
                    }
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity
                                onPress={toggleDrawer}
                                style={styles.menuButton}
                                activeOpacity={0.7}
                            >
                                <Icon source="menu" size={24} color={colors.neutral.text.primary} />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.welcomeLabel}>Supplier Portal</Text>
                                <Text style={styles.title}>Dashboard</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={handleSwitchToBuyer}
                            style={styles.switchButton}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.switchButtonText}>Switch to Buyer</Text>
                            <Icon source="chevron-right" size={16} color={colors.semantic.success.dark} />
                        </TouchableOpacity>
                    </View>

                    {hasError && !isLoading && (
                        <View style={styles.errorContainer}>
                            <Icon source="alert-circle-outline" size={48} color={colors.semantic.error.default} />
                            <Text style={styles.errorText}>Failed to load dashboard data</Text>
                            <Button mode="outlined" onPress={onRefresh} style={styles.retryButton}>
                                Retry
                            </Button>
                        </View>
                    )}

                    {!hasError && (
                        <>
                            {/* Overview Section */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Overview</Text>
                                {isLoading ? (
                                    <View style={styles.skeletonRow}>
                                        <Skeleton width={140} height={100} style={{ marginRight: spacing.md }} />
                                        <Skeleton width={140} height={100} style={{ marginRight: spacing.md }} />
                                        <Skeleton width={140} height={100} />
                                    </View>
                                ) : (
                                    dashboardContent && (
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={styles.horizontalScroll}
                                        >
                                            <OverviewCard
                                                title="Requests"
                                                value={dashboardContent?.total_auctions_count}
                                                accentColor={colors.primary[500]}
                                            />
                                            <OverviewCard
                                                title="Clients"
                                                value={dashboardContent?.clients_count}
                                                accentColor={colors.semantic.info.default}
                                            />
                                            <OverviewCard
                                                title="Orders"
                                                value={dashboardContent?.supplier_purchase_orders_count}
                                                accentColor={colors.semantic.success.default}
                                            />
                                        </ScrollView>
                                    )
                                )}
                            </View>

                            {/* Quick Actions Section */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Quick Actions</Text>
                                {isLoading ? (
                                    <View style={styles.skeletonRow}>
                                        <Skeleton width={150} height={64} style={{ marginRight: spacing.md }} />
                                        <Skeleton width={150} height={64} />
                                    </View>
                                ) : (
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.horizontalScroll}
                                    >
                                        <RFQQuickActionCard />
                                        <OrdersQuickActionCard />
                                    </ScrollView>
                                )}
                            </View>

                            {/* Recent Updates Section */}
                            <View style={styles.lastSection}>
                                {isLoading ? (
                                    <View>
                                        <Skeleton width={120} height={20} style={{ marginBottom: spacing.md }} />
                                        <Skeleton width="100%" height={80} style={{ marginBottom: spacing.sm }} />
                                        <Skeleton width="100%" height={80} />
                                    </View>
                                ) : (
                                    logs && <RecentUpdatesCard viewAll={handleShowModal} logs={logs} />
                                )}
                            </View>
                        </>
                    )}
                </ScrollView>

                <Portal>
                    {logs && <RecentUpdatesModal hideModal={handleHideModal} logs={logs} show={showModal} />}
                </Portal>

                <BottomNavbar isSupplier />
            </View>
        </View>
    );
};

export default SupplierDashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral.surface.sunken,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing['2xl'],
        paddingBottom: spacing.lg,
        backgroundColor: colors.neutral.surface.default,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.border.default,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    welcomeLabel: {
        fontSize: 12,
        color: colors.neutral.text.secondary,
        marginBottom: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.neutral.text.primary,
    },
    switchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.semantic.success.light,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.semantic.success.default,
    },
    switchButtonText: {
        fontSize: 12,
        color: colors.semantic.success.dark,
        fontWeight: '600',
        marginRight: spacing.xs,
    },
    section: {
        marginTop: spacing.lg,
    },
    lastSection: {
        marginTop: spacing.lg,
        paddingHorizontal: spacing.xl,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.neutral.text.secondary,
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.md,
    },
    horizontalScroll: {
        paddingHorizontal: spacing.xl,
    },
    skeletonRow: {
        flexDirection: 'row',
        paddingHorizontal: spacing.xl,
    },
    modalContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(9, 30, 66, 0.54)',
    },
    overlay: {
        flex: 1,
    },
    drawerContainer: {
        width: '80%',
        backgroundColor: colors.neutral.surface.default,
        ...shadows.lg,
    },
    errorContainer: {
        padding: spacing['3xl'],
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        ...typography.styles.body,
        color: colors.neutral.text.secondary,
        marginTop: spacing.md,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: spacing.lg,
        borderColor: colors.primary[500],
    },
});
