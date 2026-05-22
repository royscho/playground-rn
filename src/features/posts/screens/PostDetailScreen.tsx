import React from 'react';
import { Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { PostsStackParamList } from '@/app/navigation/types';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

type PostDetailRouteProp = RouteProp<PostsStackParamList, 'PostDetail'>;

export const PostDetailScreen = () => {
  const { params } = useRoute<PostDetailRouteProp>();
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title={`Post #${params.id}`} showBackButton centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 7 will add full post detail
      </Text>
    </ScreenWrapper>
  );
};
