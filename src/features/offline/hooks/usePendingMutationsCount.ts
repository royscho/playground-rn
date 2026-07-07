import { useSyncExternalStore } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const usePendingMutationsCount = () => {
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();

  return useSyncExternalStore(
    (callback) => mutationCache.subscribe(callback),
    () => mutationCache.getAll().filter((m) => m.state.isPaused).length,
  );
};
