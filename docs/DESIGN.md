# React Native Playground — Design Document

A hands-on reference project covering every topic a production React Native developer needs.
Built step-by-step, one commit per topic, with an opinionated stack chosen for real-world relevance.

---

## Vision

- **Not** a showcase of every library option — one winner per category, chosen deliberately
- **Yes** to real patterns: feature folders, typed navigation, optimistic updates, E2E tests, CI/CD
- Every screen uses real or mock public data (no lorem ipsum UI)
- Each step is a standalone, shippable commit — learn by reading the git log
- **100% free** — every service, API, and tool used has a free tier or is open source. No credit card required.

---

## Stack

| Category             | Library                                                                    | Why                                                                                          |
| -------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Language             | TypeScript                                                                 | Non-negotiable in production                                                                 |
| Navigation           | React Navigation v7                                                        | Industry standard, great TypeScript support                                                  |
| Global state         | Zustand v5                                                                 | Minimal boilerplate, composable, DevTools                                                    |
| Server state         | TanStack Query v5                                                          | Best-in-class: caching, background sync, optimistic updates                                  |
| Forms                | React Hook Form + Zod                                                      | Uncontrolled performance + type-safe runtime validation                                      |
| Dates                | date-fns                                                                   | Tree-shakeable, immutable, no moment.js bloat                                                |
| Styling              | StyleSheet + custom theme                                                  | Portable, no runtime overhead                                                                |
| Animations           | Reanimated 3                                                               | Runs on UI thread — the only real option for 60fps gestures                                  |
| Haptics              | react-native-haptic-feedback                                               | Button press, error shake, success feedback — one import                                     |
| Bottom sheet         | @gorhom/bottom-sheet                                                       | Gesture-native, snap-points, backdrop support                                                |
| Storage (general)    | react-native-mmkv                                                          | Synchronous, 10x faster than AsyncStorage                                                    |
| Storage (secure)     | react-native-keychain                                                      | Keychain/Keystore for auth tokens and secrets                                                |
| Social auth          | @react-native-google-signin + @invertase/react-native-apple-authentication | Google (Firebase free) + Apple Sign-In                                                       |
| Env config           | react-native-config                                                        | Per-environment .env files (dev/staging/prod)                                                |
| Permissions          | react-native-permissions                                                   | Unified permission API for iOS + Android                                                     |
| Push notifications   | @notifee/react-native + FCM                                                | Local + remote notifications — FCM free tier is unlimited                                    |
| Images               | react-native-fast-image                                                    | Cached, prioritized image loading                                                            |
| WebView              | react-native-webview                                                       | Embed web content, JS bridge, OAuth flows                                                    |
| Crash reporting      | Sentry (free tier)                                                         | 5K errors/month free — enough for any playground/learning project                            |
| Accessibility        | eslint-plugin-react-native-a11y + RNTL a11y queries                        | Static a11y linting + runtime role/label assertions                                          |
| Offline              | NetInfo + persistQueryClient                                               | Connectivity detection + TanStack Query persistence                                          |
| OTA updates          | self-hosted code-push-server                                               | Open-source CodePush server — free, runs locally or on free Render/Railway                   |
| Unit/Component tests | Jest + React Native Testing Library                                        | Official preset, confidence-first                                                            |
| E2E tests            | Detox                                                                      | Standard for RN E2E on real/simulated devices                                                |
| Linting / formatting | ESLint + Prettier                                                          | Airbnb config + import ordering + RN-specific rules — enforced via lint-staged               |
| Pre-commit           | Husky + lint-staged + commitlint                                           | Block bad commits at the source                                                              |
| CI/CD                | GitHub Actions + Fastlane                                                  | GitHub Actions free for public repos; Fastlane open source                                   |
| Native bridge        | Turbo Modules + codegen                                                    | New Architecture native module pattern                                                       |
| HTTP client          | fetch (native)                                                             | Built-in, no dependency, sufficient for token refresh + request queuing                      |
| Splash screen        | react-native-bootsplash                                                    | Animated, dark mode variant, iOS + Android asset pipeline                                    |
| SVG                  | react-native-svg + svg-transformer                                         | SVG as React components, replaces PNG icon sets                                              |
| Skeleton             | custom + Reanimated shimmer                                                | Placeholder loading UI, no extra lib needed                                                  |
| i18n                 | i18next + react-i18next                                                    | Translations, pluralization, RTL via I18nManager                                             |
| Mock/remote data     | JSONPlaceholder + randomuser.me + PokeAPI                                  | All free, no auth, no rate limits                                                            |
| Real-time            | WebSocket (echo.websocket.org) + local Socket.IO server                    | Both free — local Socket.IO server via node script                                           |
| Analytics            | @react-native-firebase/analytics                                           | Already have Firebase; unlimited free events, screen views, user properties, funnel analysis |
| Feature flags        | @react-native-firebase/remote-config                                       | Firebase Remote Config — free, zero extra account, A/B-ready                                 |
| Debug                | Reactotron                                                                 | Query, state, and network inspector                                                          |

