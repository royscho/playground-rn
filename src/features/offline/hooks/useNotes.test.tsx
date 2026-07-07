import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import * as notesApi from '../api/notes.api';
import { useCreateNote, useDeleteNote, useNotes } from './useNotes';

jest.mock('../api/notes.api');

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useNotes', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('fetches notes', async () => {
    (notesApi.fetchNotes as jest.Mock).mockResolvedValue([{ id: '1', title: 'a' }]);
    const { result } = renderHook(() => useNotes(), { wrapper });
    await waitFor(() => expect(result.current.data).toEqual([{ id: '1', title: 'a' }]));
  });

  it('useCreateNote optimistically adds then settles on success', async () => {
    (notesApi.fetchNotes as jest.Mock).mockResolvedValue([]);
    (notesApi.createNote as jest.Mock).mockResolvedValue({ id: '2', title: 'new' });
    queryClient.setQueryData(['notes'], []);

    const { result } = renderHook(() => useCreateNote(), { wrapper });
    act(() => result.current.mutate('new'));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(notesApi.createNote).toHaveBeenCalledWith('new', expect.anything());
  });

  it('useDeleteNote optimistically removes then settles on success', async () => {
    (notesApi.deleteNote as jest.Mock).mockResolvedValue(undefined);
    queryClient.setQueryData(['notes'], [{ id: '1', title: 'a' }]);

    const { result } = renderHook(() => useDeleteNote(), { wrapper });
    act(() => result.current.mutate('1'));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(notesApi.deleteNote).toHaveBeenCalledWith('1', expect.anything());
  });
});
