import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import type { ColorTokens } from '@/shared/theme/colors';
import type { Spacing } from '@/shared/theme/spacing';
import type { Typography } from '@/shared/theme/typography';

const HEADER_MIN_HEIGHT = 52;
const HEADER_SLOT_SIZE = 40;

interface ScreenWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  showBackButton?: boolean;
  footer?: React.ReactNode;
  form?: boolean;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  scrollable?: boolean;
  padded?: boolean;
  centered?: boolean;
}

export const ScreenWrapper = ({
  children,
  title,
  subtitle,
  headerRight,
  showBackButton = false,
  footer,
  form = false,
  loading = false,
  error = null,
  onRetry,
  scrollable = true,
  padded = true,
  centered = false,
}: ScreenWrapperProps) => {
  const { colors, spacing, typography } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const styles = createStyles(colors, spacing, typography, insets, padded, centered);

  const canOpenDrawer = (() => {
    try {
      let nav = navigation.getParent();
      while (nav) {
        if (nav.getState()?.type === 'drawer') return true;
        nav = nav.getParent();
      }
      if (navigation.getState()?.type === 'drawer') return true;
      return false;
    } catch {
      return false;
    }
  })();

  const showHeader = !!title;

  const content = loading ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading…</Text>
    </View>
  ) : error ? (
    <View style={styles.centered}>
      <Text style={styles.errorText}>{error.message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  ) : scrollable ? (
    <ScrollView
      style={styles.body}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.nonScrollContent}>{children}</View>
  );

  const inner = (
    <View style={styles.root}>
      {showHeader && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {showBackButton ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Text style={styles.backChevron}>‹</Text>
              </TouchableOpacity>
            ) : canOpenDrawer ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                accessibilityRole="button"
                accessibilityLabel="Open menu"
              >
                <Text style={styles.menuIcon}>☰</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitleText} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          <View style={styles.headerRight}>{headerRight ?? null}</View>
        </View>
      )}

      {content}

      {footer && !loading && !error && (
        <View style={styles.footer}>{footer}</View>
      )}
    </View>
  );

  if (form) {
    return (
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {inner}
      </KeyboardAvoidingView>
    );
  }

  return inner;
};

const createStyles = (
  colors: ColorTokens,
  spacing: Spacing,
  typography: Typography,
  insets: EdgeInsets,
  padded: boolean,
  centered: boolean,
) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: insets.top,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      minHeight: HEADER_MIN_HEIGHT,
    },
    headerLeft: {
      width: HEADER_SLOT_SIZE,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
    },
    headerRight: {
      width: HEADER_SLOT_SIZE,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    backButton: {
      padding: spacing.xs,
    },
    backChevron: {
      fontSize: typography.h2.fontSize,
      color: colors.primary,
    },
    menuIcon: {
      fontSize: typography.h3.fontSize,
      color: colors.text,
    },
    titleText: {
      ...typography.h3,
      color: colors.text,
      textAlign: 'center',
    },
    subtitleText: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.xxs,
    },
    body: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: padded ? spacing.md : 0,
      ...(centered && {
        flexGrow: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
      }),
    },
    nonScrollContent: {
      flex: 1,
      padding: padded ? spacing.md : 0,
      ...(centered && {
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
      }),
    },
    footer: {
      paddingHorizontal: spacing.md,
      paddingBottom: insets.bottom + spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    centered: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    loadingText: {
      ...typography.body,
      color: colors.textSecondary,
      marginTop: spacing.sm,
    },
    errorText: {
      ...typography.body,
      color: colors.error,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: spacing.sm,
    },
    retryText: {
      ...typography.label,
      color: colors.primaryForeground,
    },
    kav: {
      flex: 1,
    },
  });
