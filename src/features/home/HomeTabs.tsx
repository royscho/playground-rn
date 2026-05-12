import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { HomeTabsParamList } from '@/app/navigation/types';
import { DashboardScreen } from './screens/DashboardScreen';
import { FeedScreen } from './screens/FeedScreen';
import { ExploreScreen } from './screens/ExploreScreen';

const Tab = createBottomTabNavigator<HomeTabsParamList>();

export const HomeTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Feed" component={FeedScreen} />
    <Tab.Screen name="Explore" component={ExploreScreen} />
  </Tab.Navigator>
);
