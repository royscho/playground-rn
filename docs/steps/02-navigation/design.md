# Step 2 — Navigation with Typed Routes, Tabs, Drawer, Deep Linking

## Task
Wire the full React Navigation v7 structure — RootStack → AuthStack / AppDrawer → HomeTabs / PostsStack — with complete TypeScript param lists, placeholder screens for every route, and a deep linking config.

## Files to create

### Navigation core
- `src/app/navigation/types.ts` — all param list types for every navigator
- `src/app/navigation/RootNavigator.tsx` — top-level stack (AuthStack | AppDrawer)
- `src/app/navigation/AuthNavigator.tsx` — unauthenticated stack (Login, Register)
- `src/app/navigation/AppNavigator.tsx` — drawer + HomeTabs + PostsStack
- `src/app/navigation/linking.ts` — deep link config (`playground://`)

### Placeholder screens (minimal View + Text — upgraded to ScreenWrapper in step 3)
- `src/features/home/screens/DashboardScreen.tsx`
- `src/features/home/screens/FeedScreen.tsx`
- `src/features/home/screens/ExploreScreen.tsx`
- `src/features/auth/screens/LoginScreen.tsx`
- `src/features/auth/screens/RegisterScreen.tsx`
- `src/features/posts/screens/PostsListScreen.tsx`
- `src/features/posts/screens/PostDetailScreen.tsx`
- `src/features/todos/screens/TodosScreen.tsx`
- `src/features/animations/screens/AnimationsScreen.tsx`
- `src/features/forms/screens/FormsScreen.tsx`
- `src/features/realtime/screens/RealtimeScreen.tsx`
- `src/features/webview/screens/WebViewScreen.tsx`
- `src/features/notifications/screens/NotificationsScreen.tsx`
- `src/features/performance/screens/PerformanceScreen.tsx`
- `src/features/settings/screens/SettingsScreen.tsx`
- `src/features/native-modules/screens/NativeModulesScreen.tsx`
- `src/features/javascript/screens/JavaScriptScreen.tsx`
- `src/features/hooks/screens/HooksScreen.tsx`
- `src/features/typescript/screens/TypeScriptScreen.tsx`
- `src/features/analytics/screens/AnalyticsScreen.tsx`
- `src/features/remote-config/screens/RemoteConfigScreen.tsx`
- `src/features/a11y/screens/A11yScreen.tsx`
- `src/features/i18n/screens/I18nScreen.tsx`

### Modified
- `App.tsx` — add `NavigationContainer` with linking config
- `index.js` — add `import 'react-native-gesture-handler'` at top (required by drawer)
- `babel.config.js` — add `react-native-reanimated/plugin` (required by drawer v7)

## ScreenWrapper config
Not applicable — placeholder screens use `View + Text` only. Theme system and `ScreenWrapper` are built in step 3. Every placeholder will be replaced then.

## State approach
- No auth state yet — `RootNavigator` renders `AppDrawer` directly with a `// TODO step 4: swap to auth-gated root` comment
- No server state, no Zustand stores in this step
- Navigation state is managed entirely by React Navigation internals

## Props drilling check
Navigation props accessed via `useNavigation()` and `useRoute()` hooks — zero prop drilling.

## Navigation wiring

### Full tree
```
RootStack (NativeStack)
└── AppDrawer (Drawer)          ← step 4 will add AuthStack branch
    ├── HomeTabs (BottomTabs)
    │   ├── Dashboard
    │   ├── Feed
    │   └── Explore
    ├── Posts (NativeStack)
    │   ├── PostsList
    │   └── PostDetail          { id: string }
    ├── Todos
    ├── Animations
    ├── Forms
    ├── Realtime
    ├── WebView
    ├── Notifications
    ├── Performance
    ├── Settings
    ├── NativeModules
    ├── JavaScript
    ├── Hooks
    ├── TypeScript
    ├── Analytics
    ├── RemoteConfig
    ├── A11y
    └── I18n
```

