import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React, {useContext, useEffect} from 'react';
import BootSplash from 'react-native-bootsplash';
import LoginScreen from './src/screens/login';
import ForgotPasswordScreen from './src/screens/forgotPassword';
import OtpScreen from './src/screens/otpScreen';
import {PaperProvider} from 'react-native-paper';
import EnterNewPasswordScreen from './src/screens/enterNewPassword';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from './src/screens/splash';
import SupplierPurchaseorderDetailsScreen from './src/screens/Supplier/purchaseOrderDetails';
import BuyerPurchaseorderDetailsScreen from './src/screens/Buyer/purchaseOrderDetails';
import SupplierRequestDetailsScreen from './src/screens/Supplier/requestDetails';
import BuyerRfqDetailsScreen from './src/screens/Buyer/rfqDetails';
import BuyerBidsDetailsScreen from './src/screens/Buyer/bidDetails';
import BuyerMain from './src/screens/Buyer/BuyerMain';
import SupplierMain from './src/screens/Supplier/SupplierMain';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import NetInfo from '@react-native-community/netinfo';
import {PermissionsAndroid, Platform} from 'react-native';
import { ThemeProvider, ThemeContext } from './src/themes/ThemeContext';

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

function AppNav() {
  const { theme } = useContext(ThemeContext);

  return (
    <PaperProvider theme={theme}>
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
            name="BuyerMain"
            component={BuyerMain}
          />
          <Stack.Screen
            name="SupplierMain"
            component={SupplierMain}
          />
          <Stack.Screen
            name="BuyerPurchaseOrderDetails"
            component={BuyerPurchaseorderDetailsScreen}
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
            name="SupplierPurchaseOrderDetails"
            component={SupplierPurchaseorderDetailsScreen}
          />
          <Stack.Screen
            name="SupplierRequestDetails"
            component={SupplierRequestDetailsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}


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
          // OneSignal.initialize('5802552b-795c-4ae9-94e2-5fb39eac035e');
          OneSignal.initialize('733e03ce-8e15-4bbf-bd8b-b4f9d1df8f6d');
          // 733e03ce-8e15-4bbf-bd8b-b4f9d1df8f6d
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

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppNav />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
