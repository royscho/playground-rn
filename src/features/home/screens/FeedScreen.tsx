import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const FeedScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Feed" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 7 will add infinite scroll feed
      </Text>
    </ScreenWrapper>
  );
};
