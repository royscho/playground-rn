import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const FormsScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Forms" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 11 will add React Hook Form + Zod
      </Text>
    </ScreenWrapper>
  );
};
