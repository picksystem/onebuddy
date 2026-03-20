/**
 * OneBuddy — Customer Mobile App
 *
 * React Native application for the OneBuddy customer portal.
 * Runs on Android and iOS.
 *
 * Metro bundler port : 8081
 * API target         : http://localhost:3001  (dev)
 *
 * Screen flow:
 *   WelcomeScreen → SignInScreen / SignUpScreen → DashboardNavigator (bottom tabs)
 *     ├─ HomeScreen     — quick booking entry + search bar
 *     ├─ BookingScreen  — full ride / service booking form
 *     ├─ TripsScreen    — trip history + live tracking
 *     └─ ProfileScreen  — account, addresses, payments
 */
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => (
  <SafeAreaProvider>
    <AppNavigator />
  </SafeAreaProvider>
);

export default App;
