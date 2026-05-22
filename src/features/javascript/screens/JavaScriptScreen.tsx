import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const JavaScriptScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="JavaScript" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 21 will add JS concepts reference
      </Text>
    </ScreenWrapper>
  );
};
