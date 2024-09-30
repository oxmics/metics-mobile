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
import BuyerDashboardScreen from './src/screens/buyerDashboard';
import SupplierDashboardScreen from './src/screens/supplierDashboard';

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
          <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
            <Stack.Screen name='Login' component={LoginScreen}/>
            <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen}/>
            <Stack.Screen name='Otp' component={OtpScreen}/>
            <Stack.Screen name='EnterNewPassword' component={EnterNewPasswordScreen}/>
            <Stack.Screen name='BuyerDashboard' component={BuyerDashboardScreen}/>
            <Stack.Screen name='SupplierDashboard' component={SupplierDashboardScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}

export default App;
