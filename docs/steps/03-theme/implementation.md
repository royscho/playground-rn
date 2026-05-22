# Step 3 — Implementation Notes

## What was built

### Theme tokens
- `src/shared/theme/colors.ts` — 12-token light + dark palettes (background, surface, surfaceVariant, text, textSecondary, border, primary, primaryForeground, secondary, success, error, warning)
- `src/shared/theme/spacing.ts` — `xxs(2)` through `xxl(48)` scale
- `src/shared/theme/typography.ts` — `h1` through `label` scale with fontSize, fontWeight, lineHeight

### Storage
- `src/shared/storage/mmkv.ts` — `createMMKV()` instance (react-native-mmkv v4) + Zustand `createJSONStorage` adapter
- Added `react-native-mmkv` + `react-native-nitro-modules` (v4 peer dep) to package.json

### Theme store
- `src/features/settings/store/themeStore.ts` — Zustand store with `devtools` + `persist` (MMKV), `isDark`, `toggleTheme`, `setTheme`. Defaults to OS color scheme.

### useAppTheme hook
- `src/shared/hooks/useAppTheme.ts` — returns `{ isDark, colors, spacing, typography }` from active token set. Single hook call per component, no prop drilling.

### ScreenWrapper
- `src/shared/components/ScreenWrapper.tsx` — custom themed header (title, subtitle, back button, drawer menu button), scrollable body, loading/error/empty states, sticky footer, KeyboardAvoidingView for form mode.
- `createStyles` factory at bottom of file — takes colors, spacing, typography, insets, padded, centered as args.
- Auto-detects drawer navigator in parent chain → shows `☰` on left. Stack screens with `showBackButton` show `‹` instead.
- Named constants: `HEADER_MIN_HEIGHT = 52`, `HEADER_SLOT_SIZE = 40` for component-internal layout.

### ThemeProvider + NavigationContainer
- `src/app/providers/ThemeProvider.tsx` — syncs `StatusBar` style from themeStore
- `App.tsx` — passes custom `navTheme` to `NavigationContainer` (maps design tokens to RN navigation theme colors), so drawer and all nav chrome respects dark/light mode.

### All placeholder screens
- 23 screens updated from hardcoded `View`/`StyleSheet` to `ScreenWrapper` + `useAppTheme` tokens.

### SettingsScreen
- Real dark mode toggle: sun/moon icon (THEME_ICONS constant), label, caption, Switch.

## Decisions

- **MMKV v4**: uses `createMMKV()` not `new MMKV()` and requires `react-native-nitro-modules` peer dep.
- **spacing.xxs = 2**: added to handle subtitle marginTop without hardcoding.
- **Drawer auto-detection**: ScreenWrapper walks `navigation.getParent()` chain — no prop needed on any screen.
- **StyleSheet.create at bottom**: all dynamic styles use `createStyles(...)` factory defined at file bottom; called inside component with theme args.
- **NavTheme**: maps our color tokens to React Navigation's theme spec so drawer background, card, border all switch with the toggle.

## Reviewer findings (fixed)
- Hardcoded `borderRadius: 8` → `spacing.sm`
- Hardcoded `borderRadius: 12` → `spacing.sm + spacing.xs`
- Hardcoded `marginTop: 2` → `spacing.xxs` (new token)
- Hardcoded `lineHeight: 24` in back chevron → removed, using `typography.h2.fontSize` only
- `HEADER_MIN_HEIGHT` and `HEADER_SLOT_SIZE` accepted as UI chrome constants
