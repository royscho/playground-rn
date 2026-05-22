import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const TypeScriptScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="TypeScript" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 23 will add TS patterns reference
      </Text>
    </ScreenWrapper>
  );
};
