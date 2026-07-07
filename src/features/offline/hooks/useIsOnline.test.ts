import { act, renderHook } from '@testing-library/react-native';
import { onlineManager } from '@tanstack/react-query';
import { useIsOnline } from './useIsOnline';

describe('useIsOnline', () => {
  afterEach(() => act(() => onlineManager.setOnline(true)));

  it('reflects current onlineManager state', () => {
    const { result } = renderHook(() => useIsOnline());
    expect(result.current).toBe(true);
  });

  it('updates when onlineManager flips', () => {
    const { result } = renderHook(() => useIsOnline());
    act(() => onlineManager.setOnline(false));
    expect(result.current).toBe(false);
  });
});
