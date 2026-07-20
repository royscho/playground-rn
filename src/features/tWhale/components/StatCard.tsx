import { useAppTheme } from '@/shared/hooks';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import React, { FC } from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface Props {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'flat';
  trendText?: string | number;
  variant?: 'default' | 'success' | 'warning';
}

const StatCard: FC<Props> = ({
  label,
  value,
  trend,
  trendText,
  variant = 'default',
}) => {
  const { colors, spacing, typography } = useAppTheme();

  return (
    <View
      style={[
        style.container,
        variant === 'success' && { borderColor: colors.success },
        variant === 'warning' && { borderColor: colors.warning },
        variant !== 'default' && style.border,
        {
          backgroundColor: colors.surface,
          padding: spacing.md,
          borderRadius: spacing.sm,
        },
      ]}
    >
      <Text
        style={[
          style.title,
          { color: colors.textSecondary, ...typography.label },
        ]}
      >
        {label}
      </Text>
      <View style={[style.row, { gap: spacing.sm }]}>
        <Text style={{ color: colors.text, ...typography.h3 }}>{value}</Text>
        {trend === 'up' && <TrendingUp size={12} color={colors.success} />}
        {trend === 'down' && <TrendingDown size={12} color={colors.error} />}
        {(trend === 'up' || trend === 'down') && (
          <Text
            style={[
              {
                color: trend === 'up' ? colors.success : colors.error,
                ...typography.label,
              },
            ]}
          >
            {trendText}
          </Text>
        )}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {},
  border: {
    borderLeftWidth: 3,
  },
  title: {
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default StatCard;
