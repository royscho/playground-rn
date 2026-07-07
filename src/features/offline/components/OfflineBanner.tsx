import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/shared/hooks';
import { useIsOnline } from '../hooks/useIsOnline';
import { usePendingMutationsCount } from '../hooks/usePendingMutationsCount';

export const OfflineBanner = () => {
  const { colors, spacing, typography } = useAppTheme();
  const isOnline = useIsOnline();
  const pendingCount = usePendingMutationsCount();

  const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.sm },
    statusPill: {
      backgroundColor: isOnline ? colors.success : colors.error,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      borderRadius: spacing.sm,
    },
    statusText: { ...typography.label, color: colors.primaryForeground },
    pendingPill: {
      backgroundColor: colors.warning,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      borderRadius: spacing.sm,
    },
    pendingText: { ...typography.label, color: colors.primaryForeground },
  });

  return (
    <View style={styles.row}>
      <View style={styles.statusPill}>
        <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
      </View>
      {pendingCount > 0 && (
        <View style={styles.pendingPill}>
          <Text style={styles.pendingText}>{pendingCount} pending sync</Text>
        </View>
      )}
    </View>
  );
};
