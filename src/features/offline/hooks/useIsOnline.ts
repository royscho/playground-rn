import { useSyncExternalStore } from 'react';
import { onlineManager } from '@tanstack/react-query';

export const useIsOnline = () =>
  useSyncExternalStore(
    (callback) => onlineManager.subscribe(callback),
    () => onlineManager.isOnline(),
  );
