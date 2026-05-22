import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const TodosScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Todos" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 7 will add optimistic updates
      </Text>
    </ScreenWrapper>
  );
};