---

## Folder Structure

```
src/
├── app/
│   ├── navigation/          # Root navigator, param lists, deep linking
│   └── providers/           # QueryClientProvider, ThemeProvider, etc.
│
├── features/
│   ├── auth/
│   │   ├── api/             # login/register/social API calls
│   │   ├── components/      # LoginForm, RegisterForm, SocialButtons
│   │   ├── hooks/           # useLogin, useRegister, useGoogleSignIn, useAppleSignIn
│   │   ├── screens/         # LoginScreen, RegisterScreen
│   │   ├── store/           # Zustand auth slice
│   │   └── types/
│   ├── home/
│   │   └── screens/         # Dashboard, Feed, Explore (tab screens)
│   ├── posts/               # CRUD — JSONPlaceholder /posts
│   ├── todos/               # Optimistic updates — JSONPlaceholder /todos
│   ├── forms/               # React Hook Form + Zod patterns
│   ├── animations/          # Reanimated 3 + bottom sheet + modals
│   ├── realtime/            # WebSocket + Socket.IO + AppState lifecycle
│   ├── webview/             # react-native-webview, JS bridge, OAuth
│   ├── settings/            # Theme toggle, MMKV storage demo
│   ├── native-modules/      # Turbo Module example screen
│   ├── notifications/       # FCM, @notifee, permission flow
│   ├── performance/         # FlashList, memoization, profiling demos
│   ├── analytics/           # Screen tracking, event helpers, user properties
│   ├── remote-config/       # Feature flags, A/B variants, remote values
│   ├── a11y/                # Accessibility patterns, roles, labels, audit screen
│   ├── javascript/          # JS concepts reference: snippets + runnable output
│   ├── hooks/               # React hooks reference: live interactive demos
│   ├── typescript/          # TypeScript reference: types, generics, utility types, patterns
│   └── i18n/                # i18next translations, RTL layout, language switcher
│
└── shared/
    ├── components/          # ScreenWrapper, Button, Input, Modal, Toast, EmptyState, ErrorBoundary, SkeletonItem, SkeletonList
    ├── hooks/               # useAppTheme, useDebounce, useMount
    ├── api/                 # fetch wrapper, interceptors, error handling
    ├── theme/               # colors, typography, spacing, shadows
    ├── utils/               # formatDate, truncate, sleep, etc.
    └── types/               # Global TS types (Nullable, ID, ApiError…)

e2e/                         # Detox specs
.github/
    workflows/
        ci.yml               # Lint + typecheck + unit tests + coverage gate on PR
        staging.yml          # Fastlane build → artifact on merge to main
        release.yml          # Fastlane build + Sentry source maps + OTA on tag
fastlane/
    Fastfile                 # iOS and Android lanes
    Appfile
CLAUDE.md                    # AI coding conventions for this project (added in step 14)
ReactotronConfig.ts          # Reactotron setup (debug only)
.env                         # dev environment (react-native-config)
.env.staging
.env.production
.husky/                      # pre-commit, commit-msg hooks
```

---

## Navigation Architecture

```
RootStack
├── AuthStack        (when unauthenticated)
│   ├── LoginScreen
│   └── RegisterScreen
└── AppDrawer        (when authenticated)
    ├── HomeTabs
    │   ├── DashboardScreen
    │   ├── FeedScreen
    │   └── ExploreScreen
    ├── PostsStack
    │   ├── PostsListScreen
    │   └── PostDetailScreen
    ├── TodosScreen
    ├── AnimationsScreen
    ├── FormsScreen
    ├── RealtimeScreen
    ├── WebViewScreen
    ├── NotificationsScreen
    ├── PerformanceScreen
    ├── SettingsScreen
    ├── NativeModulesScreen
    ├── JavaScriptScreen
    ├── HooksScreen
    ├── TypeScriptScreen
    ├── AnalyticsScreen
    ├── RemoteConfigScreen
    ├── A11yScreen
    └── I18nScreen
```

