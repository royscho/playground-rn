import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthorizationStatus } from '@notifee/react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';
import { useNotificationPermission } from '../useNotificationPermission';
import {
  displayLocalNotification,
  scheduleLocalNotification,
} from '../notifee';

const statusLabel = (status: AuthorizationStatus | null) => {
  switch (status) {
    case AuthorizationStatus.AUTHORIZED:
      return 'Authorized';
    case AuthorizationStatus.DENIED:
      return 'Denied';
    case AuthorizationStatus.PROVISIONAL:
      return 'Provisional';
    case AuthorizationStatus.NOT_DETERMINED:
      return 'Not determined';
    default:
      return 'Unknown';
  }
};

export const NotificationsScreen = () => {
  const { colors, spacing, typography } = useAppTheme();
  const { status, isGranted, request } = useNotificationPermission();

  return (
    <ScreenWrapper title="Notifications">
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, padding: spacing.md },
        ]}
      >
        <Text style={{ color: colors.textSecondary, ...typography.label }}>
          Permission status
        </Text>
        <Text
          style={{
            color: isGranted ? colors.success : colors.error,
            ...typography.h3,
            marginTop: spacing.xs,
          }}
        >
          {statusLabel(status)}
        </Text>
      </View>

      {!isGranted && (
        <TouchableOpacity
          onPress={request}
          style={[
            styles.button,
            { backgroundColor: colors.primary, marginTop: spacing.md },
          ]}
        >
          <Text
            style={{ color: colors.primaryForeground, ...typography.label }}
          >
            Request Permission
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        disabled={!isGranted}
        onPress={() =>
          displayLocalNotification('Hello 👋', 'This showed up immediately.')
        }
        style={[
          styles.button,
          {
            backgroundColor: colors.primary,
            marginTop: spacing.md,
            opacity: isGranted ? 1 : 0.4,
          },
        ]}
      >
        <Text style={{ color: colors.primaryForeground, ...typography.label }}>
          Show now
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={!isGranted}
        onPress={() =>
          scheduleLocalNotification(
            'Reminder ⏰',
            'This was scheduled 5 seconds ago.',
            5000,
          )
        }
        style={[
          styles.button,
          {
            backgroundColor: colors.secondary,
            marginTop: spacing.md,
            opacity: isGranted ? 1 : 0.4,
          },
        ]}
      >
        <Text style={{ color: colors.text, ...typography.label }}>
          Schedule in 5s
        </Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
  },
  button: {
    alignItems: 'center',
    borderRadius: 4,
    paddingVertical: 12,
  },
});
