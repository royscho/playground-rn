import { act, renderHook } from '@testing-library/react-native';
import { useAuthStore } from './authStore';

const resetStore = () =>
  useAuthStore.setState({ user: null, token: null });

const mockUser = { id: 'user_1', email: 'test@example.com', name: 'test' };

beforeEach(() => resetStore());

describe('authStore', () => {
  it('has null initial state', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('login sets user and token', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.login(mockUser, 'tok_123');
    });
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('tok_123');
  });

  it('logout clears user and token', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.login(mockUser, 'tok_123');
      result.current.logout();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });
});