---

## ScreenWrapper Pattern

Every screen is wrapped in `ScreenWrapper` — never raw `View`. All props are optional; compose only what the screen needs.

```tsx
// shared/components/ScreenWrapper.tsx
interface ScreenWrapperProps {
  children: React.ReactNode; // required — the screen content

  // Header
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode; // icon buttons, actions
  showBackButton?: boolean;

  // Footer
  footer?: React.ReactNode; // sticky bottom area, always above keyboard

  // Form mode — activates KeyboardAvoidingView + auto-scroll to focused field
  form?: boolean;
  onSubmit?: () => void; // wraps children in a Form context when set

  // State
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void; // shown in error state

  // Layout
  scrollable?: boolean; // default true
  padded?: boolean; // default true
  centered?: boolean; // centers children vertically (empty states, auth screens)
}
```

**Layout composition — all combinations are valid:**

```tsx
// Minimal screen
<ScreenWrapper title="Home">
  <Feed />
</ScreenWrapper>

// Form screen with sticky submit button
<ScreenWrapper title="Edit Profile" subtitle="Update your info" form onSubmit={handleSubmit}>
  <ProfileForm />
  <ScreenWrapper.Footer>
    <Button onPress={handleSubmit} label="Save" />
  </ScreenWrapper.Footer>
</ScreenWrapper>

// Full-bleed non-scrollable screen (e.g. map, camera)
<ScreenWrapper title="Map" scrollable={false} padded={false}>
  <MapView />
</ScreenWrapper>

// Centered empty / auth screen
<ScreenWrapper centered>
  <EmptyState />
</ScreenWrapper>
```

Handles: SafeArea, KeyboardAvoidingView, background color from theme, loading spinner, error + retry state, sticky footer above keyboard, header with optional back button.

---

## Theme System

Tokens live in `shared/theme/` — never hardcode colors, spacing, or font sizes.

```ts
// shared/theme/colors.ts
export const palette = {
  primary: '#6C63FF',
  secondary: '#FF6584',
  success: '#43A047',
  error: '#E53935',
  warning: '#FB8C00',
  // neutrals, backgrounds, surface…
};

// shared/theme/spacing.ts
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

// shared/theme/typography.ts
export const typography = {
  h1: { fontSize: 32, fontWeight: '700' },
  h2: { fontSize: 24, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
};
```

Dark/light mode: Zustand `themeStore` + MMKV persistence. `useAppTheme()` hook returns the active token set — never read from `Appearance` directly in components.

### Dark/Light Mode Rules

Every screen and component **must** support both modes. No exceptions.

```tsx
// ✅ Always
const { colors, spacing, typography } = useAppTheme();
const styles = StyleSheet.create({
  container: { backgroundColor: colors.background },
  title: { color: colors.text, ...typography.h2 },
  card: { backgroundColor: colors.surface, padding: spacing.md },
});

// ❌ Never
backgroundColor: 'white';
color: '#333333';
padding: 16;
fontSize: 24;
```

| Token category | Hook                       | Examples                                                                               |
| -------------- | -------------------------- | -------------------------------------------------------------------------------------- |
| Colors         | `useAppTheme().colors`     | `colors.background`, `colors.text`, `colors.primary`, `colors.surface`, `colors.error` |
| Spacing        | `useAppTheme().spacing`    | `spacing.xs`, `spacing.sm`, `spacing.md`, `spacing.lg`, `spacing.xl`                   |
| Typography     | `useAppTheme().typography` | `typography.h1`, `typography.h2`, `typography.body`, `typography.caption`              |

---

## Error Boundary Pattern

Every feature screen is wrapped in an `ErrorBoundary` — crashes stay contained, not full-app.

```tsx
// shared/components/ErrorBoundary.tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // custom fallback UI
  onError?: (error: Error) => void;
}
```

**Hierarchy:**

```
App
└── RootErrorBoundary          ← catches fatal errors, shows full-screen fallback
    └── NavigationContainer
        └── FeatureScreen
            └── ScreenErrorBoundary   ← catches per-screen errors, shows inline retry
                └── ScreenWrapper (loading/error props handle async errors)
```

Sentry captures automatically via `Sentry.ErrorBoundary`. `onError` callback triggers a breadcrumb.

---

## API Layer Pattern

