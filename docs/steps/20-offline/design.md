# Step 20 — Offline support

## Task

Demo screen showing: network status detection, TanStack Query cache persisted to MMKV (survives app restart), and optimistic mutations that queue while offline and resume automatically on reconnect.

**Scope cut:** roadmap step 20 also bundles OTA updates (self-hosted code-push-server). That's a separate CI/infra concern already touched in step 7's docs — not built here. Say so if you want it added as step 20b.

## Files to create

New:

- `src/shared/api/queryPersister.ts` — MMKV-backed `Persister` for `@tanstack/react-query-persist-client`
- `src/app/providers/QueryProvider.tsx` — `PersistQueryClientProvider` + NetInfo → `onlineManager` wiring
- `src/features/offline/types/notes.types.ts` — `Note` type
- `src/features/offline/api/notes.api.ts` — CRUD against JSONPlaceholder `/posts` (mapped to notes), via `client.ts`
- `src/features/offline/store/offlineStore.ts` — Zustand: `isOnline`
- `src/features/offline/hooks/useNotes.ts` — query + optimistic create/delete mutations, registered with `setMutationDefaults` so paused mutations survive app restart
- `src/features/offline/components/OfflineBanner.tsx` — online/offline + pending-mutation-count pill
- `src/features/offline/screens/OfflineScreen.tsx`
- `src/features/offline/index.ts` — barrel

Modified:

- `App.tsx` — swap `QueryClientProvider` for new `QueryProvider`
- `src/shared/api/queryClient.ts` — set `gcTime: 1000 * 60 * 60 * 24` default (required so persisted data isn't GC'd before rehydration)
- `src/app/navigation/types.ts` — add `Offline: undefined;` to `AppDrawerParamList`
- `src/app/navigation/AppNavigator.tsx` — register `Offline` drawer screen
- `ReactotronConfig.ts` — add `{ name: 'offline', store: useOfflineStore }` to `stores`
- `package.json` — add `@tanstack/react-query-persist-client` (matching `^5.100.9`)

## ScreenWrapper config

`title="Offline"`, `footer` (add-note input + button), `scrollable` off (list handles its own scroll — pass list as `children`, footer pinned).

## State approach

- **Server state (TanStack Query)**: `useQuery(['notes'])` list; `useMutation` create + delete, both optimistic with rollback on error.
- **Global UI (Zustand)**: `offlineStore` — just `isOnline: boolean`, action `setOnline(bool)` (`'offline/setOnline'`). Pending-mutation count is read directly off `queryClient.getMutationCache()` in `OfflineBanner` (derived, not duplicated into state).
- **Local**: none needed.
- **Forms (RHF + Zod)**: add-note input uses `useForm` + `z.object({ title: z.string().min(1) })` per project convention, even though it's a single field.

## Props drilling check

None — `OfflineScreen` composes `useNotes()` + `OfflineBanner` (reads store/cache directly) + RHF form. Max depth 1.

## Navigation wiring

- Drawer screen `Offline` on `AppDrawer`, next to existing feature screens.
- No params needed (`undefined`).

## Libraries used

| Need                       | Lib                                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Connectivity detection     | `@react-native-community/netinfo` (already installed)                                                                                 |
| Query offline pause/resume | `@tanstack/react-query` `onlineManager` (already installed)                                                                           |
| Cache persistence          | `@tanstack/react-query-persist-client` (new dep) + custom MMKV persister (no new storage dep — `react-native-mmkv` already installed) |
| Mock notes data            | JSONPlaceholder `/posts` via existing `client.ts`                                                                                     |

## Dark/light mode

- Colors via `useAppTheme()`: `colors.success` (online pill), `colors.error` (offline pill), `colors.warning` (pending-count badge), `colors.surface`/`colors.text`/`colors.textSecondary` elsewhere.
- No conditional styles beyond token swap — theme handles both modes.

## How the mechanism works (for your interview notes too)

1. `QueryProvider` subscribes to `NetInfo.addEventListener` and calls `onlineManager.setOnline(state.isConnected)`. TanStack Query already checks `onlineManager.isOnline()` before firing queries/mutations.
2. Mutations use default `networkMode: 'online'` (TanStack default) — when offline, `mutate()` still records the mutation as **paused** instead of failing. `queryClient.getMutationCache().getAll().filter(m => m.state.isPaused)` gives you the pending count for the UI badge.
3. `setMutationDefaults(['notes', 'create'], { mutationFn })` is required so a paused mutation queued before an app restart can be resumed — the mutation fn itself can't be serialized into MMKV, only the key + variables can, so on rehydrate TanStack looks up the fn by key.
4. `onlineManager` flipping back to online triggers `queryClient.resumePausedMutations()` automatically (built into `PersistQueryClientProvider`'s resume-on-reconnect behavior via the `onlineManager` listener) — no manual queue/dequeue code needed.
5. `persistQueryClient` writes the whole query cache to MMKV on every cache change (throttled), and reads it back on cold start before first render — that's why notes list is visible offline immediately after a restart.

## Commit message

`feat(offline): add NetInfo detection, persisted query cache, and resumable optimistic mutations`
