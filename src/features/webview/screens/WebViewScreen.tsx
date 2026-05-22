import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const WebViewScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="WebView" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 14 will add JS bridge + OAuth
      </Text>
    </ScreenWrapper>
  );
};