### Param lists (types.ts)
```ts
export type RootStackParamList = {
  AppDrawer: NavigatorScreenParams<AppDrawerParamList>;
  // AuthStack added in step 4
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppDrawerParamList = {
  HomeTabs: NavigatorScreenParams<HomeTabsParamList>;
  Posts: NavigatorScreenParams<PostsStackParamList>;
  Todos: undefined;
  Animations: undefined;
  Forms: undefined;
  Realtime: undefined;
  WebView: undefined;
  Notifications: undefined;
  Performance: undefined;
  Settings: undefined;
  NativeModules: undefined;
  JavaScript: undefined;
  Hooks: undefined;
  TypeScript: undefined;
  Analytics: undefined;
  RemoteConfig: undefined;
  A11y: undefined;
  I18n: undefined;
};

export type HomeTabsParamList = {
  Dashboard: undefined;
  Feed: undefined;
  Explore: undefined;
};

export type PostsStackParamList = {
  PostsList: undefined;
  PostDetail: { id: string };
};
```

### Deep linking (`linking.ts`)

Two layers — URL scheme (no server needed) + Universal/App Links (requires domain, noted as out of scope):

**Layer 1 — Custom URL scheme** (`playground://`) — implemented in this step:

`linking.ts` exports a config object passed to `NavigationContainer`:
```ts
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['playground://'],
  config: {
    screens: {
      AppDrawer: {
        screens: {
          HomeTabs: {
            screens: {
              Dashboard: 'dashboard',
              Feed: 'feed',
            },
          },
          Posts: {
            screens: {
              PostsList: 'posts',
              PostDetail: 'posts/:id',  // playground://posts/42
            },
          },
          Settings: 'settings',
        },
      },
    },
  },
};
```

`App.tsx` passes it to `NavigationContainer`:
```tsx
<NavigationContainer linking={linking}>
```

**Native registration — iOS** (`ios/playground/Info.plist`):
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array><string>playground</string></array>
  </dict>
</array>
```

**Native registration — Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="playground" />
</intent-filter>
```

**Test from terminal:**
```bash
# iOS simulator
xcrun simctl openurl booted "playground://posts/42"

# Android emulator
adb shell am start -W -a android.intent.action.VIEW -d "playground://posts/42"
```

**Layer 2 — Universal Links (iOS) / App Links (Android)** — out of scope for this step. Requires:
- A real domain with HTTPS
- Hosted `apple-app-site-association` file (iOS)
- Hosted `assetlinks.json` file (Android)
- Add domain to `prefixes` array alongside the URL scheme

## Android back handler

React Navigation handles back automatically for stacks and tabs. Two cases need explicit handling:

| Case | Behaviour | Where |
|---|---|---|
| Drawer is open + back pressed | Close drawer, stay on screen | Handled automatically by `@react-navigation/drawer` |
| On root tab (Dashboard) + back pressed | "Press back again to exit" toast, then `BackHandler.exitApp()` | `useBackHandler` hook in `AppNavigator` or `DashboardScreen` |

Implementation in `AppNavigator.tsx`:
```ts
const navigation = useNavigation();
const backPressedOnce = useRef(false);

useEffect(() => {
  const sub = BackHandler.addEventListener('hardwareBackPress', () => {
    if (navigation.canGoBack()) return false; // let RN handle it
    if (backPressedOnce.current) { BackHandler.exitApp(); return true; }
    backPressedOnce.current = true;
    ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
    setTimeout(() => { backPressedOnce.current = false; }, 2000);
    return true;
  });
  return () => sub.remove();
}, [navigation]);
```

## Libraries used

| Need | Library |
|---|---|
| Navigation core | `@react-navigation/native` |
| Native stack | `@react-navigation/native-stack` |
| Drawer | `@react-navigation/drawer` |
| Bottom tabs | `@react-navigation/bottom-tabs` |
| Peer dep (screens) | `react-native-screens` |
| Peer dep (gestures) | `react-native-gesture-handler` |
| Peer dep (animations — required by drawer v7) | `react-native-reanimated` |

## Dark/light mode
Not applicable — placeholder screens have no themed styles. Step 3 introduces `useAppTheme()`.

## Commit message
`feat(navigation): typed routes, tabs, drawer, and deep linking`
