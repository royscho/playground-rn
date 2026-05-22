import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const AnimationsScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Animations" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 12 will add Reanimated 3 demos
      </Text>
    </ScreenWrapper>
  );
};
