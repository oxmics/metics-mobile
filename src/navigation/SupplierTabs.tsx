import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SupplierDashboardScreen from '../screens/Supplier/supplierDashboard';
import SupplierProductsScreen from '../screens/Supplier/products';
import SupplierRequestHistory from '../screens/Supplier/requestHistory';
import SupplierPurchaseOrderScreen from '../screens/Supplier/purchaseOrder';
import EnterNewPasswordScreen from '../screens/enterNewPassword'; // Assuming Settings leads here or handled similarly?
// Actually Settings was just pushing EnterNewPassword in original BottomNavbar, which is odd.
// Let's assume there is a Settings screen or placeholder.
// The user's BottomNavbar had: Home, RFQs, Orders, Settings.
// Home -> SupplierDashboard
// RFQs -> SupplierRequestHistory
// Orders -> SupplierPurchaseOrder
// Settings -> EnterNewPassword (for now)

import { BottomNavbar } from '../components/BottomNavbar';

const Tab = createBottomTabNavigator();

const SupplierTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <BottomNavbar {...props} isSupplier={true} />}
        >
            <Tab.Screen name="SupplierDashboard" component={SupplierDashboardScreen} />
            <Tab.Screen name="SupplierProducts" component={SupplierProductsScreen} options={{ tabBarLabel: 'Products' }} />
            <Tab.Screen name="SupplierRequestHistory" component={SupplierRequestHistory} />
            <Tab.Screen name="SupplierPurchaseOrder" component={SupplierPurchaseOrderScreen} />
            <Tab.Screen name="EnterNewPassword" component={EnterNewPasswordScreen} options={{ tabBarLabel: 'Settings' }} />
        </Tab.Navigator>
    );
};

export default SupplierTabs;
