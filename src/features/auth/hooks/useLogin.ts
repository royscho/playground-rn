import { useMutation } from '@tanstack/react-query';
import * as Keychain from 'react-native-keychain';
import { mockLogin } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      mockLogin(email, password),
    onSuccess: async ({ user, token }) => {
      try {
        await Keychain.setGenericPassword(user.email, token);
      } catch {
        throw new Error('Failed to save credentials securely. Please try again.');
      }
      login(user, token);
    },
  });
};
