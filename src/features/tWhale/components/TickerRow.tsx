import { useAppTheme } from '@/shared/hooks';
import React, { FC, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTickerStoreImmer } from '../store/tickerStore.immer';
import { Campaign } from '../types';

interface Props {
  item: Campaign;
  showStarButton: boolean;
  isActive: boolean;
}

const TickerRow: FC<Props> = ({ item, showStarButton, isActive }) => {
  const toggleWatchlist = useTickerStoreImmer(state => state.toggleWatchlist);
  const metric = useTickerStoreImmer(state => state.metrics[item.campaignId]);
  // Boolean selector — safe with Zustand's default reference-equality check
  // (primitives compare by value), so this row only re-renders when ITS OWN
  // watchlist membership actually flips, not on every watchlist Set change
  // for other campaigns.
  const isWatchlisted = useTickerStoreImmer(state =>
    state.watchlist.has(item.campaignId),
  );
  const { colors, spacing } = useAppTheme();

  const toggle = useCallback(
    () => toggleWatchlist(item.campaignId),
    [toggleWatchlist, item.campaignId],
  );

  return (
    <View
      style={{
        backgroundColor: isActive ? colors.success : colors.secondary,
        padding: spacing.lg,
        marginVertical: spacing.md,
      }}
    >
      {showStarButton && (
        <TouchableOpacity
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={
            isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'
          }
        >
          <Star
            size={20}
            color={colors.warning}
            fill={isWatchlisted ? colors.warning : 'none'}
          />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
      <View style={styles.row}>
        <Text style={[styles.title, { color: colors.text }]}>
          {metric?.spend}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          {metric?.revenue}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          {metric?.roas.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default React.memo(TickerRow);
