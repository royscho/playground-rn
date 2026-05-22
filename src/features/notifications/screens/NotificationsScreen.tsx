import React from 'react';
import { Text } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';

export const NotificationsScreen = () => {
  const { colors, typography } = useAppTheme();
  return (
    <ScreenWrapper title="Notifications" centered>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Step 10 will add FCM + Notifee
      </Text>
    </ScreenWrapper>
  );
};
