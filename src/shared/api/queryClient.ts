import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    // Persisted data must outlive gcTime, or it gets dropped before rehydration.
    queries: { gcTime: 1000 * 60 * 60 * 24 },
  },
});

export { queryClient };
