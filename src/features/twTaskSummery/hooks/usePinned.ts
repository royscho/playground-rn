import { mmkvStorage } from '@/shared/storage';
import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type MetricPinnedState = {
  pinned: Set<string>;
  togglePinned: (id: string) => void;
};
enableMapSet();

export const usePinned = create<MetricPinnedState>()(
  devtools(
    persist(
      immer((set, get) => ({
        pinned: new Set(),
        togglePinned: (id: string) =>
          set(state => {
            if (get().pinned.has(id)) {
              state.pinned.delete(id);
            } else {
              state.pinned.add(id);
            }
          }),
      })),
      {
        name: 'pinned-store',
        storage: mmkvStorage,
        partialize: state => ({ pinned: Array.from(state.pinned) }),
        merge: (persisted, current) => ({
          ...current,
          pinned: new Set((persisted as { pinned?: string[] })?.pinned ?? []),
        }),
      },
    ),
  ),
);