```
shared/api/
├── client.ts          # fetch wrapper with baseURL, default headers, error handling
├── interceptors.ts    # request: inject token | response: 401 → queue → refresh → retry all
├── tokenQueue.ts      # pending request queue used during token refresh
├── errorHandler.ts    # normalize API errors to AppError type
└── queryClient.ts     # TanStack QueryClient config (staleTime, retry)
```

Feature-level API files import `client` and export typed functions:

```ts
// features/posts/api/posts.api.ts
export const fetchPosts = (page: number) =>
  client.get<Post[]>(`/posts?_page=${page}&_limit=10`);
```

---

## State Management Pattern

- **Server state** → TanStack Query (fetching, caching, mutation)
- **Global UI state** → Zustand (auth, theme, user preferences)
- **Local component state** → `useState` / `useReducer`
- **Form state** → React Hook Form (never Zustand or useState for forms)

### No Props Drilling

Never pass props more than 2 levels deep.

| Depth      | Rule                               |
| ---------- | ---------------------------------- |
| 1–2 levels | Props are fine                     |
| 3+ levels  | Use Zustand store or React Context |

**Decision:** Zustand first. If you use Context, always combine it with Zustand — never Context alone. Context without Zustand has no devtools, no persistence, and causes re-render storms.

### Context + Zustand Scoped Instance Pattern

Use when a piece of state belongs to a subtree (e.g. a multi-step wizard, a modal flow) — not global, but too deep to prop-drill.

```tsx
// 1. Store factory — NOT a singleton
const createWizardStore = (init: WizardState) =>
  create<WizardStore>(set => ({
    ...init,
    nextStep: () => set(s => ({ step: s.step + 1 })),
    reset: () => set(init),
  }));

type WizardStoreApi = ReturnType<typeof createWizardStore>;

// 2. Context holds the store instance
const WizardContext = createContext<WizardStoreApi | null>(null);

// 3. Provider creates one store per mount
export const WizardProvider = ({ children, ...init }: WizardProviderProps) => {
  const storeRef = useRef<WizardStoreApi>();
  if (!storeRef.current) storeRef.current = createWizardStore(init);
  return (
    <WizardContext.Provider value={storeRef.current}>
      {children}
    </WizardContext.Provider>
  );
};

// 4. Typed hook — Zustand selector, no re-render storms
export const useWizardStore = <T,>(selector: (s: WizardStore) => T) => {
  const store = useContext(WizardContext);
  if (!store)
    throw new Error('useWizardStore must be used inside WizardProvider');
  return useStore(store, selector);
};
```

Each `WizardProvider` mount gets its own isolated store. You keep Zustand devtools, efficient subscriptions, and TypeScript safety — with zero global state pollution.

---

## Reactotron Setup

Reactotron is the primary debug inspector — network, state, and query inspection in one place. Config lives in `ReactotronConfig.ts`, imported only in `index.js` under `__DEV__`.

```ts
// ReactotronConfig.ts
Reactotron.configure({ onDisconnect: () => queryClientManager.unsubscribe() })
  .useReactNative() // network inspector, AsyncStorage, overlay
  .use(reactotronReactQuery(queryClientManager)) // TanStack Query: cache, refetch, invalidate
  .use(
    reactotronZustand({
      stores: [
        { name: 'auth', store: useAuthStore },
        { name: 'theme', store: useThemeStore },
        { name: 'websocket', store: useWebSocketStore },
        // add each Zustand store here as it's created
      ],
    }),
  )
  .connect();
```

| Plugin                      | What you get                                                         |
| --------------------------- | -------------------------------------------------------------------- |
| `.useReactNative()`         | Network request log, AsyncStorage viewer, dev overlay, perf overlays |
| `reactotron-react-query`    | Live query cache, refetch/invalidate from desktop, query timeline    |
| `reactotron-plugin-zustand` | Named store snapshots, time-travel state inspection                  |

**Rules:**

- Never import `ReactotronConfig` outside `index.js`
- Wrap the import in `if (__DEV__)` — zero production overhead
- Add every new Zustand store to the `stores` array on creation

### Zustand DevTools Middleware

Every store uses the `devtools` middleware — connects to **Redux DevTools Extension** (Chrome/Firefox) when debugging via Hermes:

```ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { mmkvStorage } from '@/shared/storage';

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      set => ({
        user: null,
        token: null,
        login: (user, token) => set({ user, token }, false, 'auth/login'),
        logout: () => set({ user: null, token: null }, false, 'auth/logout'),
      }),
      { name: 'auth-store', storage: mmkvStorage },
    ),
    { name: 'AuthStore' }, // label shown in Redux DevTools
  ),
);
```

