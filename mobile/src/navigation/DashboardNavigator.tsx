import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/Dashboard/HomeScreen';
import BookingScreen from '../screens/Dashboard/BookingScreen';
import TripsScreen from '../screens/Dashboard/TripsScreen';
import ProfileScreen from '../screens/Dashboard/ProfileScreen';

export type DashboardTabParamList = {
  Home: undefined;
  Book: undefined;
  Trips: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<DashboardTabParamList>();

/**
 * DashboardNavigator — bottom tab bar shown after customer signs in.
 *
 * Tabs mirror the customer portal features:
 *   Home → quick ride booking entry
 *   Book → full booking form (vehicle type, bundle, destination)
 *   Trips → trip history / active trip tracking
 *   Profile → account settings, payments, addresses
 */
const DashboardNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: '#94a3b8',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopColor: 'rgba(0,0,0,0.06)',
        height: 60,
        paddingBottom: 8,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
    }}>
    <Tab.Screen name='Home' component={HomeScreen} />
    <Tab.Screen name='Book' component={BookingScreen} />
    <Tab.Screen name='Trips' component={TripsScreen} />
    <Tab.Screen name='Profile' component={ProfileScreen} />
  </Tab.Navigator>
);

export default DashboardNavigator;
