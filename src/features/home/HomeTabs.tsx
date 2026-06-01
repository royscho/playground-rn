import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Rss, Compass } from 'lucide-react-native';
import type { HomeTabsParamList } from '@/app/navigation/types';
import { useAppTheme } from '@/shared/hooks';
import { DashboardScreen } from './screens/DashboardScreen';
import { FeedScreen } from './screens/FeedScreen';
import { ExploreScreen } from './screens/ExploreScreen';

const Tab = createBottomTabNavigator<HomeTabsParamList>();

const TAB_ICON_SIZE = 22;

const dashboardIcon = ({ color }: { color: string }) => (
  <LayoutDashboard size={TAB_ICON_SIZE} color={color} />
);
const feedIcon = ({ color }: { color: string }) => (
  <Rss size={TAB_ICON_SIZE} color={color} />
);
const exploreIcon = ({ color }: { color: string }) => (
  <Compass size={TAB_ICON_SIZE} color={color} />
);

export const HomeTabs = () => {
  const { colors, typography } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: typography.label.fontSize,
          fontWeight: typography.label.fontWeight,
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: dashboardIcon }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{ tabBarIcon: feedIcon }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ tabBarIcon: exploreIcon }}
      />
    </Tab.Navigator>
  );
};
