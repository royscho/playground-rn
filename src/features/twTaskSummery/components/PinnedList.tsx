import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { usePinned } from '../hooks/usePinned';
import { useMetrics } from '../hooks/useMetrics';
import { useMemo } from 'react';
import { useAppTheme } from '@/shared/hooks';
import { SummaryMetric } from '../types';

const PinnedList = () => {
  const { spacing, colors, typography } = useAppTheme();
  const pinned = usePinned(state => state.pinned);
  const getTotal = usePinned(state => state.pinned.size);
  const { data } = useMetrics();
  const pinnedMetrics = useMemo(
    () => (data ?? [])?.filter(m => pinned?.has(m.id)),
    [data, pinned],
  );

  const renderItem: ListRenderItem<SummaryMetric> = ({ item }) => (
    <View
      style={[
        styles.item,
        {
          backgroundColor: colors.surface,
          borderRadius: spacing.sm,
          padding: spacing.sm,
          marginBottom: spacing.sm,
          gap: spacing.sm,
          marginRight: spacing.sm,
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[{ color: colors.text }, { ...typography.label }]}
      >
        {item.label}
      </Text>
      <Text
        numberOfLines={1}
        style={[{ color: colors.text }, { ...typography.label }]}
      >
        {item.value}
      </Text>
    </View>
  );

  return (
    <>
      <View style={styles.title}>
        <Text style={{ color: colors.text, ...typography.h3 }}>Pinned</Text>
        <View
          style={[
            styles.total,
            {
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.xs,
            },
          ]}
        >
          <Text style={{ color: colors.text, ...typography.label }}>
            {getTotal}
          </Text>
        </View>
      </View>
      <FlatList
        data={pinnedMetrics}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        horizontal
      />
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    width: 140,
  },
  title: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  total: {
    borderRadius: 8,
    width: 20,
    alignItems: 'center',
  },
});
export default PinnedList;
