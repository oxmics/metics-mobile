import { Modal, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Icon, Portal, Switch, Text, useTheme } from "react-native-paper";
import useSupplierDashboard from "../../api/dashboard/useSupplierDashboard";
import useSupplierActivityLogs from "../../api/dashboard/useSupplierActivityLogs";
import { useEffect, useState, useContext } from "react";
import { OverviewCard } from "../../components/OverviewCard";
import { OrdersQuickActionCard, RFQQuickActionCard } from "../../components/QuickActionCard";
import { RecentUpdatesCard } from "../../components/RecentUpdatesCard";
import { RecentUpdatesModal } from "../../components/RecentUpdatesModal";
import { useNavigation } from "@react-navigation/native";
import { CustomNavigationProp } from "../../types/common";
import CustomDrawer from "../../components/SupplierDrawer";
import { BottomNavbar } from "../../components/BottomNavbar";
import { ThemeContext } from "../../themes/ThemeContext";

const SupplierDashboardScreen = () => {
    const navigation = useNavigation<CustomNavigationProp>();
    const { theme } = useContext(ThemeContext);

    const [drawerVisible, setDrawerVisible] = useState(false);

    const toggleDrawer = () => setDrawerVisible(!drawerVisible);

    const [isSupplier, setIsSupplier] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);

    const { data: dashboardContent, isPending: loading, refetch } = useSupplierDashboard();
    const { data: logs, isPending: loadingLogs, refetch: refetchLogs } = useSupplierActivityLogs();

    const handleHideModal = () => {
        setShowModal(false)
    }

    const handleShowModal = () => {
        setShowModal(true)
    }

    const handleRefetch = () => {
        refetch();
        refetchLogs();
    }

    useEffect(() => {
        if (!isSupplier) {
            navigation.replace('BuyerDashboard');
        }
    }, [isSupplier])

    const styles = getStyles(theme);

    return (
        <View style={{flex: 1, position: 'relative', backgroundColor: theme.colors.background}}>
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
                    />
                </View>
            </Modal>
            {(loading || loadingLogs) ? (<View style={styles.loadingContainer}><ActivityIndicator size={"large"} color={theme.colors.text}/></View>):(<ScrollView style={styles.container} refreshControl={
                <RefreshControl refreshing={loading || loadingLogs} onRefresh={handleRefetch} />
            }>
                <View style={styles.headerContainer}>
                    <View style={styles.menuBtnContainer}>
                        <TouchableOpacity onPress={toggleDrawer}><Icon source={"menu"} size={20} color={theme.colors.text}/></TouchableOpacity>
                        <Text style={styles.title}>Dashboard</Text>
                    </View>
                    <Switch 
                        value={!isSupplier} 
                        onValueChange={() => setIsSupplier(!isSupplier)} 
                        thumbColor={isSupplier ? "#7FAD5B" : "#D91616"} 
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Overview</Text>
                    {dashboardContent && (
                        <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
                            <OverviewCard title="Total Active Requests" value={dashboardContent.total_auctions_count} />
                            <OverviewCard title="Total Clients" value={dashboardContent.clients_count} />
                            <OverviewCard title="Purchase Orders" value={dashboardContent.supplier_purchase_orders_count} />
                        </ScrollView>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick action</Text>
                    <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
                        <RFQQuickActionCard />
                        <OrdersQuickActionCard />
                    </ScrollView>
                </View>

                <View style={styles.lastSection}>
                    <Text style={styles.sectionTitle}>Recent Updates</Text>
                    {logs && <RecentUpdatesCard viewAll={handleShowModal} logs={logs}/>}
                </View>
                <Portal>
                    {logs && <RecentUpdatesModal hideModal={handleHideModal} logs={logs} show={showModal}/>}
                </Portal>
            </ScrollView>)}
            <BottomNavbar isSupplier/>
        </View>
    );
};

export default SupplierDashboardScreen;

const getStyles = (theme) => StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        padding: 20,
        marginBottom: 20
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    menuBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        color: theme.colors.text,
        marginLeft: 16,
    },
    section: {
        marginTop: 16,
    },
    lastSection: {
        marginTop: 16,
        marginBottom: 120
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "400",
        color: theme.colors.text,
        marginBottom: 8,
        marginLeft: 16
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    overlay: {
        flex: 1,
    },
    drawerContainer: {
        width: '80%', 
        backgroundColor: theme.colors.background,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%'
    }
});
