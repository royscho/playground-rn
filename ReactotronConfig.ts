import Reactotron from 'reactotron-react-native';
import {
  QueryClientManager,
  reactotronReactQuery,
} from 'reactotron-react-query';
import { queryClient } from '@/shared/api/queryClient';
import reactotronZustand from 'reactotron-plugin-zustand';
import { useThemeStore } from '@/features/settings/store/themeStore';
import { useAuthStore } from '@/features/auth';

const queryClientManager = new QueryClientManager({
  // @ts-ignore
  queryClient,
});

Reactotron.configure({
  onDisconnect: () => {
    queryClientManager.unsubscribe();
  },
})
  .useReactNative()
  .use(reactotronReactQuery(queryClientManager))
  .use(
    reactotronZustand({
      stores: [
        { name: 'auth', store: useAuthStore },
        { name: 'theme', store: useThemeStore },
      ],
    }),
  )
  .connect();
