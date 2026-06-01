import * as Keychain from 'react-native-keychain';
import { useAuthStore } from '../store/authStore';

export const useLogout = () => {
  const { logout } = useAuthStore();

  return async () => {
    try {
      await Keychain.resetGenericPassword();
    } catch {
      // Soft fail — don't block logout if keychain clear fails
    }
    logout();
  };
};
