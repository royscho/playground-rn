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
import { ChevronLeft, Menu } from 'lucide-react-native';
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
  const styles = createStyles(
    colors,
    spacing,
    typography,
    insets,
    padded,
    centered,
  );

  const canGoBack = navigation.canGoBack();

  const canOpenDrawer = (() => {
    if (canGoBack) return false;
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

  const hasFooter = footer && !loading && !error;
  // A ScrollView with automaticallyAdjustKeyboardInsets already resizes
  // itself for the keyboard on its own (iOS native content-inset
  // adjustment) — wrapping it in KeyboardAvoidingView too double-applies
  // the keyboard height, which was pushing focused fields near the end of
  // a long form completely out of view instead of just under-scrolling.
  // So for a scrollable form, the footer moves INSIDE the scroll content
  // (participates in the same inset adjustment) instead of sitting as a
  // separate fixed sibling that KeyboardAvoidingView used to also need to
  // account for.
  const inlineFooter = form && scrollable && hasFooter;
  const fixedFooter = hasFooter && !inlineFooter;

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
      contentContainerStyle={[
        styles.scrollContent,
        form && styles.formScrollContent,
      ]}
      keyboardShouldPersistTaps="handled"
      // iOS: automatically scrolls so the focused input stays above the
      // keyboard — no manual onFocus/measure/scrollTo plumbing needed.
      // No Android equivalent prop; KeyboardAvoidingView's `height`
      // behavior there resizes the view instead, which usually keeps the
      // focused field visible without extra scroll logic.
      automaticallyAdjustKeyboardInsets={form}
    >
      {children}
      {inlineFooter && <View style={styles.inlineFooter}>{footer}</View>}
    </ScrollView>
  ) : (
    <View style={styles.nonScrollContent}>{children}</View>
  );

  const inner = (
    <View style={styles.root}>
      {showHeader && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {showBackButton || canGoBack ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <ChevronLeft size={24} color={colors.primary} />
              </TouchableOpacity>
            ) : canOpenDrawer ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                accessibilityRole="button"
                accessibilityLabel="Open menu"
              >
                <Menu size={22} color={colors.text} />
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

      {fixedFooter && <View style={styles.footer}>{footer}</View>}
    </View>
  );

  // Only wrap in KeyboardAvoidingView when there's no ScrollView handling
  // its own keyboard inset (see automaticallyAdjustKeyboardInsets above) —
  // a non-scrollable form still needs KeyboardAvoidingView since there's
  // nothing else pushing its footer above the keyboard.
  if (form && !scrollable) {
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
    formScrollContent: {
      paddingBottom: spacing.md,
    },
    inlineFooter: {
      paddingHorizontal: 0,
      paddingTop: spacing.md,
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
