import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const RegisterScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Register" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 4 will add auth logic
      </Text>
    </ScreenWrapper>
  );
};
