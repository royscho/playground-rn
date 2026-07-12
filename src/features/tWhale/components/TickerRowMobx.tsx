import { useAppTheme } from '@/shared/hooks';
import React, { FC, useCallback, useMemo } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { tickerStore } from '../store/tickerStore.mobx';
import { Campaign } from '../types';

interface Props {
  item: Campaign;
  showStarButton: boolean;
  isActive: boolean;
}

// No selector hook, no props threading a slice of state down — `observer`
// wraps the component and MobX records every observable read during this
// render (here: `tickerStore.metrics.get(item.campaignId)`). Only a change
// to THAT specific map entry re-renders this row — same isolation property
// the Zustand version gets via `useTickerStore(s => s.metrics[id])`, but
// MobX derives it from what the render function actually touched, not from
// an explicit selector you write.
const TickerRowMobx: FC<Props> = observer(({ item, showStarButton, isActive }) => {
  const metric = tickerStore.metrics.get(item.campaignId);

  const { colors, spacing } = useAppTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: { color: colors.text, textAlign: 'center' },
        item: {
          backgroundColor: isActive ? colors.success : colors.secondary,
          padding: spacing.lg,
          marginVertical: spacing.md,
        },
        row: { flexDirection: 'row', flex: 1, justifyContent: 'space-between' },
      }),
    [spacing, colors, isActive],
  );

  const toggle = useCallback(
    () => tickerStore.toggleWatchlist(item.campaignId),
    [item.campaignId],
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
});

export default React.memo(TickerRowMobx);