Named actions (`'auth/login'`) make Redux DevTools time-travel readable. Use `storeName/actionName` convention for all `set()` calls.

---

## DX Tools

| Tool                      | How to run                                 | What it gives you                                                |
| ------------------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| Reactotron                | Open desktop app → `yarn ios/android`      | Network + Zustand snapshots + **TanStack Query cache** inspector |
| Redux DevTools Extension  | Chrome/Firefox extension + Hermes debugger | **Zustand time-travel**, named action history                    |
| React Native DevTools     | `j` in Metro → "Open DevTools"             | Official RN debugger: console, sources, network, perf            |
| React DevTools standalone | `npx react-devtools`                       | Component tree, props, hooks (RN 0.73+)                          |
| Hermes debugger           | Chrome → `chrome://inspect`                | JS breakpoints, heap snapshots                                   |
| Flipper                   | Open Flipper app                           | Layout inspector, legacy crash logs                              |
| Xcode Instruments         | Xcode → Product → Profile                  | iOS memory leaks, CPU, frame rate                                |
| Android Studio Profiler   | Android Studio → Profiler panel            | Android memory, CPU, network                                     |
| Metro cache reset         | `yarn start --reset-cache`                 | Fix stale bundle issues                                          |
| Plop generator            | `yarn generate`                            | Scaffold feature folder, screen, store, hook                     |

---

## Testing Strategy

| Level       | Tool              | What it tests                                  |
| ----------- | ----------------- | ---------------------------------------------- |
| Unit        | Jest              | Zustand stores, utility functions, Zod schemas |
| Component   | RNTL              | Rendering, user interactions, accessibility    |
| Integration | RNTL + jest mocks | Screen behavior with mocked API responses      |
| E2E         | Detox             | Auth flow, navigation, critical user journeys  |

---

## CI/CD Pipeline

```
Push / PR
  └── ci.yml
        ├── yarn lint
        ├── yarn tsc --noEmit
        ├── yarn test --ci --coverage
        ├── coverage gate (fail if < 70%)
        ├── yarn audit (dependency vulnerability check)
        └── bundle size check (react-native-bundle-visualizer)

Staging deploy (.env.staging)
  └── staging.yml  (triggered on merge to main)
        ├── fastlane ios staging   → .ipa artifact (GitHub Actions)
        └── fastlane android staging → .apk artifact (GitHub Actions)

Git tag (v*.*.*)
  └── release.yml
        ├── fastlane ios build     → .ipa artifact (GitHub Actions)
        ├── fastlane android build → .apk artifact (GitHub Actions)
        ├── sentry upload source maps
        └── code-push release (OTA hotfix path)
```

> **Note on distribution:** TestFlight requires an Apple Developer account ($99/yr) and Play Store
> requires a Google Play account ($25 one-time). The Fastlane upload lanes are included as
> pattern reference — comment them in when you have accounts. Until then, binaries are saved
> as GitHub Actions artifacts and downloaded manually for device testing.

### Fastlane lanes

```ruby
# fastlane/Fastfile
lane :test do
  run_tests(scheme: "PlaygroundTests")
end

lane :staging do
  increment_build_number
  build_app(scheme: "Playground", configuration: "Staging")
  # upload_to_testflight   ← uncomment when Apple Dev account is ready
end

lane :beta do
  increment_build_number
  build_app(scheme: "Playground", configuration: "Release")
  # upload_to_testflight   ← uncomment when Apple Dev account is ready
  upload_symbols_to_sentry(auth_token: ENV["SENTRY_AUTH_TOKEN"])
end
```

### GitHub Actions workflows

```yaml
# .github/workflows/ci.yml
- name: Test coverage gate
  run: yarn test --ci --coverage --coverageThreshold='{"global":{"lines":70}}'

- name: Dependency audit
  run: yarn audit --level moderate

- name: Bundle size
  run: npx react-native-bundle-visualizer --platform ios --dev false
```

---

## Build Roadmap

Each step = one focused commit. Build in order — each step depends on the previous.

### Core Steps

