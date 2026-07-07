import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient } from '@/shared/api/queryClient';
import { mmkvPersister } from '@/shared/api/queryPersister';
import { RootNavigator } from '@/app/navigation/RootNavigator';
import { linking } from '@/app/navigation/linking';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { useThemeStore } from '@/features/settings/store/themeStore';
import { darkColors, lightColors } from '@/shared/theme/colors';
import '@/shared/api/networkConfig';

function App() {
  const isDark = useThemeStore((s) => s.isDark);

  const navTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: darkColors.primary,
          background: darkColors.background,
          card: darkColors.surface,
          text: darkColors.text,
          border: darkColors.border,
          notification: darkColors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: lightColors.primary,
          background: lightColors.background,
          card: lightColors.surface,
          text: lightColors.text,
          border: lightColors.border,
          notification: lightColors.primary,
        },
      };

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: mmkvPersister }}
          onSuccess={() => queryClient.resumePausedMutations()}
        >
          <NavigationContainer linking={linking} theme={navTheme}>
            <RootNavigator />
          </NavigationContainer>
        </PersistQueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
