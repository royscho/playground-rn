# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start                    # Metro bundler
yarn ios                      # Build and run on iOS simulator
yarn android                  # Build and run on Android emulator
yarn test                     # Jest (all tests)
yarn test -- --testPathPattern="PostDetail"  # Single test file
yarn lint                     # ESLint
yarn tsc --noEmit             # Type check

# iOS native deps (after adding native libraries)
bundle exec pod install --project-directory=ios

# Troubleshooting
yarn start --reset-cache      # Fix stale Metro bundle
cd android && ./gradlew clean  # Fix stale Android build

# Reactotron (Android only — ADB reverse proxy)
adb reverse tcp:9090 tcp:9090
```

## Architecture

React Native 0.85 + New Architecture. Feature-sliced structure under `src/`:

- `src/app/` — navigation (React Navigation v7) and providers
- `src/features/` — one folder per feature; each self-contained with screens, store, hooks, api, types
- `src/shared/` — cross-feature: components, hooks, theme, api client, storage

Path alias `@/` maps to `src/` (configured in babel + tsconfig).

### Navigation

Typed with `RootStackParamList` etc. in `src/app/navigation/types.ts`. All new screens must be added there. Structure: `RootStack → AppDrawer → HomeTabs / PostsStack / …`.

### State management

- **Server state** → TanStack Query v5
- **Global UI state** → Zustand v5 with `devtools` + `persist` middleware
- **Form state** → React Hook Form (never useState/Zustand for forms)
- **Local state** → `useState` / `useReducer`
- Never prop-drill more than 2 levels — use Zustand or the scoped Context+Zustand pattern described in `docs/DESIGN.md`

### Theme

Every component and screen must support dark/light mode via `useAppTheme()`. Never hardcode colors, spacing, or font sizes.

```tsx
const { colors, spacing, typography } = useAppTheme();
// colors.background, colors.text, colors.surface, colors.primary, colors.error
// spacing.xs/sm/md/lg/xl/xxl
// typography.h1/h2/body/caption
```

Theme mode persisted in Zustand `themeStore` + MMKV. Never read from `Appearance` directly.

### ScreenWrapper

Every screen uses `<ScreenWrapper>`, never a raw `<View>`. It handles SafeArea, KeyboardAvoidingView, background color, loading/error states, and sticky footer. Props: `title`, `subtitle`, `form`, `loading`, `error`, `onRetry`, `scrollable`, `padded`, `centered`, `footer`, `headerRight`.

### Zustand stores

All stores use `devtools` middleware. Named actions required: `set({ … }, false, 'storeName/actionName')`. Persistent stores use MMKV via `mmkvStorage` adapter from `src/shared/storage`. Add each new store to the `stores` array in `ReactotronConfig.ts`.

### API layer

`src/shared/api/` — fetch wrapper with base URL, auth token injection, 401→refresh→retry queue, and error normalization. Feature API files import `client` and export typed functions.

### Storage rules

- Auth tokens → `react-native-keychain` only (Keychain/Keystore)
- Non-sensitive preferences → MMKV (`react-native-mmkv`)
- Never store tokens in MMKV

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Component files | PascalCase | `PostCard.tsx` |
| Hook files | camelCase, `use` prefix | `usePosts.ts` |
| Store files | camelCase, `Store` suffix | `authStore.ts` |
| API files | camelCase, `.api.ts` suffix | `posts.api.ts` |
| Screen files | PascalCase, `Screen` suffix | `PostDetailScreen.tsx` |
| Test files | same name, `.test.ts(x)` | `PostCard.test.tsx` |

## Commit format

```
<type>(<scope>): <description>
```

Types: `feat | fix | chore | test | ci | dx | refactor | docs`  
Scopes: `auth | posts | todos | navigation | theme | forms | animations | realtime | webview | notifications | performance | analytics | a11y | i18n | storage | native | ci | dx`

## Critical rules

- Every feature screen wrapped in `ErrorBoundary` — screen crashes must not kill the app
- Every `useEffect` with subscription/timer/listener must return a cleanup function
- All async functions in `useEffect` must have `try/catch`; all mutations need `onError`
- Disable Firebase Analytics and Sentry in dev: `!__DEV__` guard at init
- Call `Keychain.resetGenericPassword()` on fresh install — iOS keychain survives uninstall
- Never deploy OTA update alongside native code changes

## Build roadmap

Implemented so far: steps 1 (architecture), 2 (navigation), 3 (theme + ScreenWrapper), and 8 (CI/CD docs). See `docs/DESIGN.md` for the full 31-step roadmap and `docs/steps/` for per-step design and implementation notes.
