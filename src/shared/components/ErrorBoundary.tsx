import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import type { ColorTokens } from '@/shared/theme/colors';
import type { Spacing } from '@/shared/theme/spacing';
import type { Typography } from '@/shared/theme/typography';

type FallbackProps = {
  onRetry: () => void;
};

// Error boundaries must be class components — there's no hook equivalent
// for getDerivedStateFromError/componentDidCatch. Theming still works by
// delegating all rendering to ErrorFallback below, a normal function
// component that can call useAppTheme().
const ErrorFallback = ({ onRetry }: FallbackProps) => {
  const { colors, spacing, typography } = useAppTheme();
  const styles = createStyles(colors, spacing, typography);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>This screen hit an unexpected error.</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // No crash-reporting SDK installed in this repo yet (see notifee.ts's
    // Sentry-guard comment) — console.error is the honest placeholder.
    // Wire a real Sentry.captureException(error) call here, guarded by
    // !__DEV__ per the CLAUDE.md rule, once that SDK is actually added.
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={this.resetError} />;
    }
    return this.props.children;
  }
}

const createStyles = (colors: ColorTokens, spacing: Spacing, typography: Typography) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: spacing.lg,
    },
    title: {
      ...typography.h3,
      color: colors.text,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    message: {
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
  });
