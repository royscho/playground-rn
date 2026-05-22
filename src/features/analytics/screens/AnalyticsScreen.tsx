import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const AnalyticsScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Analytics" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 28 will add Firebase Analytics
      </Text>
    </ScreenWrapper>
  );
};
