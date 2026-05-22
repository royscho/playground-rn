import { Appearance } from 'react-native';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { mmkvStorage } from '@/shared/storage';

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set) => ({
        isDark: Appearance.getColorScheme() === 'dark',
        toggleTheme: () =>
          set((s) => ({ isDark: !s.isDark }), false, 'theme/toggle'),
        setTheme: (isDark) => set({ isDark }, false, 'theme/set'),
      }),
      { name: 'theme-store', storage: mmkvStorage },
    ),
    { name: 'ThemeStore' },
  ),
);
