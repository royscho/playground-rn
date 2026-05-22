import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const RealtimeScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Realtime" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 13 will add WebSocket + Socket.IO
      </Text>
    </ScreenWrapper>
  );
};
