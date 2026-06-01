import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Keychain from 'react-native-keychain';
import { mmkvInstance } from '@/shared/storage';
import type { RootStackParamList } from './types';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator, useAuthStore } from '@/features/auth';

const Stack = createNativeStackNavigator<RootStackParamList>();

const FIRST_LAUNCH_KEY = 'app_launched_before';

const useFirstLaunchKeychainReset = () => {
  useEffect(() => {
    const hasLaunchedBefore = mmkvInstance.getBoolean(FIRST_LAUNCH_KEY);
    if (!hasLaunchedBefore) {
      Keychain.resetGenericPassword().catch(() => {});
      mmkvInstance.set(FIRST_LAUNCH_KEY, true);
    }
  }, []);
};

export const RootNavigator = () => {
  useFirstLaunchKeychainReset();
  const token = useAuthStore(s => s.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="AppDrawer" component={AppNavigator} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};
