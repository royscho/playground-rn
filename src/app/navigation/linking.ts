import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

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
              Explore: 'explore',
            },
          },
          Posts: {
            screens: {
              PostsList: 'posts',
              PostDetail: 'posts/:id',
            },
          },
          Todos: 'todos',
          Settings: 'settings',
          Animations: 'animations',
          Forms: 'forms',
          Realtime: 'realtime',
          WebView: 'webview',
          Notifications: 'notifications',
          Performance: 'performance',
          NativeModules: 'native-modules',
          JavaScript: 'javascript',
          Hooks: 'hooks',
          TypeScript: 'typescript',
          Analytics: 'analytics',
          RemoteConfig: 'remote-config',
          A11y: 'a11y',
          I18n: 'i18n',
        },
      },
    },
  },
};
