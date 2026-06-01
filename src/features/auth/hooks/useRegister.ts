import { useMutation } from '@tanstack/react-query';
import * as Keychain from 'react-native-keychain';
import { mockRegister } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';

export const useRegister = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => mockRegister(email, password, name),
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
