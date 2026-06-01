# Step 4 — Auth feature with Zustand, Keychain, and protected routes

## Task
Build mock email/password auth with a Zustand store, secure token storage via react-native-keychain, and a route guard that gates the entire app behind Login/Register.

## Files to create / modify

| File | Status |
|---|---|
| `src/features/auth/store/authStore.ts` | new |
| `src/features/auth/types/auth.types.ts` | new |
| `src/features/auth/api/auth.api.ts` | new |
| `src/features/auth/hooks/useLogin.ts` | new |
| `src/features/auth/hooks/useRegister.ts` | new |
| `src/features/auth/hooks/useLogout.ts` | new |
| `src/features/auth/hooks/index.ts` | new |
| `src/features/auth/screens/LoginScreen.tsx` | modified |
| `src/features/auth/screens/RegisterScreen.tsx` | modified |
| `src/features/auth/index.ts` | modified |
| `src/app/navigation/RootNavigator.tsx` | modified |
| `src/app/navigation/types.ts` | modified |
| `ReactotronConfig.ts` | modified |
| `docs/steps/04-auth/design.md` | new |

`react-native-keychain` must be installed + `pod install` run before implementation.

## ScreenWrapper config

**LoginScreen**: `title="Sign In"` `centered` `scrollable={false}`
**RegisterScreen**: `title="Create Account"` `centered` `scrollable={false}`

## State approach

- **Server state → TanStack Query** (mutations):
  - `useLogin` → `useMutation` calling `mockLogin(email, password)` — owns `isPending` + `error`
  - `useRegister` → `useMutation` calling `mockRegister(email, password, name)` — same
  - Mock API functions in `auth.api.ts` simulate network delay (800ms) and validate inputs
- **Global UI → Zustand** (`authStore`):
  - `user: User | null` — persisted in MMKV (non-sensitive: name, email, id)
  - `token: string | null` — persisted in MMKV (presence flag — actual token in keychain)
  - Actions: `login(user, token)`, `logout()`
- **Local → useState**: `email`, `password`, `name` (form field values only — no loading/error, mutation owns those)
- **No forms library** — step 11 introduces RHF; plain useState for fields here

## Props drilling check
No drilling — auth state read directly from `useAuthStore()` in `RootNavigator` and screens. Max depth: 1.

## Navigation wiring

```
RootStack
├── AuthStack   ← shown when token is null
│   ├── Login
│   └── Register
└── AppDrawer   ← shown when token is set
```

- `RootStackParamList`: add `AuthStack: NavigatorScreenParams<AuthStackParamList>`
- `RootNavigator`: reads `useAuthStore(s => s.token)`, conditionally mounts `AuthStack` or `AppDrawer`
- `AuthNavigator` already exists and is correct — no changes needed

## Libraries used

| Need | Library |
|---|---|
| Secure token storage | `react-native-keychain` |
| Auth state persistence | Zustand `persist` + MMKV (`mmkvStorage`) |
| State devtools | Zustand `devtools` middleware |
| Login/register mutations | TanStack Query `useMutation` |

## Mock auth logic

`src/features/auth/api/auth.api.ts`:
```ts
// Simulates real API: 800ms delay, validates inputs, returns typed response
mockLogin(email, password) → Promise<{ user: User; token: string }>
mockRegister(email, password, name) → Promise<{ user: User; token: string }>
// Throws AuthError with { message, field } for invalid inputs
```

`useLogin` (useMutation wrapper):
- `mutationFn` → `mockLogin`
- `onSuccess` → `Keychain.setGenericPassword(email, token)` + `authStore.login(user, token)`
- Screen reads `isPending`, `error` from mutation — no local loading/error state

`useLogout`:
1. `Keychain.resetGenericPassword()`
2. `authStore.logout()`

**First-launch keychain reset (iOS security):**
On app boot, check MMKV key `app_launched_before`. If not set: call `Keychain.resetGenericPassword()` + set the flag. Prevents previous user's token from auto-logging in after reinstall. This runs in `RootNavigator` via a `useEffect`.

## User type

```ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthError {
  message: string;
  field?: 'email' | 'password';
}
```

## Auth store shape

```ts
interface AuthStore {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}
```

Persisted via MMKV. Named actions: `'auth/login'`, `'auth/logout'`.

## Dark/light mode

- Colors: `useAppTheme().colors` — `colors.background`, `colors.surface`, `colors.text`, `colors.textSecondary`, `colors.primary`, `colors.error`, `colors.border`
- Spacing: `useAppTheme().spacing`
- Typography: `useAppTheme().typography`
- No conditional styles — tokens handle dark/light automatically

## Commit message
`feat(auth): Zustand auth store, keychain token storage, and protected routes`
