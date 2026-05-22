import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const A11yScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Accessibility" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 31 will add a11y patterns + audit
      </Text>
    </ScreenWrapper>
  );
};