| #   | Commit                                                            | What you learn                                                                                                                                                                                     |
| --- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `chore: architecture, path aliases, env config, pre-commit hooks` | Feature folders, tsconfig paths, react-native-config, Husky + lint-staged + commitlint                                                                                                             |
| 2   | `feat: navigation with typed routes, tabs, drawer, deep linking`  | React Navigation v7, typed params, nested navigators, Universal Links / App Links                                                                                                                  |
| 3   | `feat: theme system and ScreenWrapper`                            | Design tokens, dark/light mode, Zustand + MMKV persistence                                                                                                                                         |
| 4   | `feat: auth feature with Zustand, keychain, and protected routes` | Email/password mock auth, react-native-keychain secure token storage, route guards                                                                                                                  |
| 5   | `feat: social auth with Google and Apple sign-in`                 | @react-native-google-signin, @invertase/react-native-apple-authentication, Firebase Auth free tier, mocked Apple flow for local dev                                                                |
| 6   | `feat: API layer and TanStack Query patterns`                     | Axios instance, request interceptor (token injection), response interceptor (401 → refresh queue → retry), useQuery, useMutation, useInfiniteQuery                                                 |
| 7   | `feat: posts CRUD with optimistic updates`                        | Full CRUD, infinite scroll, optimistic deletes                                                                                                                                                     |
| 8   | `ci: GitHub Actions and Fastlane lanes`                           | ci.yml (lint, typecheck, tests, coverage gate, audit, bundle size), staging.yml + release.yml (Fastlane build → GitHub artifact), Sentry source maps upload, OTA via code-push-server             |
| 9   | `test: Detox E2E for auth and navigation`                         | Detox config, device/emulator tests, CI E2E job                                                                                                                                                    |

### Optional Steps

Build when needed — no strict order dependency after the core steps above.

| #   | Commit                                                            | What you learn                                                                                                                                                                                                                                                                                                                             |
| --- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 10  | `feat: forms with React Hook Form and Zod`                        | Controlled inputs, schema validation, multi-step forms                                                                                                                                                                                                                                                                                     |
| 11  | `feat: animations, bottom sheet, and modals`                      | Reanimated 3, gesture handlers, @gorhom/bottom-sheet, modal/action sheet patterns                                                                                                                                                                                                                                                          |
| 12  | `feat: realtime with WebSocket, Socket.IO, and AppState`          | WS lifecycle, Zustand real-time store, reconnect on foreground, AppState API                                                                                                                                                                                                                                                               |
| 13  | `feat: webview with JS bridge and OAuth flow`                     | react-native-webview, postMessage bridge, in-app browser, OAuth redirect handling                                                                                                                                                                                                                                                          |
| 14  | `test: unit, component, and integration tests`                    | RNTL setup, store tests, screen integration tests                                                                                                                                                                                                                                                                                          |
| 15  | `dx: code snippets and feature generator`                         | Plop.js scaffolding, VS Code snippets, CLAUDE.md conventions                                                                                                                                                                                                                                                                               |
| 16  | `feat: Turbo Native Module with iOS and Android`                  | Codegen spec, Swift + Kotlin bridge, New Architecture                                                                                                                                                                                                                                                                                      |
| 17  | `feat: crash reporting and error boundaries with Sentry`          | Sentry init, error boundaries, breadcrumbs, performance tracing                                                                                                                                                                                                                                                                            |
| 18  | `feat: performance — FlashList, memoization, profiling`           | @shopify/flash-list, memo/useMemo/useCallback patterns, React DevTools Profiler                                                                                                                                                                                                                                                            |
| 19  | `feat: push notifications and permissions`                        | FCM + APNs, @notifee channels + actions, react-native-permissions flow                                                                                                                                                                                                                                                                     |
| 20  | `feat: offline support and OTA updates`                           | NetInfo, persistQueryClient, optimistic offline queue, self-hosted code-push-server                                                                                                                                                                                                                                                        |
| 21  | `feat: JavaScript concepts reference screen`                      | Closures, prototypes, this/call/apply/bind, hoisting, event loop, Promises, async/await, Promise.all/race/allSettled, generators, destructuring, spread/rest, optional chaining, array methods, currying, memoization, debounce/throttle, composition, Set/Map/WeakMap, Proxy/Reflect, Symbol, custom errors, immutability, deep clone     |
| 22  | `feat: React hooks reference screen`                              | Built-in: useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef, useLayoutEffect, useTransition, useDeferredValue, useId, useSyncExternalStore. Custom: useDebounce, usePrevious, useToggle, useInterval, useIsMounted, useOnMount, useWindowDimensions, useColorScheme                                                |
| 23  | `feat: TypeScript reference screen`                               | Types vs interfaces, union/intersection, literal types, generics + constraints, keyof/typeof/ReturnType/Parameters, utility types (Partial/Required/Readonly/Pick/Omit/Record/Exclude/Extract/NonNullable/Awaited), conditional types, mapped types, template literal types, infer, discriminated unions, type guards, as const, satisfies |
| 24  | `feat: splash screen and app icon`                                | react-native-bootsplash setup, animated hide, iOS + Android asset sizes, dark mode variant                                                                                                                                                                                                                                                 |
| 25  | `feat: SVG support`                                               | react-native-svg, SVG icons as components, react-native-svg-transformer for .svg imports, icon system replacing PNG icons                                                                                                                                                                                                                  |
| 26  | `feat: skeleton loading`                                          | Shimmer placeholder components, SkeletonItem + SkeletonList, reuse across posts/feed/profile screens, Reanimated shimmer animation                                                                                                                                                                                                         |
| 27  | `feat: i18n and RTL support`                                      | i18next + react-i18next, language detection, translation namespaces, pluralization, I18nManager RTL flip, per-language layout mirroring                                                                                                                                                                                                    |
| 28  | `feat: analytics with Firebase Analytics`                         | @react-native-firebase/analytics, logEvent, screen view tracking via navigation listener, user properties, useAnalytics hook, AnalyticsScreen demo                                                                                                                                                                                         |
| 29  | `feat: haptics`                                                   | react-native-haptic-feedback, impact/notification/selection types, useHaptics hook, integrated into Button + error states                                                                                                                                                                                                                  |
| 30  | `feat: feature flags with Firebase Remote Config`                 | @react-native-firebase/remote-config, fetch + activate pattern, useRemoteConfig hook, RemoteConfigScreen demo with live flag toggling                                                                                                                                                                                                      |
| 31  | `feat: accessibility patterns and audit`                          | accessibilityLabel, accessibilityRole, accessibilityHint, focus management, RNTL getByRole assertions, eslint-plugin-react-native-a11y, A11yScreen audit demo                                                                                                                                                                              |

