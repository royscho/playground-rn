import { useAppTheme } from '@/shared/hooks';
import React, { FC, useCallback } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useTickerStore } from '../store/tickerStore';
import { Campaign } from '../types';

interface Props {
  item: Campaign;
  showStarButton: boolean;
  isActive: boolean;
}

const TickerRow: FC<Props> = ({ item, showStarButton, isActive }) => {
  const toggleWatchlist = useTickerStore(state => state.toggleWatchlist);
  const metric = useTickerStore(state => state.metrics[item.campaignId]);
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
      {showStarButton && <Button title="toggle watchlist" onPress={toggle} />}
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
