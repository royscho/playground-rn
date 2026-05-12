import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { AppNavigator } from './AppNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

// TODO step 4: swap to auth-gated root (AuthStack | AppDrawer based on auth state)
export const RootNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AppDrawer" component={AppNavigator} />
  </Stack.Navigator>
);
