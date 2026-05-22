import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const LoginScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Login" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 4 will add auth logic
      </Text>
    </ScreenWrapper>
  );
};
