import React from 'react';
import { act, renderHook } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePendingMutationsCount } from './usePendingMutationsCount';

describe('usePendingMutationsCount', () => {
  it('counts paused mutations', () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePendingMutationsCount(), { wrapper });
    expect(result.current).toBe(0);

    act(() => {
      queryClient.getMutationCache().build(
        queryClient,
        { mutationFn: async () => 'ok' },
        {
          context: undefined,
          data: undefined,
          error: null,
          failureCount: 0,
          failureReason: null,
          isPaused: true,
          status: 'pending',
          variables: undefined,
          submittedAt: Date.now(),
        },
      );
    });

    expect(result.current).toBe(1);
  });
});
