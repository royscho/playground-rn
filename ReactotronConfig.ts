import Reactotron from 'reactotron-react-native';
import {
  QueryClientManager,
  reactotronReactQuery,
} from 'reactotron-react-query';
import { queryClient } from '@/shared/api/queryClient';
import reactotronZustand from 'reactotron-plugin-zustand';
import { useThemeStore } from '@/features/settings/store/themeStore';
import { useAuthStore } from '@/features/auth';
import { useTickerStore } from '@/features/tWhale/store/tickerStore';
import { useTickerStoreImmer } from '@/features/tWhale/store/tickerStore.immer';
import { useSalesFeedStore } from '@/features/tWhale/store/salesFeedStore';
import { useSalesFeedSseStore } from '@/features/tWhale/store/salesFeedSseStore';

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
        { name: 'ticker', store: useTickerStore },
        { name: 'tickerImmer', store: useTickerStoreImmer },
        { name: 'salesFeed', store: useSalesFeedStore },
        { name: 'salesFeedSse', store: useSalesFeedSseStore },
      ],
    }),
  )
  .connect();
