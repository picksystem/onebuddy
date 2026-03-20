import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/Welcome/WelcomeScreen';
import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import DashboardNavigator from './DashboardNavigator';

export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * AppNavigator — root navigation for the OneBuddy Customer mobile app.
 *
 * Flow:
 *   Welcome → SignIn / SignUp → Dashboard (bottom tabs)
 */
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Welcome' component={WelcomeScreen} />
      <Stack.Screen name='SignIn' component={SignInScreen} />
      <Stack.Screen name='SignUp' component={SignUpScreen} />
      <Stack.Screen name='Dashboard' component={DashboardNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
