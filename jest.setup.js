/* eslint-env jest */
require('react-native-gesture-handler/jestSetup');
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  useNetInfo: jest.fn(() => ({ isConnected: true })),
}));

jest.mock('react-native-mmkv', () => {
  const store = new Map();
  const mockInstance = {
    getString: jest.fn((key) => store.get(key) ?? undefined),
    set: jest.fn((key, value) => store.set(key, value)),
    remove: jest.fn((key) => store.delete(key)),
    clearAll: jest.fn(() => store.clear()),
    contains: jest.fn((key) => store.has(key)),
  };
  return {
    createMMKV: jest.fn(() => mockInstance),
    useMMKV: jest.fn(() => mockInstance),
    useMMKVString: jest.fn(),
    useMMKVBoolean: jest.fn(),
    useMMKVNumber: jest.fn(),
  };
});
