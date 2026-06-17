import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Rss, Compass, Settings } from 'lucide-react-native';
import type { HomeTabsParamList } from '@/app/navigation/types';
import { useAppTheme } from '@/shared/hooks';
import { FeedScreen } from './screens/FeedScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { SettingsScreen } from '@/features/settings';

const Tab = createBottomTabNavigator<HomeTabsParamList>();

const TAB_ICON_SIZE = 22;

const feedIcon = ({ color }: { color: string }) => (
  <Rss size={TAB_ICON_SIZE} color={color} />
);
const exploreIcon = ({ color }: { color: string }) => (
  <Compass size={TAB_ICON_SIZE} color={color} />
);
const settingsIcon = ({ color }: { color: string }) => (
  <Settings size={TAB_ICON_SIZE} color={color} />
);

export const HomeTabs = () => {
  const { colors, typography } = useAppTheme();

  return (
    <Tab.Navigator
      backBehavior="none"
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
        name="Feed"
        component={FeedScreen}
        options={{ tabBarIcon: feedIcon }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ tabBarIcon: exploreIcon }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: settingsIcon }}
      />
    </Tab.Navigator>
  );
};
