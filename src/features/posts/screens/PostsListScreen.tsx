import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const PostsListScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Posts" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 7 will add CRUD + infinite scroll
      </Text>
    </ScreenWrapper>
  );
};
