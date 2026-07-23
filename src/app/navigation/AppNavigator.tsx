import React, { useEffect, useRef } from 'react';
import { BackHandler, ToastAndroid, Platform } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import type { AppDrawerParamList } from './types';

import { HomeTabs } from '@/features/home';
import { PostsNavigator } from '@/features/posts';
import { TodosScreen } from '@/features/todos';
import { AnimationsScreen } from '@/features/animations';
import { FormsScreen } from '@/features/forms';
import { RealtimeScreen } from '@/features/realtime';
import { WebViewScreen } from '@/features/webview';
import { NotificationsScreen } from '@/features/notifications';
import { PerformanceScreen } from '@/features/performance';
import { NativeModulesScreen } from '@/features/native-modules';
import { JavaScriptScreen } from '@/features/javascript';
import { HooksScreen } from '@/features/hooks';
import { TypeScriptScreen } from '@/features/typescript';
import { AnalyticsScreen } from '@/features/analytics';
import { RemoteConfigScreen } from '@/features/remote-config';
import { A11yScreen } from '@/features/a11y';
import { I18nScreen } from '@/features/i18n';
import { OfflineScreen } from '@/features/offline';
import LiveTicker from '@/features/tWhale/screens/LiveTicker';
import LiveTickerMobx from '@/features/tWhale/screens/LiveTickerMobx';
import LiveTickerRtk from '@/features/tWhale/screens/LiveTickerRtk';
import LiveTickerList from '@/features/tWhale/screens/LiveTickerList';
import SpendChartScreen from '@/features/tWhale/screens/SpendChartScreen';
import LiveSalesFeedScreen from '@/features/tWhale/screens/LiveSalesFeedScreen';

const Drawer = createDrawerNavigator<AppDrawerParamList>();

const BACK_EXIT_TIMEOUT_MS = 2000;

const useAndroidBackHandler = () => {
  const navigation = useNavigation();
  const navigationRef = useRef(navigation);
  navigationRef.current = navigation;
  const backPressedOnce = useRef(false);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigationRef.current.canGoBack()) return false;
      if (backPressedOnce.current) {
        BackHandler.exitApp();
        return true;
      }
      backPressedOnce.current = true;
      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      timeoutId = setTimeout(() => {
        backPressedOnce.current = false;
      }, BACK_EXIT_TIMEOUT_MS);
      return true;
    });
    return () => {
      sub.remove();
      clearTimeout(timeoutId);
    };
  }, []);
};

export const AppNavigator = () => {
  useAndroidBackHandler();

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false, drawerType: 'front' }}
    >
      <Drawer.Screen name="HomeTabs" component={HomeTabs} />
      <Drawer.Screen name="Posts" component={PostsNavigator} />
      <Drawer.Screen name="Todos" component={TodosScreen} />
      <Drawer.Screen name="Animations" component={AnimationsScreen} />
      <Drawer.Screen name="Forms" component={FormsScreen} />
      <Drawer.Screen name="Realtime" component={RealtimeScreen} />
      <Drawer.Screen name="WebView" component={WebViewScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Performance" component={PerformanceScreen} />
      <Drawer.Screen
        name="NativeModules"
        component={NativeModulesScreen}
        options={{ title: 'Native Modules' }}
      />
      <Drawer.Screen name="JavaScript" component={JavaScriptScreen} />
      <Drawer.Screen name="Hooks" component={HooksScreen} />
      <Drawer.Screen name="TypeScript" component={TypeScriptScreen} />
      <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
      <Drawer.Screen
        name="RemoteConfig"
        component={RemoteConfigScreen}
        options={{ title: 'Remote Config' }}
      />
      <Drawer.Screen
        name="A11y"
        component={A11yScreen}
        options={{ title: 'Accessibility' }}
      />
      <Drawer.Screen
        name="I18n"
        component={I18nScreen}
        options={{ title: 'i18n & RTL' }}
      />
      <Drawer.Screen name="Offline" component={OfflineScreen} />
      <Drawer.Screen name="Ticker" component={LiveTicker} />
      <Drawer.Screen name="TickerList" component={LiveTickerList} />
      <Drawer.Screen
        name="SpendChart"
        component={SpendChartScreen}
        options={{ title: 'Spend & Revenue' }}
      />
      <Drawer.Screen
        name="SalesFeed"
        component={LiveSalesFeedScreen}
        options={{ title: 'Live Sales' }}
      />
      <Drawer.Screen
        name="TickerMobx"
        component={LiveTickerMobx}
        options={{ title: 'Ticker (MobX)' }}
      />
      <Drawer.Screen
        name="TickerRtk"
        component={LiveTickerRtk}
        options={{ title: 'Ticker (RTK)' }}
      />
    </Drawer.Navigator>
  );
};
