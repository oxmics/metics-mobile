import React from 'react';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import BuyerDashboardScreen from './buyerDashboard';
import BuyerRfqHistoryScreen from './rfqHistory';
import BuyerPurchaseOrderScreen from './purchaseOrder';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import { BlurView } from '@react-native-community/blur';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const BuyerMain = () => {
    const theme = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'RFQ') {
                        iconName = focused ? 'file-document' : 'file-document-outline';
                    } else if (route.name === 'Orders') {
                        iconName = focused ? 'briefcase' : 'briefcase-outline';
                    }

                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
            tabBar={(props) => (
                <BlurView
                    style={styles.blurView}
                    blurType="light"
                    blurAmount={10}
                    reducedTransparencyFallbackColor="white"
                >
                    <BottomTabBar {...props} />
                </BlurView>
            )}
        >
            <Tab.Screen name="Dashboard" component={BuyerDashboardScreen} />
            <Tab.Screen name="RFQ" component={BuyerRfqHistoryScreen} />
            <Tab.Screen name="Orders" component={BuyerPurchaseOrderScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    blurView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default BuyerMain;
