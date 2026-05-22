import React from 'react';
import { StatusBar } from 'react-native';
import { useThemeStore } from '@/features/settings/store/themeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const isDark = useThemeStore((s) => s.isDark);

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      {children}
    </>
  );
};
