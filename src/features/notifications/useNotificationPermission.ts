import { useCallback, useEffect, useState } from 'react';
import notifee, { AuthorizationStatus } from '@notifee/react-native';

export const useNotificationPermission = () => {
  const [status, setStatus] = useState<AuthorizationStatus | null>(null);

  const refresh = useCallback(async () => {
    try {
      const settings = await notifee.getNotificationSettings();
      setStatus(settings.authorizationStatus);
    } catch {
      // Native module unavailable (e.g. not linked yet after a fresh
      // install without a pod install/rebuild) — leave status null rather
      // than crash the screen.
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const request = useCallback(async () => {
    try {
      const settings = await notifee.requestPermission();
      setStatus(settings.authorizationStatus);
    } catch {
      // Same native-module-unavailable guard as refresh() above.
    }
  }, []);

  const isGranted =
    status === AuthorizationStatus.AUTHORIZED ||
    status === AuthorizationStatus.PROVISIONAL;

  return { status, isGranted, request, refresh };
};
