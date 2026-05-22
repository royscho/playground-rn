import { createMMKV } from 'react-native-mmkv';
import { createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';

export const mmkvInstance = createMMKV();

const mmkvStateStorage: StateStorage = {
  getItem: (key) => mmkvInstance.getString(key) ?? null,
  setItem: (key, value) => mmkvInstance.set(key, value),
  removeItem: (key) => mmkvInstance.remove(key),
};

export const mmkvStorage = createJSONStorage(() => mmkvStateStorage);
