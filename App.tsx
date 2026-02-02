import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react';
import BootSplash from 'react-native-bootsplash';
import LoginScreen from './src/screens/login';
import ForgotPasswordScreen from './src/screens/forgotPassword';
import OtpScreen from './src/screens/otpScreen';
import { PaperProvider } from 'react-native-paper';
import { paperTheme } from './src/theme/paperTheme';
import EnterNewPasswordScreen from './src/screens/enterNewPassword';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BuyerDashboardScreen from './src/screens/Buyer/buyerDashboard';
import SupplierDashboardScreen from './src/screens/Supplier/supplierDashboard';
import SupplierPurchaseOrderScreen from './src/screens/Supplier/purchaseOrder';
import SplashScreen from './src/screens/splash';
import SupplierPurchaseorderDetailsScreen from './src/screens/Supplier/purchaseOrderDetails';
import BuyerPurchaseOrderScreen from './src/screens/Buyer/purchaseOrder';
import BuyerPurchaseorderDetailsScreen from './src/screens/Buyer/purchaseOrderDetails';
import SupplierRequestHistory from './src/screens/Supplier/requestHistory';
import SupplierRequestDetailsScreen from './src/screens/Supplier/requestDetails';
import BuyerRfqHistoryScreen from './src/screens/Buyer/rfqHistory';
import BuyerRfqDetailsScreen from './src/screens/Buyer/rfqDetails';
import BuyerBidsDetailsScreen from './src/screens/Buyer/bidDetails';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import NetInfo from '@react-native-community/netinfo';
import { PermissionsAndroid, Platform, UIManager } from 'react-native';
import SupplierTabs from './src/navigation/SupplierTabs';
import BuyerTabs from './src/navigation/BuyerTabs';

const queryClient = new QueryClient();

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function App(): React.JSX.Element {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Hide BootSplash after app initialization
    console.log('App.tsx: Attempting to hide BootSplash');
    setTimeout(() => {
      BootSplash.hide({ fade: true })
        .then(() => console.log('App.tsx: BootSplash hidden successfully'))
        .catch(err => console.error('App.tsx: BootSplash hide error', err));
    }, 500);

    if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )
        .then(result => {
          console.log('Notification permission granted:', result);
        })
        .catch(err => {
          console.error('Notification permission error:', err);
        });
    }

    // Check network connectivity and initialize OneSignal
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        console.log('Device is online');
        if (!isInitialized.current) {
          console.log('Initializing OneSignal...');
          OneSignal.initialize('733e03ce-8e15-4bbf-bd8b-b4f9d1df8f6d');
          OneSignal.Notifications.requestPermission(true);
          isInitialized.current = true;
        }
      } else {
        console.log('Device is offline. Skipping OneSignal initialization.');
      }
    });

    // Debugging logs
    OneSignal.Debug.setLogLevel(LogLevel.Debug);
  }, []);

  // Add event listener for notification clicks
  useEffect(() => {
    const clickListener = (event: any) => {
      console.log('OneSignal: notification clicked:', event);
    };
    OneSignal.Notifications.addEventListener('click', clickListener);

    return () => {
      OneSignal.Notifications.removeEventListener('click', clickListener);
    };
  }, []);
  const Stack = createNativeStackNavigator();

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen name="Otp" component={OtpScreen} />
            <Stack.Screen
              name="EnterNewPassword"
              component={EnterNewPasswordScreen}
            />
            <Stack.Screen name="SupplierTabs" component={SupplierTabs} />
            <Stack.Screen name="BuyerTabs" component={BuyerTabs} />

            <Stack.Screen
              name="SupplierRequestDetails"
              component={SupplierRequestDetailsScreen}
            />
            <Stack.Screen
              name="BuyerRfqDetails"
              component={BuyerRfqDetailsScreen}
            />
            <Stack.Screen
              name="BuyerBidsDetails"
              component={BuyerBidsDetailsScreen}
            />
            <Stack.Screen
              name="SupplierPurchaseorderDetails"
              component={SupplierPurchaseorderDetailsScreen}
            />
            <Stack.Screen
              name="BuyerPurchaseOrderDetails"
              component={BuyerPurchaseorderDetailsScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}

export default App;
