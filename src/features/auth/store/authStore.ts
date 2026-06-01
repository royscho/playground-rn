import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import * as Keychain from 'react-native-keychain';
import { mmkvStorage } from '@/shared/storage';
import { setAuthToken, configureClientInterceptors } from '@/shared/api/client';
import type { User } from '../types/auth.types';

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      set => ({
        user: null,
        token: null,
        login: (user, token) => {
          setAuthToken(token);
          set({ user, token }, false, 'auth/login');
        },
        logout: () => {
          setAuthToken(null);
          set({ user: null, token: null }, false, 'auth/logout');
        },
      }),
      {
        name: 'auth-store',
        storage: mmkvStorage,
        // Only persist non-sensitive user profile — token lives in keychain only
        partialize: state => ({ user: state.user }),
        onRehydrateStorage: () => async state => {
          if (state?.user) {
            try {
              const credentials = await Keychain.getGenericPassword();
              if (credentials) {
                const token = credentials.password;
                setAuthToken(token);
                useAuthStore.setState({ token }, false);
              } else {
                // Keychain entry missing after rehydrate — force re-login
                useAuthStore.getState().logout();
              }
            } catch {
              useAuthStore.getState().logout();
            }
          }
          configureClientInterceptors({
            // Replace with real refresh endpoint in step 6
            refreshToken: () => Promise.reject(new Error('No refresh endpoint')),
            logout: () => useAuthStore.getState().logout(),
          });
        },
      },
    ),
    { name: 'AuthStore' },
  ),
);
