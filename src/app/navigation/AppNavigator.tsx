import React, { useEffect, useRef } from 'react';
import { BackHandler, ToastAndroid, Platform, StyleSheet } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from '@react-navigation/native';
import type { AppDrawerParamList, MainStackParamList } from './types';

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
import SummaryScreen from '@/features/twTaskSummery/screens/SummaryScreen';

const Drawer = createDrawerNavigator<AppDrawerParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

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

// Drawer items that push onto MainStack (on top of HomeTabs). Native
// stack swipe-back then returns to HomeTabs for free — no custom gesture
// needed. HomeTabs itself isn't listed here; it's the stack's base.
const DRAWER_ITEMS: Array<{ name: keyof MainStackParamList; label: string }> = [
  { name: 'Posts', label: 'Posts' },
  { name: 'Todos', label: 'Todos' },
  { name: 'Animations', label: 'Animations' },
  { name: 'Forms', label: 'Forms' },
  { name: 'Realtime', label: 'Realtime' },
  { name: 'WebView', label: 'WebView' },
  { name: 'Notifications', label: 'Notifications' },
  { name: 'Performance', label: 'Performance' },
  { name: 'NativeModules', label: 'Native Modules' },
  { name: 'JavaScript', label: 'JavaScript' },
  { name: 'Hooks', label: 'Hooks' },
  { name: 'TypeScript', label: 'TypeScript' },
  { name: 'Analytics', label: 'Analytics' },
  { name: 'RemoteConfig', label: 'Remote Config' },
  { name: 'A11y', label: 'Accessibility' },
  { name: 'I18n', label: 'i18n & RTL' },
  { name: 'Offline', label: 'Offline' },
  { name: 'Ticker', label: 'Ticker' },
  { name: 'TickerList', label: 'Ticker List' },
  { name: 'SpendChart', label: 'Spend & Revenue' },
  { name: 'SalesFeed', label: 'Live Sales' },
  { name: 'TickerMobx', label: 'Ticker (MobX)' },
  { name: 'TickerRtk', label: 'Ticker (RTK)' },
  { name: 'SummaryScreen', label: 'Summary Screen' },
];

const CustomDrawerContent = (props: DrawerContentComponentProps) => (
  <DrawerContentScrollView {...props}>
    <DrawerItem
      label="Home"
      style={styles.hidden}
      onPress={() => {
        props.navigation.navigate('Main', {
          screen: 'HomeTabs',
          params: { screen: 'Feed' },
        });
        props.navigation.closeDrawer();
      }}
    />
    {DRAWER_ITEMS.map(({ name, label }) => (
      <DrawerItem
        key={name}
        label={label}
        onPress={() => {
          props.navigation.navigate('Main', { screen: name } as never);
          props.navigation.closeDrawer();
        }}
      />
    ))}
  </DrawerContentScrollView>
);

const MainStackNavigator = () => (
  <Stack.Navigator
    initialRouteName="HomeTabs"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="HomeTabs" component={HomeTabs} />
    <Stack.Screen name="Posts" component={PostsNavigator} />
    <Stack.Screen name="Todos" component={TodosScreen} />
    <Stack.Screen name="Animations" component={AnimationsScreen} />
    <Stack.Screen name="Forms" component={FormsScreen} />
    <Stack.Screen name="Realtime" component={RealtimeScreen} />
    <Stack.Screen name="WebView" component={WebViewScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Performance" component={PerformanceScreen} />
    <Stack.Screen
      name="NativeModules"
      component={NativeModulesScreen}
      options={{ title: 'Native Modules' }}
    />
    <Stack.Screen name="JavaScript" component={JavaScriptScreen} />
    <Stack.Screen name="Hooks" component={HooksScreen} />
    <Stack.Screen name="TypeScript" component={TypeScriptScreen} />
    <Stack.Screen name="Analytics" component={AnalyticsScreen} />
    <Stack.Screen
      name="RemoteConfig"
      component={RemoteConfigScreen}
      options={{ title: 'Remote Config' }}
    />
    <Stack.Screen
      name="A11y"
      component={A11yScreen}
      options={{ title: 'Accessibility' }}
    />
    <Stack.Screen
      name="I18n"
      component={I18nScreen}
      options={{ title: 'i18n & RTL' }}
    />
    <Stack.Screen name="Offline" component={OfflineScreen} />
    <Stack.Screen name="Ticker" component={LiveTicker} />
    <Stack.Screen name="TickerList" component={LiveTickerList} />
    <Stack.Screen
      name="SpendChart"
      component={SpendChartScreen}
      options={{ title: 'Spend & Revenue' }}
    />
    <Stack.Screen
      name="SalesFeed"
      component={LiveSalesFeedScreen}
      options={{ title: 'Live Sales' }}
    />
    <Stack.Screen
      name="TickerMobx"
      component={LiveTickerMobx}
      options={{ title: 'Ticker (MobX)' }}
    />
    <Stack.Screen
      name="TickerRtk"
      component={LiveTickerRtk}
      options={{ title: 'Ticker (RTK)' }}
    />
    <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  useAndroidBackHandler();

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerType: 'front',
        // Only allow the drawer's own edge-swipe-to-open on HomeTabs (the
        // stack's base) — everywhere else that edge is native-stack's
        // free swipe-back-to-HomeTabs gesture instead.
        swipeEnabled:
          (getFocusedRouteNameFromRoute(route) ?? 'HomeTabs') === 'HomeTabs',
      })}
    >
      <Drawer.Screen name="Main" component={MainStackNavigator} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
});
