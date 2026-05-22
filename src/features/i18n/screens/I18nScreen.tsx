import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const I18nScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="i18n & RTL" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 27 will add i18next + RTL support
      </Text>
    </ScreenWrapper>
  );
};
