import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { queryClient } from '@/shared/api/queryClient';
import { OfflineBanner } from './OfflineBanner';

jest.mock('../hooks/useIsOnline');
jest.mock('../hooks/usePendingMutationsCount');

import { useIsOnline } from '../hooks/useIsOnline';
import { usePendingMutationsCount } from '../hooks/usePendingMutationsCount';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </NavigationContainer>
);

describe('OfflineBanner', () => {
  it('shows Online pill when online', () => {
    (useIsOnline as jest.Mock).mockReturnValue(true);
    (usePendingMutationsCount as jest.Mock).mockReturnValue(0);
    render(<OfflineBanner />, { wrapper });
    expect(screen.getByText('Online')).toBeTruthy();
    expect(screen.queryByText(/pending sync/)).toBeNull();
  });

  it('shows Offline pill and pending count when offline with queued mutations', () => {
    (useIsOnline as jest.Mock).mockReturnValue(false);
    (usePendingMutationsCount as jest.Mock).mockReturnValue(2);
    render(<OfflineBanner />, { wrapper });
    expect(screen.getByText('Offline')).toBeTruthy();
    expect(screen.getByText('2 pending sync')).toBeTruthy();
  });
});
