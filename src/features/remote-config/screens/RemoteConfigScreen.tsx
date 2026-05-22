import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const RemoteConfigScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Remote Config" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 30 will add Firebase Remote Config
      </Text>
    </ScreenWrapper>
  );
};
