import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { HomeTabsParamList } from '@/app/navigation/types';
import { useAppTheme } from '@/shared/hooks';
import { DashboardScreen } from './screens/DashboardScreen';
import { FeedScreen } from './screens/FeedScreen';
import { ExploreScreen } from './screens/ExploreScreen';

const Tab = createBottomTabNavigator<HomeTabsParamList>();

export const HomeTabs = () => {
  const { colors, typography } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarIcon: () => null,
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
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
    </Tab.Navigator>
  );
};
