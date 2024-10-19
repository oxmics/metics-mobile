import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';

import BootSplash from 'react-native-bootsplash';
import LoginScreen from './src/screens/login';
import ForgotPasswordScreen from './src/screens/forgotPassword';
import OtpScreen from './src/screens/otpScreen';
import { PaperProvider } from 'react-native-paper';
import EnterNewPasswordScreen from './src/screens/enterNewPassword';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BuyerDashboardScreen from './src/screens/Buyer/buyerDashboard';
import SupplierDashboardScreen from './src/screens/Supplier/supplierDashboard';
import SupplierPurchaseOrderScreen from './src/screens/Supplier/purchaseOrder';
import SplashScreen from './src/screens/splash';
import PurchaseorderDetailsScreen from './src/screens/Supplier/purchaseOrderDetails';
import BuyerPurchaseOrderScreen from './src/screens/Buyer/purchaseOrder';
import BuyerPurchaseorderDetailsScreen from './src/screens/Buyer/purchaseOrderDetails';

const queryClient = new QueryClient();

function App(): React.JSX.Element {;
  useEffect(() => {
    BootSplash.hide({fade: true});
  }, []);

  const Stack = createNativeStackNavigator();

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Splash' screenOptions={{headerShown: false, animation: 'slide_from_right', animationTypeForReplace: 'pop'}}>
            <Stack.Screen name='Splash' component={SplashScreen}/>
            <Stack.Screen name='Login' component={LoginScreen}/>
            <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen}/>
            <Stack.Screen name='Otp' component={OtpScreen}/>
            <Stack.Screen name='EnterNewPassword' component={EnterNewPasswordScreen}/>
            <Stack.Screen name='BuyerDashboard' component={BuyerDashboardScreen}/>
            <Stack.Screen name='BuyerPurchaseOrder' component={BuyerPurchaseOrderScreen}/>
            <Stack.Screen name='BuyerPurchaseOrderDetails' component={BuyerPurchaseorderDetailsScreen}/>
            <Stack.Screen name='SupplierDashboard' component={SupplierDashboardScreen}/>
            <Stack.Screen name='SupplierPurchaseOrder' component={SupplierPurchaseOrderScreen}/>
            <Stack.Screen name='SupplierPurchaseOrderDetails' component={SupplierPurchaseOrderScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}

export default App;
