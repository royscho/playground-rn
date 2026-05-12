import Reactotron from 'reactotron-react-native';
import {
  QueryClientManager,
  reactotronReactQuery,
} from 'reactotron-react-query';
import { queryClient } from '@/shared/api/queryClient';
import reactotronZustand from 'reactotron-plugin-zustand';
// Add each new Zustand store here as it's created:
// import { useAuthStore } from '@/features/auth/store/authStore';
// import { useThemeStore } from '@/features/settings/store/themeStore';

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
        // { name: 'auth',    store: useAuthStore },
        // { name: 'theme',   store: useThemeStore },
      ],
    }),
  )
  .connect();
