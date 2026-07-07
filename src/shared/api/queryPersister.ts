import type { Persister } from '@tanstack/react-query-persist-client';
import { mmkvInstance } from '@/shared/storage';

const CACHE_KEY = 'query-cache';

export const mmkvPersister: Persister = {
  persistClient: (client) => {
    mmkvInstance.set(CACHE_KEY, JSON.stringify(client));
  },
  restoreClient: () => {
    const cached = mmkvInstance.getString(CACHE_KEY);
    return cached ? JSON.parse(cached) : undefined;
  },
  removeClient: () => {
    mmkvInstance.remove(CACHE_KEY);
  },
};
