import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const PerformanceScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Performance" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 19 will add FlashList + profiling
      </Text>
    </ScreenWrapper>
  );
};
