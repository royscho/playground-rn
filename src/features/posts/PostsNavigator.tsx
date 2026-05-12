import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PostsStackParamList } from '@/app/navigation/types';
import { PostsListScreen } from './screens/PostsListScreen';
import { PostDetailScreen } from './screens/PostDetailScreen';

const Stack = createNativeStackNavigator<PostsStackParamList>();

export const PostsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="PostsList" component={PostsListScreen} options={{ title: 'Posts' }} />
    <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Post' }} />
  </Stack.Navigator>
);
