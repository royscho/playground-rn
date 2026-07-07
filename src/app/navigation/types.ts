import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppDrawer: NavigatorScreenParams<AppDrawerParamList>;
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
  NativeModules: undefined;
  JavaScript: undefined;
  Hooks: undefined;
  TypeScript: undefined;
  Analytics: undefined;
  RemoteConfig: undefined;
  A11y: undefined;
  I18n: undefined;
  Offline: undefined;
};

export type HomeTabsParamList = {
  Feed: undefined;
  Explore: undefined;
  Settings: undefined;
};

export type PostsStackParamList = {
  PostsList: undefined;
  PostDetail: { id: string };
};
