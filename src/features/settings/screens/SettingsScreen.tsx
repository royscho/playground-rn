import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { ScreenWrapper } from '@/shared/components';
import { useAppTheme } from '@/shared/hooks';
import { useThemeStore } from '@/features/settings/store/themeStore';
import type { ColorTokens } from '@/shared/theme/colors';
import type { Spacing } from '@/shared/theme/spacing';
import type { Typography } from '@/shared/theme/typography';

const THEME_ICONS = {
  dark: '🌙',
  light: '☀️',
};

export const SettingsScreen = () => {
  const { colors, spacing, typography } = useAppTheme();
  const { isDark, toggleTheme } = useThemeStore();
  const styles = createStyles(colors, spacing, typography);

  return (
    <ScreenWrapper title="Settings">
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.icon}>{isDark ? THEME_ICONS.dark : THEME_ICONS.light}</Text>
          <View>
            <Text style={styles.label}>Dark Mode</Text>
            <Text style={styles.caption}>{isDark ? 'On' : 'Off'}</Text>
          </View>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.primaryForeground}
        />
      </View>
    </ScreenWrapper>
  );
};

const createStyles = (colors: ColorTokens, spacing: Spacing, typography: Typography) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: spacing.sm + spacing.xs,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    icon: {
      fontSize: typography.h2.fontSize,
    },
    label: {
      ...typography.body,
      color: colors.text,
    },
    caption: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: spacing.xxs,
    },
  });