---

## Naming Conventions

| Thing           | Convention                  | Example                |
| --------------- | --------------------------- | ---------------------- |
| Component files | PascalCase                  | `PostCard.tsx`         |
| Hook files      | camelCase, `use` prefix     | `usePosts.ts`          |
| Store files     | camelCase, `Store` suffix   | `authStore.ts`         |
| API files       | camelCase, `.api.ts` suffix | `posts.api.ts`         |
| Type files      | camelCase, `.types.ts`      | `posts.types.ts`       |
| Screen files    | PascalCase, `Screen` suffix | `PostDetailScreen.tsx` |
| Test files      | same name, `.test.ts(x)`    | `PostCard.test.tsx`    |
| E2E files       | camelCase, `.e2e.ts`        | `auth.e2e.ts`          |

---

## Commit Message Format

```
<type>(<scope>): <short description>

type: feat | fix | chore | test | ci | dx | refactor | docs
scope: auth | posts | todos | navigation | theme | forms | animations | realtime | webview | notifications | performance | offline | analytics | a11y | i18n | storage | native | ci | dx
```

---

## Free Services Reference

Everything used in this project is free. No credit card required.

| Service                      | Free tier                       | Used in                |
| ---------------------------- | ------------------------------- | ---------------------- |
| JSONPlaceholder              | Unlimited                       | Posts, Todos           |
| randomuser.me                | Unlimited                       | User avatars, profiles |
| PokeAPI                      | Unlimited                       | Feed / list examples   |
| echo.websocket.org           | Unlimited                       | WebSocket echo feature |
| Local Socket.IO server       | Free (your machine)             | Realtime feature       |
| Firebase Auth                | Free (10K/month sign-ins)       | Google Sign-In         |
| Firebase / FCM               | Free (unlimited push sends)     | Push notifications     |
| Firebase Analytics           | Free (unlimited events)         | Analytics feature      |
| Firebase Remote Config       | Free (unlimited fetches)        | Feature flags          |
| Sentry                       | 5K errors/month                 | Crash reporting        |
| GitHub Actions               | Free for public repos           | CI/CD                  |
| self-hosted code-push-server | Free (Render/Railway free tier) | OTA updates            |
| Fastlane                     | Open source                     | Build automation       |
| All npm libraries            | Open source                     | Everything             |
| react-native-bootsplash      | Open source                     | Splash screen          |
| react-native-svg             | Open source                     | SVG rendering          |
| i18next                      | Open source                     | Translations           |

> **Note on CI/CD deployment:** Building and running Fastlane lanes locally is completely free.
> Uploading to TestFlight requires an Apple Developer account ($99/yr) and to Play Store requires a
> Google Play account ($25 one-time). These steps are included for the pattern — skip the upload
> lanes if you don't have accounts.

