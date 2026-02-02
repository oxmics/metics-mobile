import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BuyerDashboardScreen from '../screens/Buyer/buyerDashboard';
import BuyerRfqHistoryScreen from '../screens/Buyer/rfqHistory';
import BuyerPurchaseOrderScreen from '../screens/Buyer/purchaseOrder';
import EnterNewPasswordScreen from '../screens/enterNewPassword';
import { BottomNavbar } from '../components/BottomNavbar';

const Tab = createBottomTabNavigator();

const BuyerTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <BottomNavbar {...props} isSupplier={false} />}
        >
            <Tab.Screen name="BuyerDashboard" component={BuyerDashboardScreen} />
            <Tab.Screen name="BuyerRfqHistory" component={BuyerRfqHistoryScreen} />
            <Tab.Screen name="BuyerPurchaseOrder" component={BuyerPurchaseOrderScreen} />
            <Tab.Screen name="EnterNewPassword" component={EnterNewPasswordScreen} options={{ tabBarLabel: 'Settings' }} />
        </Tab.Navigator>
    );
};

export default BuyerTabs;
