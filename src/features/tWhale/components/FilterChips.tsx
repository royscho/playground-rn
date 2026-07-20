import { useAppTheme } from '@/shared/hooks';
import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type FilterMode = 'all' | 'active';

interface Props {
  filterMode: FilterMode;
  onChange: (mode: FilterMode) => void;
}

const OPTIONS: { mode: FilterMode; label: string }[] = [
  { mode: 'all', label: 'All' },
  { mode: 'active', label: 'Active Only' },
];

const FilterChips: FC<Props> = ({ filterMode, onChange }) => {
  const { colors, spacing, typography } = useAppTheme();

  return (
    <View style={[styles.row, { gap: spacing.sm, marginHorizontal: spacing.md }]}>
      {OPTIONS.map(({ mode, label }) => {
        const selected = filterMode === mode;
        return (
          <TouchableOpacity
            key={mode}
            onPress={() => onChange(mode)}
            style={[
              styles.chip,
              {
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                backgroundColor: selected ? colors.primary : colors.surface,
              },
            ]}
          >
            <Text
              style={{
                color: selected ? colors.primaryForeground : colors.text,
                ...typography.label,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  chip: {
    borderRadius: 16,
  },
});

export default React.memo(FilterChips);