---

## Known Issues & Critical Pitfalls

### Common Issues

| Issue                        | Symptom                              | Fix                                                                                    |
| ---------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| Metro cache stale            | App shows old code after change      | `yarn start --reset-cache`                                                             |
| iOS pods out of sync         | Build error after adding native lib  | `bundle exec pod install --project-directory=ios`                                      |
| Android gradle sync          | Build fails after dependency change  | `cd android && ./gradlew clean`                                                        |
| Reactotron not connecting    | Blank Reactotron screen              | Check device/simulator on same network; on Android run `adb reverse tcp:9090 tcp:9090` |
| Fast Refresh loop            | Screen keeps reloading               | Circular import — check for `import A from A`                                          |
| TanStack Query stale data    | Screen shows old data after mutation | Ensure `queryClient.invalidateQueries()` called in `onSuccess`                         |
| Zustand store not persisting | State lost on app restart            | Check MMKV storage adapter is passed to `persist()`                                    |
| Dark mode not applying       | Colors wrong after theme switch      | Component using hardcoded color instead of `useAppTheme()`                             |
| Navigation type error        | TS error on `navigation.navigate()`  | Param list missing entry in `src/app/navigation/types.ts`                              |
| Keyboard covering input      | Form fields hidden behind keyboard   | Screen missing `form` prop on `ScreenWrapper`                                          |
| Image not loading            | Blank image view                     | Missing `resizeMode` on `FastImage` or wrong URI shape                                 |
| i18n key shows raw key       | `"auth.login.button"` displayed      | Translation namespace not loaded in `i18next` config                                   |

---

### Critical Issues

These cause **data loss, security vulnerabilities, or silent production failures** — treat as blockers.

| Issue                                      | Why Critical                                               | Prevention                                                                                                    |
| ------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Token refresh infinite loop**            | App hangs, user locked out                                 | `tokenQueue.ts` must clear queue on refresh failure and call `logout()`                                       |
| **Keychain data survives uninstall (iOS)** | Previous user's token auto-logs in new user on same device | Call `Keychain.resetGenericPassword()` on first launch after fresh install (check MMKV flag)                  |
| **Firebase Analytics firing in dev**       | Pollutes production data                                   | Call `analytics().setAnalyticsCollectionEnabled(!__DEV__)` at app init                                        |
| **Sentry capturing in dev**                | Fills error quota, masks real prod errors                  | Set `enabled: !__DEV__` in Sentry init                                                                        |
| **OTA update breaking native code**        | App crashes on launch after update                         | Never deploy OTA update alongside native code changes — use full store release instead                        |
| **MMKV storing sensitive data**            | Token readable via device backup or jailbreak              | Auth tokens → `react-native-keychain` only. MMKV for non-sensitive prefs only                                 |
| **useEffect missing cleanup**              | Memory leak, stale closures, zombie listeners              | Every `useEffect` with subscription/timer/event listener must return cleanup function                         |
| **JS thread blocking**                     | UI freezes, dropped frames                                 | Never run heavy computation on JS thread — offload to `InteractionManager.runAfterInteractions()` or a worker |
| **Unhandled promise rejections**           | Silent failures in production                              | All `async` functions in `useEffect` must have `try/catch`; all mutations need `onError` handler              |
| **Props drilled through 3+ levels**        | Stale props, impossible to debug re-renders                | Refactor to Zustand immediately — see No Props Drilling rule                                                  |
| **Context used without Zustand**           | Re-renders entire subtree on any state change              | Always Context + Zustand — never Context alone                                                                |
| **Hardcoded colors in StyleSheet**         | Dark mode broken, accessibility issues                     | Use `useAppTheme()` — zero hardcoded hex or color names                                                       |
| **`console.log` in production**            | Performance hit + potential data leak in logs              | Lint rule `no-console` enforced via ESLint; remove before commit                                              |
| **Missing error boundary**                 | Single screen crash kills entire app                       | Every feature screen wrapped in `ErrorBoundary`                                                               |

---

## Quick Start

```bash
# Install dependencies
yarn install

# iOS
bundle exec pod install --project-directory=ios
yarn ios

# Android
yarn android

# Type check
yarn tsc --noEmit

# Lint
yarn lint

# Tests
yarn test

# E2E (after Step 13)
yarn detox build --configuration ios.sim.debug
yarn detox test --configuration ios.sim.debug
```
