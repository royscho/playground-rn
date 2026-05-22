# Step 3 — Theme System and ScreenWrapper

## Task
Build design tokens (colors, spacing, typography), a Zustand + MMKV-persisted theme store for dark/light mode, a `useAppTheme()` hook, and a `ScreenWrapper` component that becomes the root of every screen.

---

## Files to create

| Path | Purpose |
|---|---|
| `src/shared/theme/colors.ts` | Light + dark color palettes |
| `src/shared/theme/spacing.ts` | Spacing scale xs→xxl |
| `src/shared/theme/typography.ts` | Type scale h1→caption |
| `src/shared/theme/index.ts` | Re-exports |
| `src/shared/storage/mmkv.ts` | MMKV instance + Zustand storage adapter |
| `src/shared/storage/index.ts` | Re-export |
| `src/features/settings/store/themeStore.ts` | Zustand store: `isDark`, `toggleTheme`, `setTheme` persisted in MMKV |
| `src/shared/hooks/useAppTheme.ts` | Returns `{ colors, spacing, typography }` for active theme |
| `src/shared/hooks/index.ts` | Re-exports |
| `src/shared/components/ScreenWrapper.tsx` | Screen root: themed header, scroll, padding, loading/error, footer |
| `src/shared/components/index.ts` | Re-exports |
| `src/app/providers/ThemeProvider.tsx` | StatusBar + background sync from themeStore |
| `docs/steps/03-theme/design.md` | This file |

## Files to modify

| Path | Change |
|---|---|
| `App.tsx` | Add `ThemeProvider`; remove `useColorScheme` |
| `src/app/navigation/AppNavigator.tsx` | `headerShown: false` on Drawer.Navigator |
| `src/features/home/HomeTabs.tsx` | `headerShown: false` on Tab.Navigator; themed tab bar colors |
| `src/features/posts/PostsNavigator.tsx` | `headerShown: false` on Stack.Navigator |
| `src/features/settings/screens/SettingsScreen.tsx` | Real theme toggle via themeStore |
| All other placeholder screens (20 files) | Replace `View` root with `ScreenWrapper` + themed text |

---

## ScreenWrapper config

Props used per screen type:

| Screen type | Props |
|---|---|
| Dashboard / Feed / Explore (tabs) | `title` |
| Settings | `title` |
| Todos, Animations, Forms, etc. (drawer) | `title`, `centered` (until real content added in later steps) |
| PostsList | `title` |
| PostDetail | `title`, `showBackButton` |
| Login / Register | `title`, `centered` |

Header structure (rendered when `title` is provided):
- Left: back chevron when `showBackButton={true}` (calls `navigation.goBack()`)
- Center: title + subtitle (subtitle sits below title, smaller weight)
- Right: `headerRight` node

No headerLeft for drawer root screens — users open drawer via swipe gesture. Proper drawer toggle button added in a future step.

---

## State approach

- **Server data** → none in this step
- **Global UI** → Zustand `themeStore`:
  - `isDark: boolean` (default: follows `Appearance.getColorScheme()`)
  - `toggleTheme()` — flips `isDark`
  - `setTheme(isDark: boolean)` — explicit set
  - Persisted in MMKV via `zustand/middleware/persist`
- **Local** → none
- **Forms** → none

`useAppTheme()` reads `themeStore.isDark` and returns the correct token set. Zero component re-renders beyond what Zustand already batches.

---

## Design tokens

### colors.ts
```ts
type ColorTokens = {
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  success: string;
  error: string;
  warning: string;
};

export const lightColors: ColorTokens = {
  background: '#FFFFFF',
  surface: '#F1F5F9',
  surfaceVariant: '#E2E8F0',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#CBD5E1',
  primary: '#6C63FF',
  primaryForeground: '#FFFFFF',
  secondary: '#FF6584',
  success: '#43A047',
  error: '#E53935',
  warning: '#FB8C00',
};

export const darkColors: ColorTokens = {
  background: '#0F1117',
  surface: '#1A1F2E',
  surfaceVariant: '#2D3748',
  text: '#E2E8F0',
  textSecondary: '#94A3B8',
  border: '#334155',
  primary: '#6C63FF',
  primaryForeground: '#FFFFFF',
  secondary: '#FF6584',
  success: '#43A047',
  error: '#E53935',
  warning: '#FB8C00',
};
```

### spacing.ts
```ts
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
```

### typography.ts
```ts
export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  label: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
};
```

---

## Props drilling check

- `themeStore` → global Zustand store, accessed directly via `useAppTheme()` in any component
- No prop drilling. Max depth from store to component = 1 (the hook call).

---

## Navigation wiring

- **Drawer.Navigator**: add `screenOptions={{ headerShown: false }}`
- **Tab.Navigator**: add `screenOptions={{ headerShown: false }}` + themed `tabBarStyle` (background, border colors from themeStore)
- **PostsNavigator**: add `screenOptions={{ headerShown: false }}`
- No new screens registered; no param list changes

---

## Libraries used

| Need | Library |
|---|---|
| Global theme state | Zustand v5 + `devtools` + `persist` middleware |
| Theme persistence | `react-native-mmkv` (NEW — requires `yarn add` + pod install) |
| SafeArea | `react-native-safe-area-context` (`useSafeAreaInsets`) |
| KeyboardAvoidingView | React Native built-in |
| OS color scheme default | `Appearance.getColorScheme()` (built-in) |

**Installation required:**
```bash
yarn add react-native-mmkv
bundle exec pod install --project-directory=ios
# Android: no extra step, auto-linked
```

---

## Dark/light mode

- Colors via: `useAppTheme()` hook
- Theme tokens used in ScreenWrapper: `colors.background`, `colors.text`, `colors.textSecondary`, `colors.border`, `colors.primary`
- StatusBar: `light-content` in dark mode, `dark-content` in light mode (set in `ThemeProvider`)
- Tab bar: `tabBarStyle.backgroundColor = colors.surface`, `tabBarActiveTintColor = colors.primary`
- No conditional styles — all handled by the token set returned by `useAppTheme()`

---

## themeStore shape

```ts
interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set) => ({
        isDark: Appearance.getColorScheme() === 'dark',
        toggleTheme: () => set((s) => ({ isDark: !s.isDark }), false, 'theme/toggle'),
        setTheme: (isDark) => set({ isDark }, false, 'theme/set'),
      }),
      { name: 'theme-store', storage: mmkvStorage }
    ),
    { name: 'ThemeStore' }
  )
);
```

---

## Commit message

```
feat(theme): design tokens, dark/light mode store, and ScreenWrapper
```
