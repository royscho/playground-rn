import { useAppTheme } from '@/shared/hooks';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SummaryMetric } from '../types';
import React, { FC } from 'react';
import { ArrowDown, ArrowUp, PinIcon } from 'lucide-react-native';
import SimpleLineChart from './Chart';
import { usePinned } from '../hooks/usePinned';

type Props = {
  item: SummaryMetric;
};

const CardMetric: FC<Props> = ({ item }) => {
  const { spacing, colors, typography } = useAppTheme();
  const togglePinned = usePinned(state => state.togglePinned);
  const isPinned = usePinned(state => state.pinned.has(item.id));

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: spacing.sm,
        padding: spacing.md,
        marginBottom: spacing.sm,
        gap: spacing.sm,
      }}
    >
      <Text
        numberOfLines={1}
        style={[{ color: colors.text }, { ...typography.label }]}
      >
        {item.label}
      </Text>
      <Text
        style={[{ color: colors.text }, { ...typography.h3 }]}
      >{`$${item.value}`}</Text>
      <View style={styles.row}>
        <View style={styles.del}>
          {item.deltaPercent > 0 ? (
            <ArrowUp color={colors.success} width={16} />
          ) : (
            <ArrowDown color={colors.error} width={16} />
          )}
          <Text
            style={[
              { color: item.deltaPercent > 0 ? colors.success : colors.error },
              { ...typography.h3 },
            ]}
          >{`${item.deltaPercent.toString().replace('-', '')}%`}</Text>
        </View>
        <SimpleLineChart
          data={item.sparkline}
          color={item.deltaPercent > 0 ? colors.success : colors.error}
        />
        <Pressable onPress={() => togglePinned(item.id)}>
          <PinIcon color={isPinned ? colors.success : colors.text} width={16} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  del: {
    flexDirection: 'row',
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default React.memo(CardMetric);
