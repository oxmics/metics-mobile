import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SupplierDashboardScreen from '../screens/Supplier/supplierDashboard';
import SupplierProductsScreen from '../screens/Supplier/products';
import SupplierRequestHistory from '../screens/Supplier/requestHistory';
import SupplierPurchaseOrderScreen from '../screens/Supplier/purchaseOrder';
import EnterNewPasswordScreen from '../screens/enterNewPassword';
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
