import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import { createNote, deleteNote, fetchNotes } from '../api/notes.api';
import type { Note } from '../types/notes.types';

const NOTES_KEY = ['notes'] as const;
const CREATE_NOTE_KEY = ['notes', 'create'] as const;
const DELETE_NOTE_KEY = ['notes', 'delete'] as const;

interface MutationContext {
  previous: Note[] | undefined;
  tempId: string;
}

// Registered at module load, not inside a hook: PersistQueryClientProvider
// rehydrates mutations from disk before any screen has mounted, and
// QueryClient.defaultMutationOptions() merges these defaults into the
// rebuilt mutation exactly once (then freezes via `_defaulted`). Registering
// them lazily inside useCreateNote/useDeleteNote meant a mutation restored
// after an app restart got built with `mutationFn: undefined` permanently —
// resumePausedMutations() would call it and silently no-op forever.
queryClient.setMutationDefaults(CREATE_NOTE_KEY, {
  mutationFn: createNote,
  onMutate: async (title: string) => {
    await queryClient.cancelQueries({ queryKey: NOTES_KEY });
    const previous = queryClient.getQueryData<Note[]>(NOTES_KEY);
    const tempId = `optimistic-${Date.now()}`;
    queryClient.setQueryData<Note[]>(NOTES_KEY, (old) => [{ id: tempId, title }, ...(old ?? [])]);
    return { previous, tempId };
  },
  // No onSettled/invalidateQueries: JSONPlaceholder is a fake API that never
  // actually persists writes, so a refetch after create would silently drop
  // this note again. Swap the optimistic placeholder for the real response
  // in place instead of trusting a refetch to reflect it.
  onSuccess: (created, _title, context) => {
    queryClient.setQueryData<Note[]>(NOTES_KEY, (old) =>
      old?.map((note) => (note.id === context?.tempId ? created : note)),
    );
  },
  onError: (_err, _title, context) => {
    if (context?.previous) queryClient.setQueryData(NOTES_KEY, context.previous);
  },
});

queryClient.setMutationDefaults(DELETE_NOTE_KEY, {
  mutationFn: deleteNote,
  onMutate: async (id: string) => {
    await queryClient.cancelQueries({ queryKey: NOTES_KEY });
    const previous = queryClient.getQueryData<Note[]>(NOTES_KEY);
    queryClient.setQueryData<Note[]>(NOTES_KEY, (old) => old?.filter((note) => note.id !== id));
    return { previous };
  },
  // Same reasoning as create: JSONPlaceholder doesn't track deletes either,
  // so invalidating here would resurrect the "deleted" note on refetch.
  onError: (_err, _id, context) => {
    if (context?.previous) queryClient.setQueryData(NOTES_KEY, context.previous);
  },
});

export const useNotes = () => useQuery({ queryKey: NOTES_KEY, queryFn: fetchNotes });

export const useCreateNote = () =>
  useMutation<Note, Error, string, MutationContext>({
    mutationKey: CREATE_NOTE_KEY,
  });

export const useDeleteNote = () =>
  useMutation<void, Error, string, { previous: Note[] | undefined }>({
    mutationKey: DELETE_NOTE_KEY,
  });
