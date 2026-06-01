# Step 4 — Implementation Notes

## What was built

### Auth store (`authStore.ts`)
- Zustand store with `devtools` + `persist` middleware
- `partialize` excludes token from MMKV — only non-sensitive `user` persisted
- Token lives in keychain only; restored via `onRehydrateStorage` → `Keychain.getGenericPassword()`
- If keychain entry missing on rehydrate → `logout()` called to clear stale user
- `configureClientInterceptors` wired on rehydrate → 401 refresh queue active from startup
- Named actions: `auth/login`, `auth/logout`

### API client (`shared/api/client.ts`)
- Fetch wrapper with base URL from `react-native-config`
- Auth token injected via `Authorization: Bearer` header
- 401 → refresh queue → retry pattern: queues in-flight requests during refresh, retries all on success, rejects all + calls `logout()` on failure
- `configureClientInterceptors` accepts callbacks to avoid circular import with authStore

### Mock auth (`auth.api.ts`)
- 800ms simulated delay
- Field-level `AuthError` with `field: 'email' | 'password' | 'name'`
- `mockLogin` + `mockRegister` — same shape as real API calls

### Hooks
- `useLogin` / `useRegister` → `useMutation` wrappers; keychain write wrapped in try/catch — throws if keychain fails so mutation error state surfaces it
- `useLogout` → soft-fail keychain reset, always clears store

### Screens
- `LoginScreen` / `RegisterScreen` — no local loading/error state; all from mutation `isPending` + `error`
- Per-field error highlighting via `authError.field`

### Navigation
- `RootNavigator` reads `useAuthStore(s => s.token)` — mounts `AuthStack` or `AppDrawer`
- First-launch keychain reset: MMKV flag `app_launched_before` prevents iOS keychain surviving reinstall

### Feed — useInfiniteQuery
- `useFeedPosts` hook: `useInfiniteQuery` with 10-item pages from JSONPlaceholder
- `FeedScreen`: `FlatList` + `onEndReached` → `fetchNextPage()` at 30% threshold
- Footer shows spinner while fetching next page, "All caught up" when exhausted
- `PostCard` component — all colors/spacing/typography from `useAppTheme()`

## Decisions made

- Token in keychain, user profile in MMKV — keychain survives background process kill but MMKV is faster for non-sensitive data read on every render
- `useInfiniteQuery` added to FeedScreen now (design target step 7) — user requested it; no step dependency conflict
- `useMutation` for login/register — same pattern as real API calls in step 6; teaches loading/error without local useState
- `configureClientInterceptors` uses callback pattern (not direct store import) to avoid circular dependency: authStore → client → authStore

## Reviewer findings fixed
- Token excluded from MMKV via `partialize`
- Keychain ops wrapped in try/catch in useLogin/useRegister (throws) and useLogout (soft fail)
- First-launch `useEffect` uses `.catch(() => {})` on async keychain reset
