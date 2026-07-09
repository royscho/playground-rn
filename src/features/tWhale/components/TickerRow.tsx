import { useAppTheme } from '@/shared/hooks';
import React, { FC, useCallback, useMemo } from 'react';
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
  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: {
          color: colors.text,
          textAlign: 'center',
        },
        item: {
          backgroundColor: isActive ? colors.success : colors.secondary,
          padding: spacing.lg,
          marginVertical: spacing.md,
        },
        row: {
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-between',
        },
      }),
    [spacing, colors, isActive],
  );

  const toggle = useCallback(
    () => toggleWatchlist(item.campaignId),
    [toggleWatchlist, item.campaignId],
  );

  return (
    <View style={styles.item}>
      {showStarButton && <Button title="toggle watchlist" onPress={toggle} />}
      <Text style={styles.title}>{item.name}</Text>
      <View style={styles.row}>
        <Text style={styles.title}>{metric?.spend}</Text>
        <Text style={styles.title}>{metric?.revenue}</Text>
        <Text style={styles.title}>{metric?.roas.toFixed(2)}</Text>
      </View>
    </View>
  );
};
export default React.memo(TickerRow);
