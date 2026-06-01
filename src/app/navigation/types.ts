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
