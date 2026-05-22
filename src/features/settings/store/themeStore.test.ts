import { act } from 'react';
import { Appearance } from 'react-native';
import { useThemeStore } from './themeStore';

jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('light');

const getStore = () => useThemeStore.getState();

beforeEach(() => {
  useThemeStore.setState({ isDark: false });
});

describe('themeStore', () => {
  it('initializes with light mode when Appearance returns light', () => {
    expect(getStore().isDark).toBe(false);
  });

  it('toggleTheme flips isDark', () => {
    act(() => getStore().toggleTheme());
    expect(getStore().isDark).toBe(true);
    act(() => getStore().toggleTheme());
    expect(getStore().isDark).toBe(false);
  });

  it('setTheme sets isDark explicitly', () => {
    act(() => getStore().setTheme(true));
    expect(getStore().isDark).toBe(true);
    act(() => getStore().setTheme(false));
    expect(getStore().isDark).toBe(false);
  });
});
