import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import * as notesApi from '../api/notes.api';
import { OfflineScreen } from './OfflineScreen';

jest.mock('../api/notes.api');
jest.mock('../hooks/useIsOnline', () => ({ useIsOnline: () => true }));
jest.mock('../hooks/usePendingMutationsCount', () => ({ usePendingMutationsCount: () => 0 }));

// Keep tests fast/deterministic — don't wait through the real retry backoff.
queryClient.setDefaultOptions({ queries: { retry: false }, mutations: { retry: false } });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </NavigationContainer>
);

describe('OfflineScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('shows loading state then renders notes', async () => {
    (notesApi.fetchNotes as jest.Mock).mockResolvedValue([{ id: '1', title: 'first note' }]);
    render(<OfflineScreen />, { wrapper });
    await waitFor(() => expect(screen.getByText('first note')).toBeTruthy());
  });

  it('shows error state when fetch fails with no cached data', async () => {
    (notesApi.fetchNotes as jest.Mock).mockRejectedValue(new Error('Network request failed'));
    render(<OfflineScreen />, { wrapper });
    await waitFor(() => expect(screen.getByText('Network request failed')).toBeTruthy());
  });

  it('adds a note via the footer input', async () => {
    (notesApi.fetchNotes as jest.Mock).mockResolvedValue([]);
    (notesApi.createNote as jest.Mock).mockResolvedValue({ id: '2', title: 'added' });
    render(<OfflineScreen />, { wrapper });

    const input = await screen.findByPlaceholderText('New note');
    fireEvent.changeText(input, 'added');
    fireEvent.press(screen.getByText('Add'));

    await waitFor(() => expect(screen.getByText('added')).toBeTruthy());
    await waitFor(() => expect(notesApi.createNote).toHaveBeenCalledWith('added', expect.anything()));
  });

  it('deletes a note', async () => {
    (notesApi.fetchNotes as jest.Mock).mockResolvedValue([{ id: '1', title: 'to delete' }]);
    (notesApi.deleteNote as jest.Mock).mockResolvedValue(undefined);
    render(<OfflineScreen />, { wrapper });

    await waitFor(() => expect(screen.getByText('to delete')).toBeTruthy());
    fireEvent.press(screen.getByText('Delete'));

    await waitFor(() => expect(notesApi.deleteNote).toHaveBeenCalledWith('1', expect.anything()));
  });
});
