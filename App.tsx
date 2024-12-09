import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React, {useEffect} from 'react';
import BootSplash from 'react-native-bootsplash';
import LoginScreen from './src/screens/login';
import ForgotPasswordScreen from './src/screens/forgotPassword';
import OtpScreen from './src/screens/otpScreen';
import {PaperProvider} from 'react-native-paper';
import EnterNewPasswordScreen from './src/screens/enterNewPassword';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
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
import {LogLevel, OneSignal} from 'react-native-onesignal';
import NetInfo from '@react-native-community/netinfo';
import {PermissionsAndroid, Platform} from 'react-native';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
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
  let oneSignalInitialized = false;
  useEffect(() => {
    // Hide BootSplash after app initialization
    BootSplash.hide({fade: true});

    // Check network connectivity and initialize OneSignal
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        console.log('Device is online');
        if (!oneSignalInitialized) {
          console.log('Initializing OneSignal...');
          OneSignal.initialize('5802552b-795c-4ae9-94e2-5fb39eac035e');
          OneSignal.Notifications.requestPermission(true);
          oneSignalInitialized = true; // Set flag to true after initialization
        }
      } else {
        console.log('Device is offline. Skipping OneSignal initialization.');
      }
    });
  }, []);

  // Debugging logs
  OneSignal.Debug.setLogLevel(LogLevel.Debug);

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
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              animationTypeForReplace: 'pop',
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
            <Stack.Screen
              name="BuyerDashboard"
              component={BuyerDashboardScreen}
            />
            <Stack.Screen
              name="BuyerPurchaseOrder"
              component={BuyerPurchaseOrderScreen}
            />
            <Stack.Screen
              name="BuyerPurchaseOrderDetails"
              component={BuyerPurchaseorderDetailsScreen}
            />
            <Stack.Screen
              name="BuyerRfqHistory"
              component={BuyerRfqHistoryScreen}
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
              name="SupplierDashboard"
              component={SupplierDashboardScreen}
            />
            <Stack.Screen
              name="SupplierPurchaseOrder"
              component={SupplierPurchaseOrderScreen}
            />
            <Stack.Screen
              name="SupplierPurchaseOrderDetails"
              component={SupplierPurchaseorderDetailsScreen}
            />
            <Stack.Screen
              name="SupplierRequestHistory"
              component={SupplierRequestHistory}
            />
            <Stack.Screen
              name="SupplierRequestDetails"
              component={SupplierRequestDetailsScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}

export default App;
