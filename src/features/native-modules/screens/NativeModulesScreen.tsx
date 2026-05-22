import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const NativeModulesScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Native Modules" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 17 will add Turbo Module
      </Text>
    </ScreenWrapper>
  );
};
