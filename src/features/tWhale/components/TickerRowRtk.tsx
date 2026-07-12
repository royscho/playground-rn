import { useAppTheme } from '@/shared/hooks';
import React, { FC, useCallback, useMemo } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWatchlist } from '../store/tickerStore.rtk';
import type { AppDispatch, RootState } from '../store/tickerStore.rtk';
import { Campaign } from '../types';

interface Props {
  item: Campaign;
  showStarButton: boolean;
  isActive: boolean;
}

const TickerRowRtk: FC<Props> = ({ item, showStarButton, isActive }) => {
  const dispatch = useDispatch<AppDispatch>();
  // Selecting a single Record entry, same normalized-state discipline as
  // the Zustand version — Redux has no built-in fine-grained tracking like
  // MobX, so this manual "select just the slice you need" habit is what
  // keeps rows isolated. useSelector's default equality is reference
  // (===) just like Zustand's.
  const metric = useSelector(
    (state: RootState) => state.ticker.metrics[item.campaignId],
  );

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
    () => dispatch(toggleWatchlist(item.campaignId)),
    [dispatch, item.campaignId],
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

export default React.memo(TickerRowRtk);
