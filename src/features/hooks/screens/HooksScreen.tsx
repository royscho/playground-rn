import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const HooksScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Hooks" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 22 will add React hooks reference
      </Text>
    </ScreenWrapper>
  );
};
