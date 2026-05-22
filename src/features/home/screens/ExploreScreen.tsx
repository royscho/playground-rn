import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const ExploreScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Explore" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 7 will add explore content
      </Text>
    </ScreenWrapper>
  );
};
